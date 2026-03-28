import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI News Ticker",
  description: "Real-time AI news feed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
