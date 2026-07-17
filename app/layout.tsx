import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: `${company.name} | Premium Digital Solutions in Somalia`,
  description:
    "Hillaac ICT Solutions builds premium brands, websites, mobile apps, custom software, cloud systems, and digital marketing for Somali businesses and institutions.",
  keywords: [
    "Hillaac ICT Solutions",
    "Somalia technology company",
    "Mogadishu web development",
    "mobile app development Somalia",
    "ERP systems Somalia",
    "branding Somalia"
  ],
  openGraph: {
    title: company.name,
    description: company.slogan,
    type: "website",
    locale: "en_US"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
