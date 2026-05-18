import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostMortem AI — Incident Postmortem Generator",
  description:
    "Generate professional SRE incident postmortem reports in seconds using AI. Built for DevOps engineers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
