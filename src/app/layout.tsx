import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientShell from "@/app/components/ClientShell";
import AdBlock from "@/app/components/AdBlock";

const GA_MEASUREMENT_ID = "G-HH3TT98TED";

const INMOBI_CHOICE_CMP = `
(function() {
  var host = "www.themoneytizer.com";
  var element = document.createElement('script');
  var firstScript = document.getElementsByTagName('script')[0];
  var url = 'https://cmp.inmobi.com'
    .concat('/choice/', '6Fv0cGNfc_bw8', '/', host, '/choice.js?tag_version=V3');
  var uspTries = 0;
  var uspTriesLimit = 3;
  element.async = true;
  element.type = 'text/javascript';
  element.src = url;

  firstScript.parentNode.insertBefore(element, firstScript);

  function makeStub() {
    var TCF_LOCATOR_NAME = '__tcfapiLocator';
    var queue = [];
    var win = window;
    var cmpFrame;

    function addFrame() {
      var doc = win.document;
      var otherCMP = !!(win.frames[TCF_LOCATOR_NAME]);

      if (!otherCMP) {
        if (doc.body) {
          var iframe = doc.createElement('iframe');

          iframe.style.cssText = 'display:none';
          iframe.name = TCF_LOCATOR_NAME;
          doc.body.appendChild(iframe);
        } else {
          setTimeout(addFrame, 5);
        }
      }
      return !otherCMP;
    }

    function tcfAPIHandler() {
      var gdprApplies;
      var args = arguments;

      if (!args.length) {
        return queue;
      } else if (args[0] === 'setGdprApplies') {
        if (
          args.length > 3 &&
          args[2] === 2 &&
          typeof args[3] === 'boolean'
        ) {
          gdprApplies = args[3];
          if (typeof args[2] === 'function') {
            args[2]('set', true);
          }
        }
      } else if (args[0] === 'ping') {
        var retr = {
          gdprApplies: gdprApplies,
          cmpLoaded: false,
          cmpStatus: 'stub'
        };

        if (typeof args[2] === 'function') {
          args[2](retr);
        }
      } else {
        if (args[0] === 'init' && typeof args[3] === 'object') {
          args[3] = Object.assign(args[3], { tag_version: 'V3' });
        }
        queue.push(args);
      }
    }

    function postMessageEventHandler(event) {
      var msgIsString = typeof event.data === 'string';
      var json = {};

      try {
        if (msgIsString) {
          json = JSON.parse(event.data);
        } else {
          json = event.data;
        }
      } catch (ignore) {}

      var payload = json.__tcfapiCall;

      if (payload) {
        window.__tcfapi(
          payload.command,
          payload.version,
          function(retValue, success) {
            var returnMsg = {
              __tcfapiReturn: {
                returnValue: retValue,
                success: success,
                callId: payload.callId
              }
            };
            if (msgIsString) {
              returnMsg = JSON.stringify(returnMsg);
            }
            if (event && event.source && event.source.postMessage) {
              event.source.postMessage(returnMsg, '*');
            }
          },
          payload.parameter
        );
      }
    }

    while (win) {
      try {
        if (win.frames[TCF_LOCATOR_NAME]) {
          cmpFrame = win;
          break;
        }
      } catch (ignore) {}

      if (win === window.top) {
        break;
      }
      win = win.parent;
    }
    if (!cmpFrame) {
      addFrame();
      win.__tcfapi = tcfAPIHandler;
      win.addEventListener('message', postMessageEventHandler, false);
    }
  }

  makeStub();

  var uspStubFunction = function() {
    var arg = arguments;
    if (typeof window.__uspapi !== uspStubFunction) {
      setTimeout(function() {
        if (typeof window.__uspapi !== 'undefined') {
          window.__uspapi.apply(window.__uspapi, arg);
        }
      }, 500);
    }
  };

  var checkIfUspIsReady = function() {
    uspTries++;
    if (window.__uspapi === uspStubFunction && uspTries < uspTriesLimit) {
      console.warn('USP is not accessible');
    } else {
      clearInterval(uspInterval);
    }
  };

  if (typeof window.__uspapi === 'undefined') {
    window.__uspapi = uspStubFunction;
    var uspInterval = setInterval(checkIfUspIsReady, 6000);
  }
})();
`;

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
        <Script id="inmobi-choice-cmp" strategy="beforeInteractive">
          {INMOBI_CHOICE_CMP}
        </Script>
      </head>
      <body className={poppins.className}>
        {children}
        <AdBlock moneytizerFormat="6" className="moneytizer-footer-ad" />
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
