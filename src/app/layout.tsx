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
  // Lets pages give relative URLs for their canonical link and preview image.
  metadataBase: new URL(site.url),
  title: { default: "Lachlan O'Connell", template: "%s | Lachlan O'Connell" },
  description: site.description,
  icons: {
    icon: [
      { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/favicon/site.webmanifest",
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
        {/* Here rather than in metadata: a page's own "alternates" would replace it. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Lachlan O'Connell"
          href="/feed.xml"
        />
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
