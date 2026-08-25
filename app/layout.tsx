import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/lib/context/AudioContext";
import { Navbar } from "@/components/Navbar";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";

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
  title: "Julian Vance — Composer & Music Producer",
  description: "Official portfolio of Julian Vance, composer & music producer for film, TV, songs, and brand campaigns.",
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
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          
          {/* Footer */}
          <footer className="py-12 border-t border-white/5 text-center text-xs tracking-widest text-zinc-500 uppercase font-mono">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span>© {new Date().getFullYear()} JULIAN VANCE. ALL RIGHTS RESERVED.</span>
              <span>LOS ANGELES • LONDON</span>
            </div>
          </footer>

          <GlobalAudioPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
