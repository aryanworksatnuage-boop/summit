import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leaf — Scream quietly",
  description: "A small place to let loud thoughts out.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
