import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

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
      className={outfit.variable}
    >
      <body
        className={`${outfit.className} min-h-screen flex flex-col bg-theme-bg antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
