import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientShell from "@/app/components/ClientShell";

const GA_MEASUREMENT_ID = "G-HH3TT98TED";

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
        <meta name="msvalidate.01" content="1E74255D934E3CCDB2B46C09841223E0" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5064203547863113" crossOrigin="anonymous" />
      </head>
      <body className={poppins.className}>
        {children}
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
            <a href="/archives/bons-plans" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>Archives des bons plans</a>
            <a href="/archives/concours" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>Archives des concours</a>
            <a href="/archives/tests-produits" style={{ color: "#ffffff", fontWeight: 700, textDecoration: "underline" }}>Archives des tests gratuits</a>
            <a href="/categorie/concours" style={{ color: "#ffffff" }}>Concours en cours</a>
            <a href="/mentions-legales" style={{ color: "#ffffff" }}>Mentions légales</a>
            <a href="/confidentialite" style={{ color: "#ffffff" }}>Confidentialité</a>
          </nav>
          <p style={{ margin: 0 }}>
            En tant que Partenaire Amazon, Bons Plans Mania réalise un bénéfice sur les achats remplissant les conditions requises.
          </p>
        </footer>
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
