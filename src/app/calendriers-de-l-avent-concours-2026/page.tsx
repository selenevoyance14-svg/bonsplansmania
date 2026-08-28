import type { Metadata } from "next";
import {
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Gift,
  SearchCheck,
  Sparkles,
  TreePine,
  Trophy,
} from "lucide-react";
import Header from "@/app/components/Header";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import NewsletterInline from "@/app/components/NewsletterInline";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";

const PAGE_URL = "https://bonsplansmania.fr/calendriers-de-l-avent-concours-2026";

export const metadata: Metadata = {
  title: "Calendriers de l'Avent concours 2026 : jeux gratuits",
  description:
    "Tous les calendriers de l'Avent concours 2026 gratuits : marques, enseignes et médias. Jeux vérifiés, dates de fin et cadeaux à gagner.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calendriers de l'Avent concours 2026",
    description:
      "La liste mise à jour des calendriers de l'Avent gratuits et des jeux de Noël 2026.",
    type: "website",
    locale: "fr_FR",
    url: PAGE_URL,
  },
};

type Article = ReturnType<typeof getAllArticles>[number];

function isAdventContest(article: Article): boolean {
  if (article.meta.category !== "concours" || isEffectivelyExpired(article.meta)) return false;

  const haystack = [
    article.meta.title,
    article.meta.description,
    article.meta.slug,
    ...(article.meta.tags || []),
  ]
    .join(" ")
    .toLocaleLowerCase("fr-FR");

  const mentionsCalendar = haystack.includes("calendrier");
  const mentionsChristmas =
    haystack.includes("avent") || haystack.includes("noël") || haystack.includes("noel");

  return mentionsCalendar && mentionsChristmas;
}

const faq = [
  {
    question: "Quand commencent les calendriers de l'Avent concours 2026 ?",
    answer:
      "Les premières annonces apparaissent généralement en octobre et novembre. La majorité des calendriers quotidiens ouvrent le 1er décembre 2026.",
  },
  {
    question: "Les jeux recensés sont-ils gratuits ?",
    answer:
      "La sélection privilégie les jeux gratuits sans obligation d'achat. Lorsqu'un achat ou une condition particulière est nécessaire, cela est précisé dans l'article.",
  },
  {
    question: "Peut-on participer chaque jour ?",
    answer:
      "Cela dépend du règlement. Certains calendriers autorisent une participation quotidienne, tandis que d'autres limitent la participation à une seule fois pendant toute l'opération.",
  },
  {
    question: "Comment savoir si un calendrier est encore ouvert ?",
    answer:
      "Bons Plans Mania indique les dates connues et retire automatiquement les concours terminés de la sélection principale.",
  },
];

const timeline = [
  { period: "Septembre – octobre", text: "Premières annonces et inscriptions anticipées" },
  { period: "Novembre", text: "Ouverture progressive des pages de participation" },
  { period: "1er décembre", text: "Début de la majorité des calendriers quotidiens" },
  { period: "24 – 31 décembre", text: "Derniers tirages et clôture des opérations" },
];

export default function CalendriersAventConcours2026Page() {
  const contests = getAllArticles()
    .filter(isAdventContest)
    .sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());

  const updatedAt = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Calendriers de l'Avent concours 2026",
      description:
        "Liste vérifiée des calendriers de l'Avent concours et jeux gratuits de Noël 2026.",
      url: PAGE_URL,
      dateModified: new Date().toISOString(),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: contests.length,
        itemListElement: contests.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://bonsplansmania.fr/article/${article.meta.slug}`,
          name: article.meta.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <>
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section
          style={{
            background:
              "linear-gradient(90deg, rgba(37,7,17,.97) 0%, rgba(63,13,29,.9) 43%, rgba(63,13,29,.4) 70%, rgba(20,83,45,.16) 100%), url('/images/pages/calendriers-avent-concours-2026-hero.webp') center right / cover no-repeat",
            color: "white",
            padding: "62px 0 52px",
            borderBottom: "3px solid #d6a84b",
          }}
        >
          <div className="container">
            <nav className="breadcrumbs" style={{ color: "white" }} aria-label="Fil d'Ariane">
              <a href="/" style={{ color: "white" }}>Accueil</a>
              <ChevronRight size={12} aria-hidden style={{ margin: "0 4px", opacity: 0.7 }} />
              <a href="/categorie/concours" style={{ color: "white" }}>Concours</a>
              <ChevronRight size={12} aria-hidden style={{ margin: "0 4px", opacity: 0.7 }} />
              <span style={{ color: "white" }}>Calendriers de l&apos;Avent 2026</span>
            </nav>

            <div style={{ maxWidth: "900px" }}>
              <p
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  margin: "8px 0 14px",
                  padding: "7px 12px",
                  border: "1px solid rgba(255,255,255,.35)",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,.1)",
                  fontSize: ".83rem",
                  fontWeight: 700,
                }}
              >
                <SearchCheck size={15} aria-hidden /> Jeux vérifiés et dates contrôlées
              </p>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(2rem, 5vw, 3.25rem)",
                  lineHeight: 1.08,
                  fontWeight: 800,
                  letterSpacing: "-.035em",
                }}
              >
                Calendriers de l&apos;Avent concours 2026
              </h1>
              <p style={{ margin: "18px 0 0", maxWidth: "790px", fontSize: "1.08rem", lineHeight: 1.7, opacity: 0.96 }}>
                Retrouvez les calendriers de l&apos;Avent gratuits proposés par les marques,
                enseignes et médias. Chaque jeu est vérifié avec ses dates, ses conditions
                de participation et les cadeaux annoncés.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "22px" }}>
                <span style={heroBadgeStyle}>
                  <Trophy size={15} aria-hidden /> {contests.length} concours actuellement recensé{contests.length > 1 ? "s" : ""}
                </span>
                <span style={heroBadgeStyle}>
                  <CalendarDays size={15} aria-hidden /> Mise à jour le {updatedAt}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{ padding: 0 }}>
          <AdBlock />
        </section>

        <nav className="section" aria-label="Accès rapide" style={{ paddingTop: "18px", paddingBottom: "6px" }}>
          <div className="container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            {[
              ["#concours", "Concours ouverts"],
              ["#calendrier", "Dates à retenir"],
              ["#conseils", "Bien participer"],
              ["#questions", "Questions fréquentes"],
            ].map(([href, label]) => (
              <a key={href} href={href} style={quickLinkStyle}>{label}</a>
            ))}
          </div>
        </nav>

        <section id="concours" className="section">
          <div className="container">
            <div className="section-title">
              <h2>
                <Gift size={23} aria-hidden style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#991b1b" }} />
                Les calendriers concours ouverts
              </h2>
              <p>La liste sera complétée au fil des annonces officielles.</p>
            </div>

            {contests.length > 0 ? (
              <div className="articles-grid">
                {contests.map((article, index) => (
                  <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
                ))}
              </div>
            ) : (
              <div
                style={{
                  maxWidth: "850px",
                  margin: "0 auto",
                  padding: "34px clamp(20px, 5vw, 48px)",
                  border: "1px solid #eadfce",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #fffaf2, #ffffff)",
                  textAlign: "center",
                }}
              >
                <TreePine size={38} aria-hidden color="#166534" style={{ marginBottom: "12px" }} />
                <h3 style={{ margin: "0 0 10px", fontSize: "1.35rem" }}>La sélection 2026 arrive bientôt</h3>
                <p style={{ margin: "0 auto", maxWidth: "650px", color: "#5f5549", lineHeight: 1.7 }}>
                  Les premiers calendriers sont généralement annoncés à l&apos;automne. Cette page est déjà prête et chaque nouveau jeu apparaîtra ici après vérification.
                </p>
                <div style={{ maxWidth: "680px", margin: "24px auto 0", textAlign: "left" }}>
                  <NewsletterInline formLocation="calendriers_avent_concours_2026" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="calendrier" className="section" style={{ background: "#f8f4ee" }}>
          <div className="container">
            <div className="section-title">
              <h2>Les dates à retenir en 2026</h2>
              <p>Le rythme habituel des calendriers concours de fin d&apos;année.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" }}>
              {timeline.map((item, index) => (
                <article key={item.period} style={timelineCardStyle}>
                  <span style={{ color: "#991b1b", fontSize: ".78rem", fontWeight: 800 }}>ÉTAPE {index + 1}</span>
                  <h3 style={{ margin: "8px 0 6px", fontSize: "1.02rem" }}>{item.period}</h3>
                  <p style={{ margin: 0, color: "#5f5549", fontSize: ".9rem", lineHeight: 1.55 }}>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="conseils" className="section">
          <div className="container">
            <div className="section-title">
              <h2>Comment participer sans rien manquer</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "18px" }}>
              {[
                { Icon: Clock3, title: "Revenez chaque jour", text: "De nombreux calendriers proposent une nouvelle case et un nouveau lot toutes les 24 heures." },
                { Icon: SearchCheck, title: "Lisez les conditions", text: "Vérifiez l'âge requis, la zone géographique, la fréquence autorisée et la date exacte de clôture." },
                { Icon: Bell, title: "Gardez vos favoris", text: "Enregistrez les concours intéressants et activez un rappel pour les jeux à participation quotidienne." },
              ].map(({ Icon, title, text }) => (
                <article key={title} style={{ padding: "24px", border: "1px solid #eadfce", borderRadius: "18px", background: "white" }}>
                  <Icon size={24} aria-hidden color="#166534" />
                  <h3 style={{ margin: "12px 0 7px", fontSize: "1.08rem" }}>{title}</h3>
                  <p style={{ margin: 0, color: "#5f5549", lineHeight: 1.65, fontSize: ".92rem" }}>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="questions" className="section" style={{ background: "#f8f4ee" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <div className="section-title">
              <h2>Questions fréquentes</h2>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {faq.map((item) => (
                <details key={item.question} style={{ background: "white", border: "1px solid #eadfce", borderRadius: "14px", padding: "17px 20px" }}>
                  <summary style={{ cursor: "pointer", fontWeight: 700 }}>{item.question}</summary>
                  <p style={{ margin: "12px 0 0", color: "#5f5549", lineHeight: 1.65 }}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-title">
              <h2><Sparkles size={22} aria-hidden style={{ display: "inline", verticalAlign: "middle", marginRight: "8px", color: "#d6a84b" }} />À découvrir aussi</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px" }}>
              {[
                { href: "/categorie/concours", title: "Tous les concours", text: "Les jeux gratuits actuellement ouverts" },
                { href: "/noel", title: "Le coin Noël", text: "Calendriers, coffrets et bons plans cadeaux" },
                { href: "/categorie/calendrier-avent", title: "Calendriers de l'Avent 2026", text: "Les calendriers beauté, enfants et gourmands" },
              ].map((item) => (
                <a key={item.href} href={item.href} style={{ ...timelineCardStyle, textDecoration: "none", color: "inherit" }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: "1.02rem", color: "#7f1d1d" }}>{item.title}</h3>
                  <p style={{ margin: 0, color: "#5f5549", fontSize: ".9rem" }}>{item.text}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StickyAdMobile />
    </>
  );
}

const heroBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  padding: "7px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,.13)",
  border: "1px solid rgba(255,255,255,.28)",
  color: "white",
  fontSize: ".82rem",
  fontWeight: 700,
} as const;

const quickLinkStyle = {
  display: "inline-flex",
  padding: "8px 14px",
  border: "1px solid #c9bca8",
  borderRadius: "999px",
  background: "white",
  color: "#7f1d1d",
  fontSize: ".88rem",
  fontWeight: 700,
  textDecoration: "none",
} as const;

const timelineCardStyle = {
  padding: "21px",
  border: "1px solid #eadfce",
  borderRadius: "16px",
  background: "white",
} as const;
