"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Archive, ArrowDown, ArrowUp, CalendarClock, Check, ChevronDown, ExternalLink, ImageOff, Link2Off, LoaderCircle, RefreshCw, Search, ShoppingBag, Tag } from "lucide-react";
import styles from "./cockpit.module.css";

export type DealStatus = "ok" | "scheduled" | "due" | "unchecked" | "unavailable" | "missing-image" | "missing-price" | "price-check" | "missing-link" | "expiring";
export type CockpitDeal = { slug: string; title: string; merchant: string; category: string; price: string; updated: string; image: string; status: DealStatus; onHomepage?: boolean; amazonAsin?: string; affiliateUrl?: string; endDate?: string };
export type CockpitSummary = { totalActive: number; totalCodes: number; totalArchived: number; displayed: number };
type AmazonOffer = { title?: string | null; image?: string | null; price?: string | null; oldPrice?: string | null; savingsPercent?: number | null; availability?: string | null; inStock?: boolean; checkedAt?: string; error?: string };
type LinkMonitor = { slug?: string; ok?: boolean; status?: number; checkedAt?: string | null; error?: string };
type PriceDrop = { slug: string; asin: string; title?: string; price: number; displayPrice: string; previousPrice?: number; change?: number; changePercent?: number; checkedAt: string };

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
  const [section, setSection] = useState<"deals" | "codes" | "homepage" | "price-drops">("deals");
  const [merchant, setMerchant] = useState("all");
  const [selected, setSelected] = useState<string | null>(initialDeals[0]?.slug || null);
  const [amazonState, setAmazonState] = useState<{ asin?: string; offer?: AmazonOffer }>({});
  const [linkResults, setLinkResults] = useState<Record<string, LinkMonitor>>({});
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [manualPrices, setManualPrices] = useState<Record<string, string>>({});
  const [priceDrops, setPriceDrops] = useState<Record<string, PriceDrop>>({});
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [actionPending, setActionPending] = useState<"update" | "raise" | "archive" | null>(null);
  const [actionError, setActionError] = useState("");
  const merchants = useMemo(() => [...new Set(initialDeals.map((deal) => deal.merchant))].sort((a, b) => a.localeCompare(b, "fr")), [initialDeals]);
  const statusFor = (deal: CockpitDeal) => currentStatus(deal, amazonState.asin === deal.amazonAsin ? amazonState.offer : undefined, linkResults[deal.slug], reminders[deal.slug]);
  const filtered = initialDeals.filter((deal) => `${deal.title} ${deal.merchant}`.toLowerCase().includes(query.toLowerCase()) && (section === "deals" || (section === "codes" ? deal.category === "code-promo" : section === "homepage" ? deal.onHomepage : Boolean(priceDrops[deal.slug]))) && (status === "all" || (status === "issues" ? !["ok", "scheduled"].includes(statusFor(deal)) : statusFor(deal) === status)) && (merchant === "all" || deal.merchant === merchant));
  const active = filtered.find((deal) => deal.slug === selected) || filtered[0];
  const liveStatuses = initialDeals.map(statusFor);
  const issueCount = liveStatuses.filter((dealStatus) => !["ok", "scheduled"].includes(dealStatus)).length;
  const amazonOffer = active?.amazonAsin && amazonState.asin === active.amazonAsin ? amazonState.offer || null : null;
  const amazonLoading = Boolean(active?.amazonAsin && amazonState.asin !== active.amazonAsin);
  const linkResult = active ? linkResults[active.slug] : undefined;
  const activePriceDrop = active ? priceDrops[active.slug] : undefined;
  const detectedPrice = active?.amazonAsin && amazonState.asin === active.amazonAsin
    ? amazonState.offer?.price || active.price
    : active?.price || "";
  const editablePrice = active
    ? manualPrices[active.slug] ?? (detectedPrice === "Non renseigné" || detectedPrice === "Prix Amazon en direct" ? "" : detectedPrice)
    : "";

  useEffect(() => {
    fetch("/api/admin/session", { credentials: "same-origin" })
      .then((response) => response.json() as Promise<{ authenticated?: boolean }>)
      .then((payload) => setAuthenticated(Boolean(payload.authenticated)))
      .catch(() => setAuthenticated(false));
  }, []);

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

  async function copyAction(action: "update" | "raise" | "archive") {
    if (!active) return;
    const articleUrl = `https://bonsplansmania.fr/article/${active.slug}`;
    const priceInstruction = editablePrice.trim() ? ` avec le prix ${editablePrice.trim()}` : "";
    const request = action === "archive"
      ? `${articleUrl} archive cette offre et retire-la des pages de bons plans actifs (elle doit rester dans les archives)`
      : action === "raise"
        ? `${articleUrl} mets cette offre à jour${priceInstruction} et remonte-la`
        : `${articleUrl} mets cette offre à jour${priceInstruction} sans la remonter`;

    try {
      await navigator.clipboard.writeText(request);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = request;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setToast("Demande copiée : colle-la dans Codex pour l’appliquer au site.");
    window.setTimeout(() => setToast(""), 4500);
  }

  async function publishAction(action: "update" | "raise" | "archive") {
    if (!active || actionPending) return;
    if (!authenticated) {
      setActionError("");
      setShowLogin(true);
      return;
    }
    setActionPending(action);
    setActionError("");
    try {
      const response = await fetch("/api/admin/deal-action", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: active.slug, action, price: editablePrice.trim() }),
      });
      const payload = await response.json() as { message?: string; error?: string; commit?: string };
      if (response.status === 401) {
        setAuthenticated(false);
        setShowLogin(true);
        throw new Error("Ta session a expiré. Reconnecte-toi.");
      }
      if (!response.ok) throw new Error(payload.error || "La publication a échoué.");
      setToast(`${payload.message || "Publication lancée."}${payload.commit ? ` Commit ${payload.commit}.` : ""}`);
      window.setTimeout(() => setToast(""), 7000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "La publication a échoué.");
    } finally {
      setActionPending(null);
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActionError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json() as { authenticated?: boolean; error?: string };
      if (!response.ok || !payload.authenticated) throw new Error(payload.error || "Connexion impossible.");
      setAuthenticated(true);
      setShowLogin(false);
      setPassword("");
      setToast("Connexion administrateur activée pour 12 heures.");
      window.setTimeout(() => setToast(""), 4500);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Connexion impossible.");
    }
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

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://bonsplansmania-alerts.selenevoyance14.workers.dev/monitoring/amazon-price-drops", { signal: controller.signal })
      .then((response) => response.json() as Promise<{ drops?: PriceDrop[] }>)
      .then((payload) => setPriceDrops(Object.fromEntries((payload.drops || []).map((drop) => [drop.slug, drop]))))
      .catch((error: Error) => { if (error.name !== "AbortError") setPriceDrops({}); });
    return () => controller.abort();
  }, []);

  const liveImage = amazonOffer?.image || active?.image;
  function showSection(nextSection: "deals" | "codes" | "homepage" | "price-drops") {
    setSection(nextSection);
    setQuery("");
    setStatus("all");
    setMerchant("all");
    setSelected(null);
  }
  return <main className={styles.shell}>
    <aside className={styles.sidebar}>
      <a className={styles.logo} href="/">Bons Plans <span>Mania</span></a><p className={styles.sideLabel}>Administration</p>
      <nav>
        <button className={section === "deals" ? styles.navActive : ""} onClick={() => showSection("deals")}><ShoppingBag size={18}/> Bons plans <b>{summary.totalActive}</b></button>
        <button className={section === "codes" ? styles.navActive : ""} onClick={() => showSection("codes")}><Tag size={18}/> Codes promo <b>{summary.totalCodes}</b></button>
        <button className={section === "homepage" ? styles.navActive : ""} onClick={() => showSection("homepage")}><ArrowUp size={18}/> Page d’accueil <b>15</b></button>
        <button className={section === "price-drops" ? styles.navActive : ""} onClick={() => showSection("price-drops")}><ArrowDown size={18}/> Prix en baisse <b>{Object.keys(priceDrops).length}</b></button>
        <button onClick={() => { showSection("deals"); setStatus("missing-link"); }}><Link2Off size={18}/> Liens manquants <b className={styles.dangerCount}>{liveStatuses.filter((dealStatus) => dealStatus === "missing-link").length}</b></button>
        <button onClick={() => { showSection("deals"); setStatus("missing-image"); }}><ImageOff size={18}/> Images manquantes <b>{liveStatuses.filter((dealStatus) => dealStatus === "missing-image").length}</b></button>
        <a href="/archives/bons-plans"><Archive size={18}/> Archives <b>{summary.totalArchived}</b></a>
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
      <p className={styles.scopeNote}>{filtered.length} offre{filtered.length > 1 ? "s" : ""} affichée{filtered.length > 1 ? "s" : ""} sur {summary.totalActive} offres actives.</p>
      <div className={styles.contentGrid}>
        <section className={styles.dealList}><div className={styles.listHead}><span>OFFRE</span><span>PRIX</span><span>ÉTAT</span></div>
          {filtered.map((deal) => <button key={deal.slug} className={`${styles.dealRow} ${active?.slug === deal.slug ? styles.selected : ""}`} onClick={() => setSelected(deal.slug)}>
            <div className={styles.thumb}>{deal.image && !deal.image.includes("placeholder") ? <Image src={deal.image} alt="" width={44} height={44}/> : <ShoppingBag size={21}/>}</div>
            <div className={styles.dealName}><a href={`/article/${deal.slug}`} target="_blank" onClick={(event) => event.stopPropagation()}>{deal.title} <ExternalLink size={12}/></a><span>{deal.merchant} · modifié le {new Date(`${deal.updated}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span></div><span className={styles.price}>{priceDrops[deal.slug]?.displayPrice || deal.price}</span><span className={`${styles.status} ${priceDrops[deal.slug] ? styles["price-drop"] : styles[statusFor(deal)]}`}>{priceDrops[deal.slug] ? `${priceDrops[deal.slug].changePercent}%` : statusLabel[statusFor(deal)]}</span>
          </button>)}{filtered.length === 0 ? <p className={styles.empty}>Aucune offre ne correspond à ces filtres.</p> : null}
        </section>
        <aside className={styles.editor}>{active ? <><span className={styles.editorEyebrow}>FICHE SÉLECTIONNÉE</span>
          {liveImage && !liveImage.includes("placeholder") ? <div className={styles.previewImage}><Image src={liveImage} alt="" width={250} height={150}/></div> : null}
          <h2>{amazonOffer?.title || active.title}</h2><a href={`/article/${active.slug}`} target="_blank">Voir l’article <ExternalLink size={14}/></a>
          <div className={styles.field}><label>Marchand</label><input value={active.merchant} readOnly/></div><div className={styles.field}><label>{active.amazonAsin ? "Prix Amazon actuel ou prix à enregistrer" : "Prix à enregistrer"}</label><input value={amazonLoading ? "Vérification en cours…" : editablePrice} disabled={amazonLoading} onChange={(event) => setManualPrices((prices) => ({ ...prices, [active.slug]: event.target.value }))} placeholder="Exemple : 29,99 €"/></div>
          {active.endDate ? <div className={styles.field}><label>Date de fin</label><input value={new Date(`${active.endDate}T12:00:00`).toLocaleDateString("fr-FR")} readOnly/></div> : null}
          <div className={`${styles.audit} ${amazonOffer?.error ? styles.auditWarning : ""}`}>{amazonLoading ? <LoaderCircle className={styles.spin} size={17}/> : amazonOffer?.error ? <AlertTriangle size={17}/> : <Check size={17}/>}<div><b>{amazonLoading ? "Interrogation de l’API Amazon" : amazonOffer?.error || (active.amazonAsin ? amazonOffer?.availability || "Offre Amazon vérifiée" : "Données éditoriales analysées")}</b><small>{amazonOffer?.checkedAt ? `Vérifié le ${new Date(amazonOffer.checkedAt).toLocaleString("fr-FR")}` : "Aucune estimation inventée"}</small></div></div>
          {!active.amazonAsin && linkResult?.checkedAt ? <div className={`${styles.audit} ${linkResult.ok ? "" : styles.auditWarning}`}>{linkResult.ok ? <Check size={17}/> : <AlertTriangle size={17}/>}<div><b>{linkResult.ok ? `Lien marchand accessible (${linkResult.status})` : `Lien à vérifier (${linkResult.status || "réseau"})`}</b><small>Contrôlé automatiquement le {new Date(linkResult.checkedAt).toLocaleString("fr-FR")}</small></div></div> : null}
          {amazonOffer?.oldPrice ? <p className={styles.amazonSaving}>Prix précédent affiché : <b>{amazonOffer.oldPrice}</b>{amazonOffer.savingsPercent ? ` · -${amazonOffer.savingsPercent}%` : ""}</p> : null}
          {activePriceDrop ? <div className={styles.priceDropCard}><ArrowDown size={18}/><div><b>Vraie baisse constatée : {activePriceDrop.changePercent}%</b><small>{activePriceDrop.previousPrice?.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} → {activePriceDrop.displayPrice} · relevé le {new Date(activePriceDrop.checkedAt).toLocaleString("fr-FR")}</small></div></div> : null}
          <div className={styles.reminderBox}><b><CalendarClock size={16}/> Programmer le prochain contrôle</b><div className={styles.reminderPresets}><button onClick={() => scheduleIn(active.slug, 1)}>Demain</button><button onClick={() => scheduleIn(active.slug, 3)}>Dans 3 jours</button><button onClick={() => scheduleIn(active.slug, 7)}>Dans 7 jours</button></div><label>Date précise<input type="date" min={new Date().toLocaleDateString("sv-SE")} value={reminders[active.slug] || ""} onChange={(event) => saveReminder(active.slug, event.target.value || undefined)}/></label>{reminders[active.slug] ? <p>Prochain contrôle le <strong>{new Date(`${reminders[active.slug]}T12:00:00`).toLocaleDateString("fr-FR")}</strong> <button onClick={() => saveReminder(active.slug)}>Annuler</button></p> : null}</div>
          <div className={styles.actionInfo}><b>Actions de la fiche {authenticated ? <span className={styles.connected}>Connectée</span> : null}</b><p>Chaque action modifie directement l’article sur le dépôt principal et lance sa mise en ligne.</p></div>
          {showLogin ? <form className={styles.loginBox} onSubmit={login}><label>Mot de passe administrateur<input type="password" autoFocus value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password"/></label><div><button type="button" onClick={() => { setShowLogin(false); setActionError(""); }}>Annuler</button><button type="submit">Se connecter</button></div></form> : null}
          {actionError ? <p className={styles.actionError}><AlertTriangle size={15}/> {actionError}</p> : null}
          <button className={styles.updateOnly} disabled={Boolean(actionPending)} onClick={() => publishAction("update")}>{actionPending === "update" ? <LoaderCircle className={styles.spin} size={16}/> : <Check size={16}/>} Mettre à jour seulement</button><button className={styles.updateAndRaise} disabled={Boolean(actionPending)} onClick={() => publishAction("raise")}>{actionPending === "raise" ? <LoaderCircle className={styles.spin} size={16}/> : <ArrowUp size={16}/>} Mettre à jour et remonter</button><button className={styles.archiveButton} disabled={Boolean(actionPending)} onClick={() => publishAction("archive")}>{actionPending === "archive" ? <LoaderCircle className={styles.spin} size={16}/> : <Archive size={16}/>} Archiver l’offre</button>
          <button className={styles.copyFallback} onClick={() => copyAction("update")}>Copier la demande pour Codex</button>
        </> : null}</aside>
      </div>
    </section>
    {toast ? <div className={styles.toast} role="status">{toast}</div> : null}
  </main>;
}
