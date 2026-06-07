import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinSight India",
  description: "Automated Quantitative Research Utility — Not SEBI Registered",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 antialiased">{children}</body>
    </html>
  );
}
