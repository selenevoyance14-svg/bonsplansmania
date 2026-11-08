import type { Metadata, Viewport } from "next";
import { DM_Sans, Lora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientShell from "@/app/components/ClientShell";

const GA_MEASUREMENT_ID = "G-HH3TT98TED";
const ADSENSE_CLIENT_ID = "ca-pub-5064203547863113";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lora",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bonsplansmania.fr"),
  title: "Bons Plans Mania : bons plans et codes promo du moment",
  description:
    "Bons plans et codes promo : beauté, maison, jouets et high-tech. Retrouvez aussi les box, jeux concours et tests de produits gratuits sur Bons Plans Mania.",
  alternates: {
    canonical: "https://bonsplansmania.fr",
    types: {
      "application/rss+xml": "https://bonsplansmania.fr/rss.xml",
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Bons Plans Mania — Bons plans et codes promo",
    description: "Beauté, maison, jouets et high-tech : bons plans, codes promo, box, concours et tests de produits gratuits.",
    type: "website",
    locale: "fr_FR",
    url: "https://bonsplansmania.fr",
    siteName: "BonsPlansMania",
    images: [
      {
        url: "https://bonsplansmania.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bons Plans Mania — Bons plans, codes promo et tests gratuits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bons Plans Mania — Bons plans et codes promo",
    description: "Beauté, maison, jouets et high-tech : bons plans, codes promo, box, concours et tests de produits gratuits.",
    images: ["https://bonsplansmania.fr/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${lora.variable}`}>
      <head>
        <meta name="p:domain_verify" content="0838f88b7492c11b6a4fa4f10edbf7ef" />
        <meta name="msvalidate.01" content="1E74255D934E3CCDB2B46C09841223E0" />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className={dmSans.className}>
        {children}
        <div data-nosnippet>
        <footer
          style={{
            margin: 0,
            padding: "16px 20px",
            background: "#111827",
            color: "#d1d5db",
            fontSize: "0.75rem",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          <nav aria-label="Liens de pied de page" style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
            <a href="/archives" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>Archives</a>
            <a href="/categorie/concours" style={{ color: "#ffffff" }}>Concours en cours</a>
            <a href="/guide-air-fryer-2026" style={{ color: "#ffffff" }}>Guide Air Fryer</a>
            <a href="/idees-cadeaux-noel-2026" style={{ color: "#ffffff" }}>Idées cadeaux</a>
            <a href="/guide-gratuit" style={{ color: "#ffffff" }}>Guide tests gratuits</a>
            <a href="/marques-partenaires" style={{ color: "#ffffff" }}>Marques partenaires</a>
            <a href="/mentions-legales" style={{ color: "#ffffff" }}>Mentions légales</a>
            <a href="/confidentialite" style={{ color: "#ffffff" }}>Confidentialité</a>
          </nav>
          <p style={{ margin: 0 }}>
            En tant que Partenaire Amazon, Bons Plans Mania réalise un bénéfice sur les achats remplissant les conditions requises.
          </p>
        </footer>
        </div>
        <ClientShell />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
