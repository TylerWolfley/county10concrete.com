import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MobileCta } from "@/components/MobileCta";
import { SiteBehavior } from "@/components/SiteBehavior";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "County 10 Concrete",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon/c10-favicon-transparent-256.png", sizes: "256x256", type: "image/png" }
    ],
    apple: "/favicon/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="light">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
        <MobileCta />
        <SiteBehavior />
      </body>
    </html>
  );
}
