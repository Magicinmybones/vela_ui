import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vela — Infrastructure that moves like light",
  description: "A precision-built responsive landing page for Vela's real-time data platform.",
};

export default function Home() {
  return (
    <iframe
      className="site-frame"
      src="/vela-infrastructure.html"
      title="Vela — Infrastructure that moves like light"
    />
  );
}
