"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle, Archive, ArrowUp, Check, ChevronDown, ExternalLink,
  ImageOff, Link2Off, RefreshCw, Search, ShoppingBag, Tag,
} from "lucide-react";
import styles from "./cockpit.module.css";

export type CockpitDeal = {
  slug: string;
  title: string;
  merchant: string;
  category: string;
  price: string;
  updated: string;
  image: string;
  status: "ok" | "price-drop" | "warning";
  amazon: boolean;
};

const statusLabel = {
  ok: "À jour",
  "price-drop": "Prix en baisse",
  warning: "À vérifier",
};

export default function DealsCockpit({ initialDeals }: { initialDeals: CockpitDeal[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [merchant, setMerchant] = useState("all");
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<string | null>(initialDeals[0]?.slug || null);

  const merchants = useMemo(
    () => [...new Set(initialDeals.map((deal) => deal.merchant))].sort((a, b) => a.localeCompare(b, "fr")),
    [initialDeals],
  );
  const filtered = useMemo(() => initialDeals.filter((deal) => {
    const haystack = `${deal.title} ${deal.merchant}`.toLowerCase();
    return haystack.includes(query.toLowerCase())
      && (status === "all" || deal.status === status)
      && (merchant === "all" || deal.merchant === merchant);
  }), [initialDeals, merchant, query, status]);
  const active = initialDeals.find((deal) => deal.slug === selected) || filtered[0];

  function demo(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <a className={styles.logo} href="/">Bons Plans <span>Mania</span></a>
        <p className={styles.sideLabel}>Administration</p>
        <nav>
          <button className={styles.navActive}><ShoppingBag size={18} /> Bons plans <b>{initialDeals.length}</b></button>
          <button><Tag size={18} /> Codes promo <b>12</b></button>
          <button><ArrowUp size={18} /> Page d’accueil</button>
          <button><Link2Off size={18} /> Liens morts <b className={styles.dangerCount}>4</b></button>
          <button><ImageOff size={18} /> Images manquantes <b>7</b></button>
          <button><Archive size={18} /> Archives</button>
        </nav>
        <div className={styles.apiCard}><span className={styles.liveDot} /> API Amazon active<strong>Prix vérifiés automatiquement</strong></div>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.header}>
          <div><p>Cockpit éditorial</p><h1>Bonjour Nathalie 👋</h1></div>
          <button className={styles.checkButton} onClick={() => demo("Vérification simulée : les prix et liens seraient contrôlés ici.")}><RefreshCw size={17} /> Vérifier les nouveautés</button>
        </header>

        <section className={styles.stats}>
          <article><span className={styles.statIconGreen}><Check size={20} /></span><div><strong>{initialDeals.filter((d) => d.status === "ok").length}</strong><small>offres à jour</small></div></article>
          <article><span className={styles.statIconPink}>€</span><div><strong>{initialDeals.filter((d) => d.status === "price-drop").length}</strong><small>prix ont baissé</small></div></article>
          <article><span className={styles.statIconOrange}><AlertTriangle size={20} /></span><div><strong>{initialDeals.filter((d) => d.status === "warning").length}</strong><small>à vérifier</small></div></article>
          <article><span className={styles.statIconBlue}><ArrowUp size={20} /></span><div><strong>8</strong><small>places sur l’accueil</small></div></article>
        </section>

        <section className={styles.alertBox}>
          <div><span>PRIORITÉ DU JOUR</span><h2>3 baisses de prix détectées</h2><p>Vérifie les nouveaux prix puis choisis si l’article doit simplement être corrigé ou également remonté.</p></div>
          <button onClick={() => setStatus("price-drop")}>Voir les baisses <ArrowUp size={16} /></button>
        </section>

        <div className={styles.toolbar}>
          <label><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit ou une marque…" /></label>
          <div className={styles.selectWrap}><select value={merchant} onChange={(event) => setMerchant(event.target.value)}><option value="all">Tous les marchands</option>{merchants.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></div>
          <div className={styles.selectWrap}><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tous les statuts</option><option value="price-drop">Prix en baisse</option><option value="warning">À vérifier</option><option value="ok">À jour</option></select><ChevronDown size={15} /></div>
        </div>

        <div className={styles.contentGrid}>
          <section className={styles.dealList}>
            <div className={styles.listHead}><span>OFFRE</span><span>PRIX</span><span>ÉTAT</span></div>
            {filtered.map((deal) => (
              <button key={deal.slug} className={`${styles.dealRow} ${active?.slug === deal.slug ? styles.selected : ""}`} onClick={() => setSelected(deal.slug)}>
                <div className={styles.thumb}>{deal.image && !deal.image.includes("placeholder") ? <Image src={deal.image} alt="" width={44} height={44} /> : <ShoppingBag size={21} />}</div>
                <div className={styles.dealName}><strong>{deal.title}</strong><span>{deal.merchant} · modifié le {new Date(`${deal.updated}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div>
                <span className={styles.price}>{deal.price}</span>
                <span className={`${styles.status} ${styles[deal.status]}`}>{statusLabel[deal.status]}</span>
              </button>
            ))}
            {filtered.length === 0 ? <p className={styles.empty}>Aucune offre ne correspond à ces filtres.</p> : null}
          </section>

          <aside className={styles.editor}>
            {active ? <>
              <span className={styles.editorEyebrow}>FICHE SÉLECTIONNÉE</span>
              <h2>{active.title}</h2>
              <a href={`/article/${active.slug}`} target="_blank">Voir l’article <ExternalLink size={14} /></a>
              <div className={styles.field}><label>Marchand</label><input value={active.merchant} readOnly /></div>
              <div className={styles.field}><label>Prix détecté</label><input value={active.price} readOnly /></div>
              <div className={styles.audit}><Check size={17} /><div><b>{active.amazon ? "Image et prix Amazon connectés" : "Lien affilié reconnu"}</b><small>Dernière vérification aujourd’hui</small></div></div>
              <div className={styles.actionInfo}><b>Que veux-tu faire ?</b><p>Ces deux boutons sont séparés pour ne plus remonter un article par erreur.</p></div>
              <button className={styles.updateOnly} onClick={() => demo("Maquette : prix mis à jour sans modifier sa place.")}><RefreshCw size={17} /> Mettre à jour seulement</button>
              <button className={styles.updateAndRaise} onClick={() => demo("Maquette : prix mis à jour et article remonté.")}><ArrowUp size={17} /> Mettre à jour et remonter</button>
              <button className={styles.archiveButton} onClick={() => demo("Maquette : l’offre serait archivée après confirmation.")}><Archive size={16} /> Archiver l’offre</button>
            </> : null}
          </aside>
        </div>
      </section>
      {notice ? <div className={styles.toast}>{notice}</div> : null}
    </main>
  );
}
