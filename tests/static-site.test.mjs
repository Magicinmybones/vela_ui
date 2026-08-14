import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build emits the Vela home page at the deployment root", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /<title>Vela — Infrastructure that moves like light<\/title>/i);
  assert.match(html, /<main class="shell"/i);
});

test("ships the complete responsive, code-only Vela interface", async () => {
  const source = await readFile(new URL("../index.html", import.meta.url), "utf8");

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
