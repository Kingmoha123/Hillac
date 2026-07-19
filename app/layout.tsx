import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { company } from "@/data/site";
import { defaultDescription, defaultKeywords, defaultOgImage, siteUrl } from "@/lib/seo";
import { organizationJsonLd, professionalServiceJsonLd, websiteJsonLd } from "@/lib/structured-data";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["600", "700", "800", "900"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} | Digital Solutions in Somalia`,
    template: `%s | ${company.name}`
  },
  description: defaultDescription,
  keywords: defaultKeywords,
  authors: [{ name: company.name }],
  creator: company.name,
  publisher: company.name,
  applicationName: company.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${company.name} | Digital Solutions in Somalia`,
    description: defaultDescription,
    url: "/",
    siteName: company.name,
    type: "website",
    locale: "en_US",
    images: [defaultOgImage]
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | Digital Solutions in Somalia`,
    description: defaultDescription,
    images: [defaultOgImage.url]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <JsonLd data={[organizationJsonLd, websiteJsonLd, professionalServiceJsonLd]} />
        <AnalyticsProvider />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
