"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./EditorialHeader.module.css";

const menus = [
  {
    label: "Bons Plans",
    active: ["/bon-plan", "/bons-plans-"],
    links: [
      ["Air Fryer & Ninja", "/bons-plans-ninja"],
      ["Bons plans beauté", "/bons-plans-beaute"],
      ["Bons plans en cours", "/bons-plans-en-cours"],
      ["Bons plans Prozis", "/marque/prozis"],
      ["Coin Bébé", "/bons-plans-bebe"],
      ["Coin Jouets", "/bons-plans-jouets"],
      ["Coin Maison", "/bons-plans-maison"],
      ["Coin Mode", "/bons-plans-mode"],
      ["Coin Rentrée", "/bons-plans-rentree"],
      ["Coin Tech", "/bons-plans-tech"],
      ["Guide Air Fryer 2026", "/guide-air-fryer-2026"],
      ["Idées cadeaux Noël 2026", "/idees-cadeaux-noel-2026"],
      ["Jardin & animaux", "/bons-plans-jardin"],
      ["Marques partenaires", "/marques-partenaires"],
      ["Proposer un bon plan", "/proposer-un-bon-plan"],
      ["Réductions toute l’année", "/codes-promo-permanents"],
      ["Tenir son budget", "/tenir-son-budget"],
    ],
  },
  {
    label: "Tests Produits",
    active: ["/test-", "/comparatif"],
    links: [["Tests gratuits 2026", "/tests-produits-gratuits-2026"], ["Tous les tests", "/categorie/test-produit"], ["Tests gratuits", "/categorie/test-gratuit"], ["Tests & avis", "/categorie/test-avis"], ["Comparatifs", "/categorie/comparatif"]],
  },
  {
    label: "Beauté",
    active: ["/beaute", "/box-beaute", "/avis-prix-beaute", "/calendrier", "/guide-solaires"],
    links: [["Avis et prix beauté", "/avis-prix-beaute"], ["Guide d’achat solaires", "/guide-solaires-2026"], ["Comparatif box beauté", "/meilleures-box-beaute"], ["Toutes les actualités box", "/categorie/box-beaute"], ["Calendriers de l’Avent 2026", "/calendriers-de-l-avent-2026"], ["Guides & tests", "/categorie/beaute"]],
  },
] as const;

export default function Header({ activePage = "" }: { activePage?: string }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [activePage]);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="Bons Plans Mania, accueil">Bons Plans <em>Mania</em></Link>
        <nav className={styles.desktopNav} aria-label="Navigation principale">
          <Link href="/" className={activePage === "/" ? styles.active : ""}>Accueil</Link>
          {menus.slice(0, 2).map((menu) => (
            <div className={styles.dropdown} key={menu.label}>
              <button type="button" aria-expanded={openMenu === menu.label} onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)} className={menu.active.some((path) => activePage.includes(path)) ? styles.active : ""}>{menu.label}<span>⌄</span></button>
              {openMenu === menu.label && <div className={`${styles.dropdownPanel} ${menu.label === "Bons Plans" ? styles.dropdownPanelWide : ""}`}>{menu.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>}
            </div>
          ))}
          <Link href="/code-promo" className={activePage === "/code-promo" ? styles.active : ""}>Codes promo</Link>
          <Link href="/categorie/concours" className={activePage.includes("concours") ? styles.active : ""}>Concours</Link>
          {menus.slice(2).map((menu) => (
            <div className={styles.dropdown} key={menu.label}>
              <button type="button" aria-expanded={openMenu === menu.label} onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)} className={menu.active.some((path) => activePage.includes(path)) ? styles.active : ""}>{menu.label}<span>⌄</span></button>
              {openMenu === menu.label && <div className={styles.dropdownPanel}>{menu.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>}
            </div>
          ))}
        </nav>
        <Link className={styles.today} href="/bons-plans-en-cours">Offres du jour</Link>
        <button type="button" className={styles.burger} aria-expanded={mobileOpen} aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setMobileOpen(!mobileOpen)}><span /><span /><span /></button>
      </div>
      {mobileOpen && (
        <nav className={styles.mobilePanel} aria-label="Navigation mobile">
          <Link href="/">Accueil</Link>
          {menus.map((menu) => <div key={menu.label}><strong>{menu.label}</strong>{menu.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>)}
          <Link href="/code-promo">Codes promo</Link><Link href="/categorie/concours">Concours</Link>
        </nav>
      )}
    </header>
  );
}
