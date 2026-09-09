"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Archive, ArrowUp, Check, ChevronDown, ExternalLink, ImageOff, Link2Off, LoaderCircle, LockKeyhole, RefreshCw, Search, ShoppingBag, Tag } from "lucide-react";
import styles from "./cockpit.module.css";

export type DealStatus = "ok" | "missing-image" | "missing-price" | "missing-link" | "expiring";
export type CockpitDeal = { slug: string; title: string; merchant: string; category: string; price: string; updated: string; image: string; status: DealStatus; amazonAsin?: string; affiliateUrl?: string; endDate?: string };
export type CockpitSummary = { totalActive: number; totalCodes: number; totalArchived: number; displayed: number };
type AmazonOffer = { title?: string | null; image?: string | null; price?: string | null; oldPrice?: string | null; savingsPercent?: number | null; availability?: string | null; checkedAt?: string; error?: string };

const statusLabel: Record<DealStatus, string> = { ok: "À jour", "missing-image": "Image manquante", "missing-price": "Prix manquant", "missing-link": "Lien manquant", expiring: "Expire bientôt" };

export default function DealsCockpit({ initialDeals, summary }: { initialDeals: CockpitDeal[]; summary: CockpitSummary }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | DealStatus>("all");
  const [merchant, setMerchant] = useState("all");
  const [selected, setSelected] = useState<string | null>(initialDeals[0]?.slug || null);
  const [amazonState, setAmazonState] = useState<{ asin?: string; offer?: AmazonOffer }>({});
  const merchants = useMemo(() => [...new Set(initialDeals.map((deal) => deal.merchant))].sort((a, b) => a.localeCompare(b, "fr")), [initialDeals]);
  const filtered = useMemo(() => initialDeals.filter((deal) => `${deal.title} ${deal.merchant}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || deal.status === status) && (merchant === "all" || deal.merchant === merchant)), [initialDeals, merchant, query, status]);
  const active = initialDeals.find((deal) => deal.slug === selected) || filtered[0];
  const issueCount = initialDeals.filter((deal) => deal.status !== "ok").length;
  const amazonOffer = active?.amazonAsin && amazonState.asin === active.amazonAsin ? amazonState.offer || null : null;
  const amazonLoading = Boolean(active?.amazonAsin && amazonState.asin !== active.amazonAsin);

  useEffect(() => {
    if (!active?.amazonAsin) return;
    const controller = new AbortController();
    fetch(`/api/amazon/${active.amazonAsin}`, { signal: controller.signal })
      .then(async (response) => ({ ok: response.ok, body: await response.json() as AmazonOffer }))
      .then(({ ok, body }) => setAmazonState({ asin: active.amazonAsin, offer: ok ? body : { error: body.error || "Prix indisponible" } }))
      .catch((error: Error) => { if (error.name !== "AbortError") setAmazonState({ asin: active.amazonAsin, offer: { error: "Vérification momentanément indisponible" } }); });
    return () => controller.abort();
  }, [active?.amazonAsin]);

  const liveImage = amazonOffer?.image || active?.image;
  const livePrice = amazonOffer?.price || active?.price || "Non renseigné";

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <a className={styles.logo} href="/">Bons Plans <span>Mania</span></a><p className={styles.sideLabel}>Administration</p>
      <nav>
        <button className={styles.navActive}><ShoppingBag size={18}/> Bons plans <b>{summary.totalActive}</b></button>
        <button><Tag size={18}/> Codes promo <b>{summary.totalCodes}</b></button><button><ArrowUp size={18}/> Page d’accueil <b>15</b></button>
        <button onClick={() => setStatus("missing-link")}><Link2Off size={18}/> Liens manquants <b className={styles.dangerCount}>{initialDeals.filter((d) => d.status === "missing-link").length}</b></button>
        <button onClick={() => setStatus("missing-image")}><ImageOff size={18}/> Images manquantes <b>{initialDeals.filter((d) => d.status === "missing-image").length}</b></button>
        <button><Archive size={18}/> Archives <b>{summary.totalArchived}</b></button>
      </nav>
      <div className={styles.apiCard}><span className={styles.liveDot}/> API Amazon active<strong>Vérification à l’ouverture d’une fiche</strong></div>
    </aside>
    <section className={styles.workspace}>
      <header className={styles.header}><div><p>Cockpit éditorial réel</p><h1>Bonjour Nathalie 👋</h1></div><button className={styles.checkButton} onClick={() => setStatus(issueCount ? "missing-link" : "all")}><RefreshCw size={17}/> Afficher les contrôles</button></header>
      <section className={styles.stats}>
        <article><span className={styles.statIconGreen}><Check size={20}/></span><div><strong>{initialDeals.filter((d) => d.status === "ok").length}</strong><small>fiches sans anomalie</small></div></article>
        <article><span className={styles.statIconPink}>€</span><div><strong>{initialDeals.filter((d) => d.status === "missing-price").length}</strong><small>prix manquants</small></div></article>
        <article><span className={styles.statIconOrange}><AlertTriangle size={20}/></span><div><strong>{issueCount}</strong><small>points à vérifier</small></div></article>
        <article><span className={styles.statIconBlue}><ShoppingBag size={20}/></span><div><strong>{summary.totalActive}</strong><small>offres actives au total</small></div></article>
      </section>
      <section className={styles.alertBox}><div><span>CONTRÔLE RÉEL</span><h2>{issueCount ? `${issueCount} fiches demandent ton attention` : "Aucune anomalie dans les fiches affichées"}</h2><p>Le cockpit analyse liens, images, prix renseignés et dates de fin. Amazon est interrogé en direct fiche par fiche.</p></div><button onClick={() => setStatus(issueCount ? "missing-link" : "all")}>Voir les contrôles <ArrowUp size={16}/></button></section>
      <div className={styles.toolbar}>
        <label><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit ou une marque…"/></label>
        <div className={styles.selectWrap}><select value={merchant} onChange={(event) => setMerchant(event.target.value)}><option value="all">Tous les marchands</option>{merchants.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15}/></div>
        <div className={styles.selectWrap}><select value={status} onChange={(event) => setStatus(event.target.value as "all" | DealStatus)}><option value="all">Tous les statuts</option><option value="missing-link">Lien manquant</option><option value="missing-image">Image manquante</option><option value="missing-price">Prix manquant</option><option value="expiring">Expire bientôt</option><option value="ok">À jour</option></select><ChevronDown size={15}/></div>
      </div>
      <p className={styles.scopeNote}>{summary.displayed} offres récentes affichées sur {summary.totalActive} offres actives.</p>
      <div className={styles.contentGrid}>
        <section className={styles.dealList}><div className={styles.listHead}><span>OFFRE</span><span>PRIX</span><span>ÉTAT</span></div>
          {filtered.map((deal) => <button key={deal.slug} className={`${styles.dealRow} ${active?.slug === deal.slug ? styles.selected : ""}`} onClick={() => setSelected(deal.slug)}>
            <div className={styles.thumb}>{deal.image && !deal.image.includes("placeholder") ? <Image src={deal.image} alt="" width={44} height={44}/> : <ShoppingBag size={21}/>}</div>
            <div className={styles.dealName}><strong>{deal.title}</strong><span>{deal.merchant} · modifié le {new Date(`${deal.updated}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div><span className={styles.price}>{deal.price}</span><span className={`${styles.status} ${styles[deal.status]}`}>{statusLabel[deal.status]}</span>
          </button>)}{filtered.length === 0 ? <p className={styles.empty}>Aucune offre ne correspond à ces filtres.</p> : null}
        </section>
        <aside className={styles.editor}>{active ? <><span className={styles.editorEyebrow}>FICHE SÉLECTIONNÉE</span>
          {liveImage && !liveImage.includes("placeholder") ? <div className={styles.previewImage}><Image src={liveImage} alt="" width={250} height={150}/></div> : null}
          <h2>{amazonOffer?.title || active.title}</h2><a href={`/article/${active.slug}`} target="_blank">Voir l’article <ExternalLink size={14}/></a>
          <div className={styles.field}><label>Marchand</label><input value={active.merchant} readOnly/></div><div className={styles.field}><label>{active.amazonAsin ? "Prix Amazon actuel" : "Prix enregistré"}</label><input value={amazonLoading ? "Vérification en cours…" : livePrice} readOnly/></div>
          {active.endDate ? <div className={styles.field}><label>Date de fin</label><input value={new Date(`${active.endDate}T12:00:00`).toLocaleDateString("fr-FR")} readOnly/></div> : null}
          <div className={`${styles.audit} ${amazonOffer?.error ? styles.auditWarning : ""}`}>{amazonLoading ? <LoaderCircle className={styles.spin} size={17}/> : amazonOffer?.error ? <AlertTriangle size={17}/> : <Check size={17}/>}<div><b>{amazonLoading ? "Interrogation de l’API Amazon" : amazonOffer?.error || (active.amazonAsin ? amazonOffer?.availability || "Offre Amazon vérifiée" : "Données éditoriales analysées")}</b><small>{amazonOffer?.checkedAt ? `Vérifié le ${new Date(amazonOffer.checkedAt).toLocaleString("fr-FR")}` : "Aucune estimation inventée"}</small></div></div>
          {amazonOffer?.oldPrice ? <p className={styles.amazonSaving}>Prix précédent affiché : <b>{amazonOffer.oldPrice}</b>{amazonOffer.savingsPercent ? ` · -${amazonOffer.savingsPercent}%` : ""}</p> : null}
          <div className={styles.actionInfo}><b>Actions protégées</b><p>La lecture est réelle. Les modifications seront activées après ajout d’un accès administrateur privé.</p></div>
          <button className={styles.locked} disabled><LockKeyhole size={16}/> Mettre à jour seulement</button><button className={styles.locked} disabled><LockKeyhole size={16}/> Mettre à jour et remonter</button><button className={styles.locked} disabled><LockKeyhole size={16}/> Archiver l’offre</button>
        </> : null}</aside>
      </div>
    </section>
  </main>;
}
