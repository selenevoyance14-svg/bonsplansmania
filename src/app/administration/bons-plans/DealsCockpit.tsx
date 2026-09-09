"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Archive, ArrowUp, CalendarClock, Check, ChevronDown, ExternalLink, ImageOff, Link2Off, LoaderCircle, LockKeyhole, RefreshCw, Search, ShoppingBag, Tag } from "lucide-react";
import styles from "./cockpit.module.css";

export type DealStatus = "ok" | "scheduled" | "due" | "unchecked" | "unavailable" | "missing-image" | "missing-price" | "price-check" | "missing-link" | "expiring";
export type CockpitDeal = { slug: string; title: string; merchant: string; category: string; price: string; updated: string; image: string; status: DealStatus; amazonAsin?: string; affiliateUrl?: string; endDate?: string };
export type CockpitSummary = { totalActive: number; totalCodes: number; totalArchived: number; displayed: number };
type AmazonOffer = { title?: string | null; image?: string | null; price?: string | null; oldPrice?: string | null; savingsPercent?: number | null; availability?: string | null; inStock?: boolean; checkedAt?: string; error?: string };
type LinkMonitor = { slug?: string; ok?: boolean; status?: number; checkedAt?: string | null; error?: string };

const REMINDERS_KEY = "bonsplansmania:deal-reminders";
const statusLabel: Record<DealStatus, string> = { ok: "À jour", scheduled: "Contrôle programmé", due: "À contrôler aujourd’hui", unchecked: "Non contrôlé", unavailable: "Indisponible", "missing-image": "Image manquante", "missing-price": "Prix manquant", "price-check": "Prix à contrôler", "missing-link": "Lien inaccessible", expiring: "Expire bientôt" };

function currentStatus(deal: CockpitDeal, amazonOffer?: AmazonOffer, linkResult?: LinkMonitor, reminder?: string): DealStatus {
  if (reminder) return reminder <= new Date().toLocaleDateString("sv-SE") ? "due" : "scheduled";
  if (["missing-image", "missing-price", "missing-link"].includes(deal.status)) return deal.status;
  if (deal.amazonAsin) {
    if (!amazonOffer) return "price-check";
    if (amazonOffer.inStock === false || /indisponible/i.test(amazonOffer.availability || "")) return "unavailable";
    if (!amazonOffer.price) return "missing-price";
  } else {
    if (!linkResult) return "unchecked";
    if (!linkResult.checkedAt) return "unchecked";
    if (!linkResult.ok) return "missing-link";
  }
  if (!deal.endDate) return deal.status === "expiring" ? "ok" : deal.status;
  const remainingDays = (new Date(`${deal.endDate}T23:59:59`).getTime() - Date.now()) / 86_400_000;
  return remainingDays >= 0 && remainingDays <= 7 ? "expiring" : "ok";
}

export default function DealsCockpit({ initialDeals, summary }: { initialDeals: CockpitDeal[]; summary: CockpitSummary }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "issues" | DealStatus>("all");
  const [merchant, setMerchant] = useState("all");
  const [selected, setSelected] = useState<string | null>(initialDeals[0]?.slug || null);
  const [amazonState, setAmazonState] = useState<{ asin?: string; offer?: AmazonOffer }>({});
  const [linkResults, setLinkResults] = useState<Record<string, LinkMonitor>>({});
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const merchants = useMemo(() => [...new Set(initialDeals.map((deal) => deal.merchant))].sort((a, b) => a.localeCompare(b, "fr")), [initialDeals]);
  const statusFor = (deal: CockpitDeal) => currentStatus(deal, amazonState.asin === deal.amazonAsin ? amazonState.offer : undefined, linkResults[deal.slug], reminders[deal.slug]);
  const filtered = initialDeals.filter((deal) => `${deal.title} ${deal.merchant}`.toLowerCase().includes(query.toLowerCase()) && (status === "all" || (status === "issues" ? !["ok", "scheduled"].includes(statusFor(deal)) : statusFor(deal) === status)) && (merchant === "all" || deal.merchant === merchant));
  const active = initialDeals.find((deal) => deal.slug === selected) || filtered[0];
  const liveStatuses = initialDeals.map(statusFor);
  const issueCount = liveStatuses.filter((dealStatus) => !["ok", "scheduled"].includes(dealStatus)).length;
  const amazonOffer = active?.amazonAsin && amazonState.asin === active.amazonAsin ? amazonState.offer || null : null;
  const amazonLoading = Boolean(active?.amazonAsin && amazonState.asin !== active.amazonAsin);
  const linkResult = active ? linkResults[active.slug] : undefined;

  useEffect(() => {
    const saved = localStorage.getItem(REMINDERS_KEY);
    if (!saved) return;
    queueMicrotask(() => {
      try { setReminders(JSON.parse(saved) as Record<string, string>); } catch { localStorage.removeItem(REMINDERS_KEY); }
    });
  }, []);

  function saveReminder(slug: string, date?: string) {
    const next = { ...reminders };
    if (date) next[slug] = date; else delete next[slug];
    setReminders(next);
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(next));
  }

  function scheduleIn(slug: string, days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    saveReminder(slug, date.toLocaleDateString("sv-SE"));
  }

  useEffect(() => {
    if (!active?.amazonAsin) return;
    const controller = new AbortController();
    fetch(`/api/amazon/${active.amazonAsin}`, { signal: controller.signal })
      .then(async (response) => ({ ok: response.ok, body: await response.json() as AmazonOffer }))
      .then(({ ok, body }) => setAmazonState({ asin: active.amazonAsin, offer: ok ? body : { error: body.error || "Prix indisponible" } }))
      .catch((error: Error) => { if (error.name !== "AbortError") setAmazonState({ asin: active.amazonAsin, offer: { error: "Vérification momentanément indisponible" } }); });
    return () => controller.abort();
  }, [active?.amazonAsin]);

  useEffect(() => {
    const slugs = initialDeals.filter((deal) => !deal.amazonAsin).map((deal) => deal.slug);
    if (!slugs.length) return;
    const controller = new AbortController();
    Promise.all(Array.from({ length: Math.ceil(slugs.length / 100) }, (_, index) => slugs.slice(index * 100, index * 100 + 100)).map(async (batch) => {
      const response = await fetch(`https://bonsplansmania-alerts.selenevoyance14.workers.dev/monitoring/statuses?slugs=${encodeURIComponent(batch.join(","))}`, { signal: controller.signal });
      return response.json() as Promise<{ results?: Record<string, LinkMonitor> }>;
    })).then((pages) => setLinkResults(Object.assign({}, ...pages.map((page) => page.results || {}))))
      .catch((error: Error) => { if (error.name !== "AbortError") setLinkResults({}); });
    return () => controller.abort();
  }, [initialDeals]);

  const liveImage = amazonOffer?.image || active?.image;
  const livePrice = amazonOffer?.price || active?.price || "Non renseigné";

  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <a className={styles.logo} href="/">Bons Plans <span>Mania</span></a><p className={styles.sideLabel}>Administration</p>
      <nav>
        <button className={styles.navActive}><ShoppingBag size={18}/> Bons plans <b>{summary.totalActive}</b></button>
        <button><Tag size={18}/> Codes promo <b>{summary.totalCodes}</b></button><button><ArrowUp size={18}/> Page d’accueil <b>15</b></button>
        <button onClick={() => setStatus("missing-link")}><Link2Off size={18}/> Liens manquants <b className={styles.dangerCount}>{liveStatuses.filter((dealStatus) => dealStatus === "missing-link").length}</b></button>
        <button onClick={() => setStatus("missing-image")}><ImageOff size={18}/> Images manquantes <b>{liveStatuses.filter((dealStatus) => dealStatus === "missing-image").length}</b></button>
        <button><Archive size={18}/> Archives <b>{summary.totalArchived}</b></button>
      </nav>
      <div className={styles.apiCard}><span className={styles.liveDot}/> API Amazon active<strong>Vérification à l’ouverture d’une fiche</strong></div>
    </aside>
    <section className={styles.workspace}>
      <header className={styles.header}><div><p>Cockpit éditorial réel</p><h1>Bonjour Nathalie 👋</h1></div><button className={styles.checkButton} onClick={() => setStatus(issueCount ? "issues" : "all")}><RefreshCw size={17}/> Afficher les contrôles</button></header>
      <section className={styles.stats}>
        <article><span className={styles.statIconGreen}><Check size={20}/></span><div><strong>{liveStatuses.filter((dealStatus) => dealStatus === "ok").length}</strong><small>fiches sans anomalie</small></div></article>
        <article><span className={styles.statIconPink}>€</span><div><strong>{liveStatuses.filter((dealStatus) => dealStatus === "missing-price" || dealStatus === "price-check").length}</strong><small>prix à contrôler</small></div></article>
        <article><span className={styles.statIconOrange}><AlertTriangle size={20}/></span><div><strong>{issueCount}</strong><small>points à vérifier</small></div></article>
        <article><span className={styles.statIconBlue}><ShoppingBag size={20}/></span><div><strong>{summary.totalActive}</strong><small>offres actives au total</small></div></article>
      </section>
      <section className={styles.alertBox}><div><span>CONTRÔLE RÉEL</span><h2>{issueCount ? `${issueCount} fiches demandent ton attention` : "Aucune anomalie dans les fiches affichées"}</h2><p>Le cockpit analyse liens, images, prix renseignés et dates de fin. Amazon est interrogé en direct fiche par fiche.</p></div><button onClick={() => setStatus(issueCount ? "issues" : "all")}>Voir les contrôles <ArrowUp size={16}/></button></section>
      <div className={styles.toolbar}>
        <label><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un produit ou une marque…"/></label>
        <div className={styles.selectWrap}><select value={merchant} onChange={(event) => setMerchant(event.target.value)}><option value="all">Tous les marchands</option>{merchants.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15}/></div>
        <div className={styles.selectWrap}><select value={status} onChange={(event) => setStatus(event.target.value as "all" | "issues" | DealStatus)}><option value="all">Tous les statuts</option><option value="issues">Toutes les anomalies</option><option value="due">À contrôler aujourd’hui</option><option value="scheduled">Contrôles programmés</option><option value="missing-link">Lien inaccessible</option><option value="missing-image">Image manquante</option><option value="missing-price">Prix manquant</option><option value="price-check">Prix Amazon à contrôler</option><option value="unavailable">Produit indisponible</option><option value="unchecked">Non contrôlé</option><option value="expiring">Expire bientôt</option><option value="ok">À jour</option></select><ChevronDown size={15}/></div>
      </div>
      <p className={styles.scopeNote}>{summary.displayed} offres récentes affichées sur {summary.totalActive} offres actives.</p>
      <div className={styles.contentGrid}>
        <section className={styles.dealList}><div className={styles.listHead}><span>OFFRE</span><span>PRIX</span><span>ÉTAT</span></div>
          {filtered.map((deal) => <button key={deal.slug} className={`${styles.dealRow} ${active?.slug === deal.slug ? styles.selected : ""}`} onClick={() => setSelected(deal.slug)}>
            <div className={styles.thumb}>{deal.image && !deal.image.includes("placeholder") ? <Image src={deal.image} alt="" width={44} height={44}/> : <ShoppingBag size={21}/>}</div>
            <div className={styles.dealName}><a href={`/article/${deal.slug}`} target="_blank" onClick={(event) => event.stopPropagation()}>{deal.title} <ExternalLink size={12}/></a><span>{deal.merchant} · modifié le {new Date(`${deal.updated}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div><span className={styles.price}>{deal.price}</span><span className={`${styles.status} ${styles[statusFor(deal)]}`}>{statusLabel[statusFor(deal)]}</span>
          </button>)}{filtered.length === 0 ? <p className={styles.empty}>Aucune offre ne correspond à ces filtres.</p> : null}
        </section>
        <aside className={styles.editor}>{active ? <><span className={styles.editorEyebrow}>FICHE SÉLECTIONNÉE</span>
          {liveImage && !liveImage.includes("placeholder") ? <div className={styles.previewImage}><Image src={liveImage} alt="" width={250} height={150}/></div> : null}
          <h2>{amazonOffer?.title || active.title}</h2><a href={`/article/${active.slug}`} target="_blank">Voir l’article <ExternalLink size={14}/></a>
          <div className={styles.field}><label>Marchand</label><input value={active.merchant} readOnly/></div><div className={styles.field}><label>{active.amazonAsin ? "Prix Amazon actuel" : "Prix enregistré"}</label><input value={amazonLoading ? "Vérification en cours…" : livePrice} readOnly/></div>
          {active.endDate ? <div className={styles.field}><label>Date de fin</label><input value={new Date(`${active.endDate}T12:00:00`).toLocaleDateString("fr-FR")} readOnly/></div> : null}
          <div className={`${styles.audit} ${amazonOffer?.error ? styles.auditWarning : ""}`}>{amazonLoading ? <LoaderCircle className={styles.spin} size={17}/> : amazonOffer?.error ? <AlertTriangle size={17}/> : <Check size={17}/>}<div><b>{amazonLoading ? "Interrogation de l’API Amazon" : amazonOffer?.error || (active.amazonAsin ? amazonOffer?.availability || "Offre Amazon vérifiée" : "Données éditoriales analysées")}</b><small>{amazonOffer?.checkedAt ? `Vérifié le ${new Date(amazonOffer.checkedAt).toLocaleString("fr-FR")}` : "Aucune estimation inventée"}</small></div></div>
          {!active.amazonAsin && linkResult?.checkedAt ? <div className={`${styles.audit} ${linkResult.ok ? "" : styles.auditWarning}`}>{linkResult.ok ? <Check size={17}/> : <AlertTriangle size={17}/>}<div><b>{linkResult.ok ? `Lien marchand accessible (${linkResult.status})` : `Lien à vérifier (${linkResult.status || "réseau"})`}</b><small>Contrôlé automatiquement le {new Date(linkResult.checkedAt).toLocaleString("fr-FR")}</small></div></div> : null}
          {amazonOffer?.oldPrice ? <p className={styles.amazonSaving}>Prix précédent affiché : <b>{amazonOffer.oldPrice}</b>{amazonOffer.savingsPercent ? ` · -${amazonOffer.savingsPercent}%` : ""}</p> : null}
          <div className={styles.reminderBox}><b><CalendarClock size={16}/> Programmer le prochain contrôle</b><div className={styles.reminderPresets}><button onClick={() => scheduleIn(active.slug, 1)}>Demain</button><button onClick={() => scheduleIn(active.slug, 3)}>Dans 3 jours</button><button onClick={() => scheduleIn(active.slug, 7)}>Dans 7 jours</button></div><label>Date précise<input type="date" min={new Date().toLocaleDateString("sv-SE")} value={reminders[active.slug] || ""} onChange={(event) => saveReminder(active.slug, event.target.value || undefined)}/></label>{reminders[active.slug] ? <p>Prochain contrôle le <strong>{new Date(`${reminders[active.slug]}T12:00:00`).toLocaleDateString("fr-FR")}</strong> <button onClick={() => saveReminder(active.slug)}>Annuler</button></p> : null}</div>
          <div className={styles.actionInfo}><b>Actions protégées</b><p>La lecture est réelle. Les modifications seront activées après ajout d’un accès administrateur privé.</p></div>
          <button className={styles.locked} disabled><LockKeyhole size={16}/> Mettre à jour seulement</button><button className={styles.locked} disabled><LockKeyhole size={16}/> Mettre à jour et remonter</button><button className={styles.locked} disabled><LockKeyhole size={16}/> Archiver l’offre</button>
        </> : null}</aside>
      </div>
    </section>
  </main>;
}
