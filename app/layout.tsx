import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FinSight India — Quantitative Intelligence",
  description: "Automated Quantitative Research Utility — Not SEBI Registered",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${mono.variable}`}>
      <body className="antialiased" style={{ fontFamily: "var(--font-syne), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
