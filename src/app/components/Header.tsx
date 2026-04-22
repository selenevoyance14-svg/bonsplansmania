"use client";
import { useState, useRef, useEffect } from "react";

// Seasonal hubs ordered by event date. The Header auto-displays the first
// one whose highlight window contains today's date. Keep in sync with
// src/lib/seasonal.ts (duplicated here to keep this a pure client component).
const SEASONAL_HUBS_HEADER = [
  { slug: "saint-valentin-2026",   label: "Saint-Valentin",     emoji: "💕", color: "#ec4899", start: "2026-01-20", end: "2026-02-16" },
  { slug: "fete-des-meres-2026",   label: "Fête des Mères",     emoji: "🌸", color: "#e11d48", start: "2026-04-20", end: "2026-06-10" },
  { slug: "fete-des-peres-2026",   label: "Fête des Pères",     emoji: "👨", color: "#0284c7", start: "2026-06-08", end: "2026-06-25" },
  { slug: "soldes-ete-2026",       label: "Soldes d'Été",       emoji: "☀️", color: "#eab308", start: "2026-06-15", end: "2026-07-25" },
  { slug: "rentree-scolaire-2026", label: "Rentrée Scolaire",   emoji: "🎒", color: "#7c3aed", start: "2026-08-01", end: "2026-09-15" },
  { slug: "halloween-2026",        label: "Halloween",          emoji: "🎃", color: "#ea580c", start: "2026-10-01", end: "2026-11-02" },
  { slug: "black-friday-2026",     label: "Black Friday",       emoji: "🛍️", color: "#1f2937", start: "2026-11-10", end: "2026-12-02" },
  { slug: "calendrier-avent-2026", label: "Calendrier Avent",   emoji: "🎄", color: "#059669", start: "2026-09-15", end: "2026-12-25" },
  { slug: "noel-2026",             label: "Noël",               emoji: "🎁", color: "#dc2626", start: "2026-11-28", end: "2026-12-26" },
];

function getActiveSeasonalHub() {
  const now = new Date();
  return SEASONAL_HUBS_HEADER.find((h) => now >= new Date(h.start) && now <= new Date(h.end)) || null;
}

export default function Header({ activePage }: { activePage?: string }) {
  const [beautyOpen, setBeautyOpen] = useState(false);
  const [testsOpen, setTestsOpen] = useState(false);
  const [bonsPlansOpen, setBonsPlansOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const testsRef = useRef<HTMLDivElement>(null);
  const bonsPlansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBeautyOpen(false);
      }
      if (testsRef.current && !testsRef.current.contains(e.target as Node)) {
        setTestsOpen(false);
      }
      if (bonsPlansRef.current && !bonsPlansRef.current.contains(e.target as Node)) {
        setBonsPlansOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isBeautyActive = ["/beaute", "/box-beaute", "/calendrier", "/calendrier-avent", "/meilleures-box-beaute", "/tests-beaute-skincare"].some(p => activePage === p);
  const isTestsActive = ["/test-produit", "/test-gratuit", "/test-avis"].some(p => activePage === p);
  const isBonsPlansActive = ["/bon-plan", "/amazon-bons-plans", "/bons-plans-bebe"].some(p => activePage === p);

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <a href="/" className="logo">
            Bons Plans <span>Mania</span>
          </a>
          <nav className="nav">
            <a href="/" className={activePage === "/" ? "active" : ""}>Accueil</a>
            <div className="nav-dropdown" ref={bonsPlansRef}>
              <button
                className={`nav-dropdown-toggle ${isBonsPlansActive ? "active" : ""}`}
                onClick={() => { setBonsPlansOpen(!bonsPlansOpen); setTestsOpen(false); setBeautyOpen(false); }}
              >
                Bons Plans ▾
              </button>
              {bonsPlansOpen && (
                <div className="nav-dropdown-menu">
                  <a href="/categorie/bon-plan">Tous les bons plans</a>
                  <a href="/amazon-bons-plans">🛒 Amazon Bons Plans</a>
                  <a href="/bons-plans-bebe">👶 Bons Plans Bébé</a>
                </div>
              )}
            </div>
            <div className="nav-dropdown" ref={testsRef}>
              <button
                className={`nav-dropdown-toggle ${isTestsActive ? "active" : ""}`}
                onClick={() => { setTestsOpen(!testsOpen); setBeautyOpen(false); setBonsPlansOpen(false); }}
              >
                Tests Produits ▾
              </button>
              {testsOpen && (
                <div className="nav-dropdown-menu">
                  <a href="/categorie/test-produit">Tous les tests</a>
                  <a href="/categorie/test-gratuit">Tests Gratuits</a>
                  <a href="/categorie/test-avis">Tests & Avis</a>
                  <a href="/tests-beaute-skincare">✨ Tests Beauté & Skincare</a>
                </div>
              )}
            </div>
            <a href="/categorie/concours" className={activePage === "/concours" ? "active" : ""}>Concours</a>
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className={`nav-dropdown-toggle ${isBeautyActive ? "active" : ""}`}
                onClick={() => { setBeautyOpen(!beautyOpen); setTestsOpen(false); setBonsPlansOpen(false); }}
              >
                Beauté ▾
              </button>
              {beautyOpen && (
                <div className="nav-dropdown-menu">
                  <a href="/categorie/beaute">Conseils & Tests</a>
                  <a href="/categorie/box-beaute">Box Beauté</a>
                  <a href="/meilleures-box-beaute">⭐ Meilleures Box Beauté</a>
                  <a href="/tests-beaute-skincare">✨ Tests Skincare & Maquillage</a>
                  <a href="/categorie/calendrier-avent">Calendrier de l'Avent</a>
                </div>
              )}
            </div>
            {(() => {
              const seasonal = getActiveSeasonalHub();
              if (!seasonal) return null;
              return (
                <a
                  href={`/${seasonal.slug}`}
                  className={activePage === `/${seasonal.slug}` ? "active" : ""}
                  style={{ color: seasonal.color, fontWeight: 600 }}
                >
                  {seasonal.emoji} {seasonal.label}
                </a>
              );
            })()}
            <a href="/blog" className={`nav-cta ${activePage === "/blog" ? "active" : ""}`}>Tous les articles</a>
            <a href="/recherche" className="search-btn" aria-label="Rechercher" title="Rechercher" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", color: "inherit", transition: "background 0.2s" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </a>
          </nav>

          {/* Burger button : visible uniquement sur mobile via CSS */}
          <button
            className="burger-btn"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panneau menu mobile (s'affiche quand mobileOpen = true) */}
      {mobileOpen && (
        <div className="mobile-menu" role="navigation" aria-label="Menu principal">
          <a href="/" onClick={() => setMobileOpen(false)}>Accueil</a>
          <div className="mobile-menu-section">
            <span className="mobile-menu-title">Bons Plans</span>
            <a href="/categorie/bon-plan" onClick={() => setMobileOpen(false)}>Tous les bons plans</a>
            <a href="/amazon-bons-plans" onClick={() => setMobileOpen(false)}>🛒 Amazon Bons Plans</a>
            <a href="/bons-plans-bebe" onClick={() => setMobileOpen(false)}>👶 Bons Plans Bébé</a>
          </div>
          <div className="mobile-menu-section">
            <span className="mobile-menu-title">Tests Produits</span>
            <a href="/categorie/test-produit" onClick={() => setMobileOpen(false)}>Tous les tests</a>
            <a href="/categorie/test-gratuit" onClick={() => setMobileOpen(false)}>Tests Gratuits</a>
            <a href="/categorie/test-avis" onClick={() => setMobileOpen(false)}>Tests & Avis</a>
            <a href="/tests-beaute-skincare" onClick={() => setMobileOpen(false)}>✨ Tests Beauté & Skincare</a>
          </div>
          <a href="/categorie/concours" onClick={() => setMobileOpen(false)}>Concours</a>
          <div className="mobile-menu-section">
            <span className="mobile-menu-title">Beauté</span>
            <a href="/categorie/beaute" onClick={() => setMobileOpen(false)}>Conseils & Tests</a>
            <a href="/categorie/box-beaute" onClick={() => setMobileOpen(false)}>Box Beauté</a>
            <a href="/meilleures-box-beaute" onClick={() => setMobileOpen(false)}>⭐ Meilleures Box Beauté</a>
            <a href="/tests-beaute-skincare" onClick={() => setMobileOpen(false)}>✨ Tests Skincare & Maquillage</a>
            <a href="/categorie/calendrier-avent" onClick={() => setMobileOpen(false)}>Calendrier de l&apos;Avent</a>
          </div>
          {(() => {
            const seasonal = getActiveSeasonalHub();
            if (!seasonal) return null;
            return (
              <a
                href={`/${seasonal.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{ color: seasonal.color, fontWeight: 700 }}
              >
                {seasonal.emoji} {seasonal.label}
              </a>
            );
          })()}
          <a href="/blog" onClick={() => setMobileOpen(false)}>Tous les articles</a>
          <a href="/recherche" onClick={() => setMobileOpen(false)}>🔍 Rechercher</a>
        </div>
      )}
    </header>
  );
}
