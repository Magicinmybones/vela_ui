import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vela — Infrastructure that moves like light",
  description: "Responsive Vela real-time infrastructure landing page.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
