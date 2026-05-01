import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Karyan Infratech | Luxury Real Estate Delhi NCR",
    template: "%s | Karyan Infratech",
  },
  description:
    "Premier residential and commercial developments across Delhi NCR — Wave City, NH-24, and the Delhi–Meerut Expressway.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      id="top"
      className={`${cormorant.variable} ${outfit.variable}`}
    >
      <body
        className={`${outfit.className} min-h-screen flex flex-col bg-theme-bg antialiased`}
      >
        <SiteShell>
          <main className="flex-1 bg-lux-ivory text-theme-fg">{children}</main>
        </SiteShell>
      </body>
    </html>
  );
}
