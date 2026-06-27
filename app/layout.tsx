import type { Metadata } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { HomeSnowfall } from "@/components/home/HomeSnowfall";
import { PointerGlow } from "@/components/PointerGlow";
import { siteName } from "@/lib/data/site";

const siteDescription = "蓝水警尘梦，夜吟开草堂";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans",
  display: "swap"
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-noto-serif",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${siteName}官网`,
    template: `%s | ${siteName}`
  },
  description: siteDescription,
  openGraph: {
    title: `${siteName}官网`,
    description: siteDescription,
    siteName,
    locale: "zh_CN",
    type: "website",
    images: ["/images/server/server-home-reading.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName}官网`,
    description: siteDescription,
    images: ["/images/server/server-home-reading.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className="font-sans antialiased">
        <HomeSnowfall />
        <PointerGlow />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
