"use client";

import Image from "next/image";
import { Bell, Check, Mail, Search, ShieldCheck, Sparkles } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import styles from "./alert-preview.module.css";

type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
};

const suggestions = ["Couches bébé", "Ninja Creami", "Clarins", "Tests gratuits"];

export default function AlertPreview({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("Ninja Creami");
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("instant");
  const [created, setCreated] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return [];
    return articles.filter((article) => {
      const text = `${article.title} ${article.description} ${article.tags.join(" ")} ${article.category}`.toLowerCase();
      return text.includes(normalizedQuery);
    }).slice(0, 3);
  }, [articles, normalizedQuery]);

  function submitAlert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim() || !email.trim()) return;
    setCreated(true);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}><Sparkles size={15} /> Nouvelle fonctionnalité</p>
          <h1>Ne ratez plus le bon plan que vous attendez</h1>
          <p>Créez une alerte gratuite et recevez un e-mail uniquement lorsqu’une nouvelle offre correspond à votre recherche.</p>
          <div className={styles.searchBox}>
            <Search size={20} aria-hidden />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setCreated(false); }} aria-label="Produit ou marque à surveiller" placeholder="Ex. couches Pampers, air fryer, Clarins…" />
            <button type="button">Rechercher</button>
          </div>
          <div className={styles.suggestions} aria-label="Recherches suggérées">
            <span>Suggestions :</span>
            {suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => { setQuery(suggestion); setCreated(false); }}>{suggestion}</button>)}
          </div>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.results}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>Résultats actuels</p>
              <h2>{results.length ? `${results.length} offre${results.length > 1 ? "s" : ""} trouvée${results.length > 1 ? "s" : ""}` : "Aucune offre en cours"}</h2>
            </div>
            <span>pour « {query || "votre recherche"} »</span>
          </div>

          {results.length ? (
            <div className={styles.cards}>
              {results.map((article) => (
                <article className={styles.card} key={article.slug}>
                  <div className={styles.cardImage}><Image src={article.image} alt="" fill sizes="160px" /></div>
                  <div><span>{article.category.replaceAll("-", " ")}</span><h3>{article.title}</h3><p>{article.description}</p></div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search size={28} />
              <div><strong>Rien pour le moment, mais cela peut changer vite.</strong><p>Activez l’alerte : Bons Plans Mania surveillera les prochaines publications pour vous.</p></div>
            </div>
          )}
        </section>

        <aside className={styles.alertCard}>
          {created ? (
            <div className={styles.success}>
              <span><Check size={28} /></span>
              <p className={styles.kicker}>Alerte créée</p>
              <h2>On surveille « {query} » pour vous !</h2>
              <p>Un e-mail de confirmation serait envoyé à <strong>{email}</strong>. Vous pourriez ensuite modifier ou supprimer l’alerte à tout moment.</p>
              <button type="button" onClick={() => setCreated(false)}>Modifier l’alerte</button>
            </div>
          ) : (
            <>
              <div className={styles.bell}><Bell size={24} /></div>
              <p className={styles.kicker}>Alerte personnalisée</p>
              <h2>Prévenez-moi pour « {query || "ce produit"} »</h2>
              <p className={styles.intro}>Gratuit, sans compte et sans publicité inutile.</p>
              <form onSubmit={submitAlert}>
                <label htmlFor="alert-email">Votre adresse e-mail</label>
                <div className={styles.emailField}><Mail size={18} /><input id="alert-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.fr" /></div>
                <fieldset>
                  <legend>À quelle fréquence ?</legend>
                  <label className={frequency === "instant" ? styles.selected : ""}><input type="radio" name="frequency" value="instant" checked={frequency === "instant"} onChange={(event) => setFrequency(event.target.value)} /><span><strong>Dès qu’un bon plan paraît</strong><small>Idéal pour les offres limitées</small></span></label>
                  <label className={frequency === "daily" ? styles.selected : ""}><input type="radio" name="frequency" value="daily" checked={frequency === "daily"} onChange={(event) => setFrequency(event.target.value)} /><span><strong>Un résumé par jour</strong><small>Un seul e-mail maximum</small></span></label>
                </fieldset>
                <button className={styles.submit} type="submit"><Bell size={18} /> Créer mon alerte gratuite</button>
              </form>
              <p className={styles.privacy}><ShieldCheck size={16} /> Confirmation par e-mail. Désinscription en un clic.</p>
            </>
          )}
        </aside>
      </div>

      <section className={styles.explainer}>
        <div><span>1</span><strong>Vous choisissez</strong><p>Un produit, une marque ou une catégorie.</p></div>
        <div><span>2</span><strong>Nous surveillons</strong><p>Les nouveaux bons plans publiés sur le site.</p></div>
        <div><span>3</span><strong>Vous économisez</strong><p>Un e-mail vous prévient dès qu’une offre correspond.</p></div>
      </section>
    </main>
  );
}
