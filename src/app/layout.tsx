import Footer from "@/app/_components/footer";
import Header from "@/app/_components/header";
import Container from "@/app/_components/container";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { ThemeSwitcher } from "./_components/theme-switcher";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Lachlan O'Connell`,
  description: `Where I post about my projects, and ideas.`,
  // openGraph: {
  //   images: [HOME_OG_IMAGE_URL],
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(inter.className, "dark:bg-slate-900 dark:text-slate-400")}
      >
          <div className="">
            <ThemeSwitcher />
          </div>
          <div className="min-h-screen">
            <Container>
              <Header />
            </Container>
            {children}
          </div>
        <Footer />
      </body>
    </html>
  );
}
