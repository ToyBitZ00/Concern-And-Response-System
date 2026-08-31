import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoGlobe | Waste Disposal Concern & Response System",
  description:
    "A digital waste concern reporting and response system for Barangay Barangca, Candaba, Pampanga.",
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