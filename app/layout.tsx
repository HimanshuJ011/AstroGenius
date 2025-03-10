import type { Metadata } from "next";
import "./globals.css";
import DisableDevTools from "@/components/DisableDevTools";
import { Analytics } from "@vercel/analytics/react";
export const metadata: Metadata = {
  title: "Astro Genius",
  description: "Generate Astro Report in Click.",
};

declare global {
  interface Window {
    searchTimeout: NodeJS.Timeout;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning suppressContentEditableWarning lang="en">
      <body>
        <DisableDevTools />
        <Analytics />

        {children}
      </body>
    </html>
  );
}
