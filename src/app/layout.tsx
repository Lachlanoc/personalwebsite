import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import { site } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import "./globals.css";

// Plex for prose and code. Japanese text uses the reader's system fonts (see
// --font-sans in globals.css): the web font's declarations alone would add
// about 67 KB of CSS to every page.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
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
      className={`${plexSans.variable} ${plexMono.variable}`}
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
        <div id="content" className="flex-1 pb-24 pt-10">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
