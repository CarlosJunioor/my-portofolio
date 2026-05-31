import type { Metadata } from "next";
import { Syne, Manrope, Martian_Mono } from "next/font/google";
import "./globals.css";
import { Starfield } from "@/components/background/Starfield";
import { NebulaBackdrop } from "@/components/background/NebulaBackdrop";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { profile } from "@/content/profile";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.shortBio}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.bio.slice(0, 160),
  metadataBase: new URL("https://carlosjuniordev.vercel.app"),
  openGraph: {
    title: profile.name,
    description: profile.shortBio,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", creator: "@CarlosJuniordev" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <NebulaBackdrop />
        <Starfield />
        <Navbar />
        <main className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
