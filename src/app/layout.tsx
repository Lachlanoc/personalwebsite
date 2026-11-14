import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import { themeInitScript } from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_JP } from "next/font/google";

import "./globals.css";

// One family for the three scripts the site publishes: prose, code and Japanese.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Japanese glyphs are split into many small files; browsers only fetch the
// ones a page actually uses, so nothing is preloaded.
const plexJp = IBM_Plex_Sans_JP({
  weight: ["400", "600"],
  preload: false,
  variable: "--font-plex-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Lachlan O'Connell`,
  description: `Where I post about my projects, and ideas.`,
  // openGraph: {
  //   images: [HOME_OG_IMAGE_URL],
  // },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#14171c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} ${plexJp.variable}`}
      // The theme script may set data-theme before React hydrates.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-sm focus:bg-paper focus:px-3 focus:py-2"
        >
          Skip to content
        </a>
        <Header />
        <div id="content" className="flex-1 pt-10">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
