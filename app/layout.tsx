import type { Metadata } from "next";
import {
  IBM_Plex_Serif,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"], // Arabic added per system specifications
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-arabic", // Distinct variable for Arabic text
});

export const metadata: Metadata = {
  title: "Academic Heritage System",
  description:
    "A balanced layout for traditional and modern education platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSerif.variable} ${ibmPlexSans.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body className="bg-background text-on-background font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
