import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Kihan India — Universe of Essentials",
  description: "Handcrafted jewellery, journals, and bags. Made in India.",
  keywords: ["kihan india", "handcrafted jewellery", "brass jewellery", "bamboo journal", "handmade bags"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex flex-col min-h-screen" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
        <AnnouncementBar />
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
