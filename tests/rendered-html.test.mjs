import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Vela application shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Vela — Infrastructure that moves like light<\/title>/i);
  assert.match(html, /<iframe[^>]+src="\/vela-infrastructure\.html"/i);
  assert.match(html, /title="Vela — Infrastructure that moves like light"/i);
  assert.doesNotMatch(html, /codex-preview|starter loading skeleton/i);
});

test("ships the complete responsive, code-only Vela interface", async () => {
  const source = await readFile(
    new URL("../public/vela-infrastructure.html", import.meta.url),
    "utf8",
  );

  assert.match(source, /Infrastructure that/);
  assert.match(source, /moves like light\./);
  assert.equal((source.match(/<article class="card /g) ?? []).length, 3);
  assert.match(source, /@media \(min-width: 700px\) and \(max-width: 1100px\)/);
  assert.match(source, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(source, /grid-column:\s*1 \/ -1/);
  assert.match(source, /@keyframes orbit-spin/);
  assert.match(source, /prefers-reduced-motion:\s*reduce/);
  assert.doesNotMatch(source, /<img\b|<picture\b|<video\b|<canvas\b|data:image|https?:\/\//i);
});
