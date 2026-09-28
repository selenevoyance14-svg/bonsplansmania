import type { Metadata } from "next";
import Link from "next/link";
import {
  Blocks,
  CalendarDays,
  ChevronRight,
  Gift,
  SearchCheck,
  Sparkles,
  Users,
} from "lucide-react";
import AdBlock from "@/app/components/AdBlock";
import ArticleCard from "@/app/components/ArticleCard";
import Header from "@/app/components/Header";
import NewsletterInline from "@/app/components/NewsletterInline";
import StickyAdMobile from "@/app/components/StickyAdMobile";
import { getAllArticles, isEffectivelyExpired } from "@/lib/articles";
import styles from "./page.module.css";

const PAGE_URL = "https://bonsplansmania.fr/calendriers-de-l-avent-lego-2026";

const CURRENT_MODELS = [
  {
    slug: "calendrier-avent-lego-city-60510-amazon-2026",
    universe: "LEGO City",
    reference: "60510",
    age: "Dès 5 ans",
    pieces: "252 pièces",
    content: "7 personnages",
    recommendation: "Pour les enfants qui aiment inventer des scènes du quotidien.",
  },
  {
    slug: "calendrier-avent-lego-disney-princess-43298-amazon-2026",
    universe: "Disney Princess",
    reference: "43298",
    age: "Dès 5 ans",
    pieces: "290 pièces",
    content: "8 personnages",
    recommendation: "Pour retrouver Ariel, Vaiana et l'univers des princesses Disney.",
  },
  {
    slug: "calendrier-avent-lego-friends-42698-amazon-2026",
    universe: "LEGO Friends",
    reference: "42698",
    age: "Dès 6 ans",
    pieces: "211 pièces",
    content: "3 mini-poupées et 6 animaux",
    recommendation: "Pour les histoires d'amitié, les animaux et les mini-décors.",
  },
  {
    slug: "calendrier-avent-lego-star-wars-75456-amazon-2026",
    universe: "Star Wars",
    reference: "75456",
    age: "Dès 6 ans",
    pieces: "293 pièces",
    content: "Univers The Mandalorian",
    recommendation: "Pour les fans de Grogu, des vaisseaux et de la saga Star Wars.",
  },
  {
    slug: "calendrier-avent-lego-marvel-76340-amazon-2026",
    universe: "LEGO Marvel",
    reference: "76340",
    age: "Dès 6 ans",
    pieces: "317 pièces",
    content: "6 minifigurines",
    recommendation: "Pour les enfants qui préfèrent les super-héros et les Avengers.",
  },
  {
    slug: "calendrier-avent-lego-harry-potter-76456-amazon-2026",
    universe: "Harry Potter",
    reference: "76456",
    age: "Dès 7 ans",
    pieces: "278 pièces",
    content: "8 minifigurines",
    recommendation: "Pour recréer un Noël magique dans l'univers de Poudlard.",
  },
] as const;

const OLDER_EDITION_SLUGS = [
  "calendrier-avent-lego-minecraft-21280-amazon-2026",
  "calendrier-avent-lego-marvel-gardiens-galaxie-76231-amazon-2026",
] as const;

const faq = [
  {
    question: "Quel calendrier de l'Avent LEGO choisir en 2026 ?",
    answer:
      "Le meilleur choix dépend surtout de l'univers préféré de l'enfant. City et Disney Princess conviennent dès 5 ans, Friends, Star Wars et Marvel dès 6 ans, tandis que Harry Potter est conseillé dès 7 ans.",
  },
  {
    question: "Que contient un calendrier de l'Avent LEGO ?",
    answer:
      "Chaque coffret comprend 24 cases avec des mini-constructions, des accessoires et des personnages. Le nombre de pièces et de figurines varie selon la référence.",
  },
  {
    question: "Les prix des calendriers LEGO peuvent-ils changer ?",
    answer:
      "Oui. Les prix et les stocks peuvent évoluer rapidement à l'approche de Noël. Il faut vérifier le montant affiché sur la fiche du marchand avant de commander.",
  },
  {
    question: "Quand acheter un calendrier de l'Avent LEGO ?",
    answer:
      "Les modèles les plus recherchés peuvent devenir plus chers ou être en rupture avant décembre. Septembre et octobre sont généralement de bonnes périodes pour comparer les offres.",
  },
];

export const metadata: Metadata = {
  title: "Calendriers de l'Avent LEGO 2026 : comparatif et prix",
  description:
    "Comparez les calendriers de l'Avent LEGO 2026 : City, Friends, Disney, Marvel, Star Wars et Harry Potter, avec âge, contenu et prix.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calendriers de l'Avent LEGO 2026 : lequel choisir ?",
    description:
      "Le comparatif des calendriers LEGO 2026 par univers, âge, nombre de pièces et prix.",
    type: "website",
    locale: "fr_FR",
    url: PAGE_URL,
    images: [
      {
        url: "https://m.media-amazon.com/images/I/81btpeKOpRL._AC_SL1500_.jpg",
        width: 1500,
        height: 1500,
        alt: "Calendrier de l'Avent LEGO City 2026",
      },
    ],
  },
};

type Article = ReturnType<typeof getAllArticles>[number];

function findArticles(slugs: readonly string[], articlesBySlug: Map<string, Article>) {
  return slugs
    .map((slug) => articlesBySlug.get(slug))
    .filter((article): article is Article => Boolean(article && !isEffectivelyExpired(article.meta)));
}

export default function CalendriersAventLego2026Page() {
  const articlesBySlug = new Map(
    getAllArticles().map((article) => [article.meta.slug, article]),
  );
  const currentArticles = findArticles(
    CURRENT_MODELS.map((model) => model.slug),
    articlesBySlug,
  );
  const olderEditions = findArticles(OLDER_EDITION_SLUGS, articlesBySlug);

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
      name: "Calendriers de l'Avent LEGO 2026",
      description:
        "Comparatif des calendriers de l'Avent LEGO 2026 par univers, âge, contenu et prix.",
      url: PAGE_URL,
      dateModified: new Date().toISOString(),
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: currentArticles.length,
        itemListElement: currentArticles.map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: article.meta.title,
          url: `https://bonsplansmania.fr/article/${article.meta.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: "https://bonsplansmania.fr/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Calendriers de l'Avent 2026",
          item: "https://bonsplansmania.fr/calendriers-de-l-avent-2026",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Calendriers de l'Avent LEGO 2026",
          item: PAGE_URL,
        },
      ],
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
      <main className={styles.main}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <nav className={styles.breadcrumbs} aria-label="Fil d'Ariane">
              <Link href="/">Accueil</Link>
              <ChevronRight size={13} aria-hidden />
              <Link href="/calendriers-de-l-avent-2026">Calendriers de l&apos;Avent</Link>
              <ChevronRight size={13} aria-hidden />
              <span>LEGO 2026</span>
            </nav>

            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <SearchCheck size={16} aria-hidden /> Sélection vérifiée
              </p>
              <h1>Calendriers de l&apos;Avent LEGO 2026</h1>
              <p className={styles.intro}>
                City, Friends, Disney, Marvel, Star Wars ou Harry Potter : comparez les
                six calendriers LEGO de Noël selon l&apos;âge, le nombre de pièces, les
                personnages et le prix pour choisir le bon coffret.
              </p>
              <div className={styles.heroStats}>
                <span><strong>{currentArticles.length}</strong> éditions 2026</span>
                <span><strong>24</strong> surprises par calendrier</span>
                <span><CalendarDays size={16} aria-hidden /> Mis à jour le {updatedAt}</span>
              </div>
            </div>

            <div className={styles.brickArt} aria-hidden="true">
              <span className={styles.redBrick}>LEGO</span>
              <span className={styles.yellowBrick}>24</span>
              <span className={styles.blueBrick}>2026</span>
            </div>
          </div>
        </section>

        <section className="container">
          <AdBlock />
        </section>

        <nav className={`container ${styles.quickNav}`} aria-label="Accès rapide">
          <a href="#comparatif">Comparer les modèles</a>
          <a href="#selection">Voir les calendriers</a>
          <a href="#choisir">Bien choisir</a>
          <a href="#questions">Questions fréquentes</a>
        </nav>

        <section id="comparatif" className={`container ${styles.section}`}>
          <div className={styles.sectionHeading}>
            <p>Comparatif rapide</p>
            <h2>Quel calendrier LEGO choisir en 2026 ?</h2>
            <span>
              Les prix ci-dessous sont indicatifs. Consultez chaque fiche pour vérifier
              le tarif et la disponibilité au moment de votre visite.
            </span>
          </div>

          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>Univers</th>
                  <th>Âge</th>
                  <th>Contenu</th>
                  <th>Prix indiqué</th>
                  <th>Voir</th>
                </tr>
              </thead>
              <tbody>
                {CURRENT_MODELS.map((model) => {
                  const article = articlesBySlug.get(model.slug);
                  if (!article || isEffectivelyExpired(article.meta)) return null;

                  return (
                    <tr key={model.slug}>
                      <td>
                        <strong>{model.universe}</strong>
                        <small>Réf. {model.reference} · {model.pieces}</small>
                      </td>
                      <td>{model.age}</td>
                      <td>{model.content}</td>
                      <td><strong>{article.meta.price || "Voir l'offre"}</strong></td>
                      <td>
                        <Link href={`/article/${model.slug}`}>
                          Détails <ChevronRight size={14} aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section id="selection" className={`container ${styles.section}`}>
          <div className={styles.sectionHeading}>
            <p>Les éditions actuelles</p>
            <h2>Tous les calendriers de l&apos;Avent LEGO 2026</h2>
            <span>
              Ouvrez une fiche pour découvrir le contenu détaillé, les personnages et
              l&apos;offre disponible.
            </span>
          </div>

          <div className="articles-grid">
            {currentArticles.map((article, index) => (
              <ArticleCard key={article.meta.slug} article={article} priority={index < 3} />
            ))}
          </div>
        </section>

        <section id="choisir" className={styles.guideSection}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <p>Guide pratique</p>
              <h2>Le bon univers selon les goûts de l&apos;enfant</h2>
            </div>

            <div className={styles.guideGrid}>
              {CURRENT_MODELS.map((model) => (
                <Link
                  key={model.slug}
                  href={`/article/${model.slug}`}
                  className={styles.guideCard}
                >
                  <span className={styles.guideIcon}>
                    {model.universe === "LEGO Friends" || model.universe === "Disney Princess" ? (
                      <Users size={20} aria-hidden />
                    ) : model.universe === "LEGO City" ? (
                      <Blocks size={20} aria-hidden />
                    ) : (
                      <Sparkles size={20} aria-hidden />
                    )}
                  </span>
                  <span>
                    <strong>{model.universe}</strong>
                    <small>{model.recommendation}</small>
                  </span>
                  <ChevronRight size={18} aria-hidden />
                </Link>
              ))}
            </div>

            <div className={styles.buyingAdvice}>
              <Gift size={28} aria-hidden />
              <div>
                <h3>Notre conseil avant d&apos;acheter</h3>
                <p>
                  Ne choisissez pas uniquement le calendrier qui contient le plus de
                  pièces. L&apos;univers préféré, l&apos;âge recommandé et les figurines incluses
                  comptent davantage pour que les 24 surprises plaisent vraiment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {olderEditions.length > 0 ? (
          <section className={`container ${styles.section}`}>
            <div className={styles.sectionHeading}>
              <p>À connaître</p>
              <h2>Anciennes éditions LEGO encore proposées</h2>
              <span>
                Ces coffrets ne font pas partie de la collection principale 2026. Ils
                peuvent être vendus par des vendeurs tiers, parfois avec des frais de
                livraison : vérifiez bien le prix final.
              </span>
            </div>
            <div className={styles.legacyGrid}>
              {olderEditions.map((article) => (
                <ArticleCard key={article.meta.slug} article={article} />
              ))}
            </div>
          </section>
        ) : null}

        <section className={`container ${styles.newsletter}`}>
          <NewsletterInline formLocation="calendriers_avent_lego_2026" />
        </section>

        <section id="questions" className={`container ${styles.section} ${styles.faqSection}`}>
          <div className={styles.sectionHeading}>
            <p>FAQ</p>
            <h2>Questions sur les calendriers LEGO</h2>
          </div>
          <div className={styles.faqList}>
            {faq.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className="container">
            <h2>Continuer la sélection de Noël</h2>
            <div className={styles.relatedLinks}>
              <Link href="/calendriers-de-l-avent-2026">
                Tous les calendriers de l&apos;Avent 2026 <ChevronRight size={17} aria-hidden />
              </Link>
              <Link href="/categorie/calendrier-avent">
                Les dernières offres calendriers <ChevronRight size={17} aria-hidden />
              </Link>
              <Link href="/bons-plans-jouets">
                Les bons plans jouets <ChevronRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <StickyAdMobile />
    </>
  );
}
