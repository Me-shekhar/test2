import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CathShield.ai - IV/Central Line Safety Monitoring",
  description:
    "Medical quality & safety web app for IV/central line monitoring, CLABSI risk assessment, and hospital HAI metrics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
