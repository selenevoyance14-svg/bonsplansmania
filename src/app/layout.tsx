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
  // metadataBase : base URL utilisée pour résoudre toutes les URLs relatives (og:image, twitter:image, etc.)
  metadataBase: new URL("https://bonsplansmania.fr"),
  // Title raccourci à 57 chars (avant : 67 chars → tronqué à ~60 chars dans Google SERP)
  title: "Bons Plans Mania : bons plans, concours et tests gratuits",
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
  // meta keywords supprimé : ignoré par Google depuis 2009 + signal "ancien" qui révèle la stratégie aux concurrents
  openGraph: {
    title: "Bons Plans Mania — Bons plans beauté & tests gratuits",
    description: "Les meilleurs bons plans beauté, tests gratuits, concours et avis box beauté.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr",
    siteName: "BonsPlansMania",
    images: [
      {
        // PNG au lieu de SVG : Facebook, LinkedIn, Pinterest, WhatsApp ignorent ou rejettent les SVG
        // → partages cassés sur réseaux sociaux. Le PNG 1200×630 est le standard og:image.
        url: "https://bonsplansmania.fr/og-image.png",
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
    images: ["https://bonsplansmania.fr/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={poppins.variable}>
      <head>
        {/* AdSense Auto Ads : le script async suffit. Les Auto Ads sont activés depuis le dashboard AdSense.
            L'inline push avec enable_page_level_ads est deprecated depuis 2022 (redondant avec Auto Ads dashboard)
            et bloquait brièvement le parseur HTML → retiré. */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5064203547863113" crossOrigin="anonymous" />
      </head>
      <body className={poppins.className}>
        {children}
        <ClientShell />
      </body>
    </html>
  );
}
