import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/lib/context/AudioContext";
import { SiteFrame } from "@/components/SiteFrame";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thejoshuasamuel.vercel.app"),
  title: "Joshua Samuel — Composer & Music Producer",
  description: "Official portfolio of Joshua Samuel, composer & music producer for film, TV, songs, and brand campaigns. Lagos • Nigeria.",
  icons: {
    icon: [
      { url: "/icon.png?v=7", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=7", sizes: "any" },
    ],
    apple: "/apple-icon.png?v=7",
  },
  openGraph: {
    title: "Joshua Samuel — Composer & Music Producer",
    description: "Official portfolio of Joshua Samuel, composer & music producer for film, TV, songs, and brand campaigns.",
    url: "https://thejoshuasamuel.vercel.app",
    siteName: "Joshua Samuel Music",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Joshua Samuel — Composer & Music Producer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Samuel — Composer & Music Producer",
    description: "Official portfolio of Joshua Samuel, composer & music producer for film, TV, songs, and brand campaigns.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} dark h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
        <AudioProvider>
          <SiteFrame>{children}</SiteFrame>
        </AudioProvider>
      </body>
    </html>
  );
}
