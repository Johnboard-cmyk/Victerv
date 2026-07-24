import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VicterV — Fortnite Pro Profile",
  description: "VicterV's Fortnite profile: stats, results, major event timeline, teammates, and socials.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
