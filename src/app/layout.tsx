import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ClientShell from "@/app/components/ClientShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Bons Plans Mania — Bons plans beauté, tests gratuits et concours",
  description:
    "Bons Plans Mania : les meilleurs bons plans beauté, tests de produits gratuits, jeux concours et avis sur les box beauté. Économisez sur vos produits préférés.",
  alternates: { canonical: "https://bonsplansmania.fr" },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "bons plans beauté",
    "tests produits gratuits",
    "concours beauté",
    "box beauté",
    "réductions cosmétiques",
    "codes promo beauté",
    "échantillons gratuits",
  ],
  openGraph: {
    title: "Bons Plans Mania — Bons plans beauté & tests gratuits",
    description: "Les meilleurs bons plans beauté, tests gratuits, concours et avis box beauté.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr",
    siteName: "BonsPlansMania",
    images: [
      {
        url: "https://bonsplansmania.fr/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Bons Plans Mania — Bons plans beauté, tests gratuits et concours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bons Plans Mania — Bons plans beauté & tests gratuits",
    description: "Les meilleurs bons plans beauté, tests gratuits, concours et avis box beauté.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5064203547863113" crossOrigin="anonymous" />
        {/* AdSense Auto Ads — place automatiquement anchor, vignette, overlay, in-page ads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(adsbygoogle = window.adsbygoogle || []).push({google_ad_client: "ca-pub-5064203547863113", enable_page_level_ads: true});`,
          }}
        />
      </head>
      <body className={poppins.className}>
        {children}
        <ClientShell />
      </body>
    </html>
  );
}
