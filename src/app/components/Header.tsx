"use client";
import { useState, useRef, useEffect } from "react";

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

  const isBeautyActive = ["/beaute", "/box-beaute", "/calendrier", "/calendrier-avent"].some(p => activePage === p);
  const isTestsActive = ["/test-produit", "/test-gratuit", "/test-avis", "/comparatif"].some(p => activePage === p);
  const isBonsPlansActive = ["/bon-plan", "/bons-plans-bebe", "/bons-plans-beaute", "/bons-plans-ninja", "/bons-plans-tech", "/bons-plans-maison", "/bons-plans-jardin", "/bons-plans-mode", "/bons-plans-jouets", "/bons-plans-rentree"].some(p => activePage === p);

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
                  <a href="/bons-plans-beaute">🌸 Coin Beauté</a>
                  <a href="/bons-plans-bebe">👶 Coin Bébé</a>
                  <a href="/bons-plans-ninja"><span style={{ display: "inline-block", background: "#000", color: "#fff", padding: "0 5px", borderRadius: "3px", fontWeight: 800, fontSize: "0.85em", marginRight: "6px", lineHeight: "1.3", verticalAlign: "0" }}>N</span>Coin Ninja</a>
                  <a href="/bons-plans-tech">📱 Coin Tech</a>
                  <a href="/bons-plans-maison">🏠 Coin Maison</a>
                  <a href="/bons-plans-jardin">🌱 Coin Jardin & Animaux</a>
                  <a href="/bons-plans-mode">👗 Coin Mode</a>
                  <a href="/bons-plans-jouets">🧸 Coin Jouets</a>
                  <a href="/bons-plans-rentree">🎒 Coin Rentrée</a>
                  <a href="/bons-plans-en-cours">🔥 Bons plans en cours</a>
                  <a href="/codes-promo-permanents">♾️ Codes promo permanents</a>
                  <a href="/code-promo">Codes promo marques</a>
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
                  <a href="/categorie/comparatif">Comparatifs</a>
                </div>
              )}
            </div>
            <a href="/code-promo" className={activePage === "/code-promo" ? "active" : ""}>Codes promo</a>
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
                  <a href="/categorie/beaute">Guides & Tests</a>
                  <a href="/categorie/box-beaute">Box Beauté</a>
                  <a href="/categorie/calendrier-avent">Calendrier de l'Avent</a>
                </div>
              )}
            </div>
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
            <a href="/bons-plans-beaute" onClick={() => setMobileOpen(false)}>🌸 Coin Beauté</a>
            <a href="/bons-plans-bebe" onClick={() => setMobileOpen(false)}>👶 Coin Bébé</a>
            <a href="/bons-plans-ninja" onClick={() => setMobileOpen(false)}><span style={{ display: "inline-block", background: "#000", color: "#fff", padding: "0 5px", borderRadius: "3px", fontWeight: 800, fontSize: "0.85em", marginRight: "6px", lineHeight: "1.3", verticalAlign: "0" }}>N</span>Coin Ninja</a>
            <a href="/bons-plans-tech" onClick={() => setMobileOpen(false)}>📱 Coin Tech</a>
            <a href="/bons-plans-maison" onClick={() => setMobileOpen(false)}>🏠 Coin Maison</a>
            <a href="/bons-plans-jardin" onClick={() => setMobileOpen(false)}>🌱 Coin Jardin & Animaux</a>
            <a href="/bons-plans-mode" onClick={() => setMobileOpen(false)}>👗 Coin Mode</a>
            <a href="/bons-plans-jouets" onClick={() => setMobileOpen(false)}>🧸 Coin Jouets</a>
            <a href="/bons-plans-rentree" onClick={() => setMobileOpen(false)}>🎒 Coin Rentrée</a>
            <a href="/bons-plans-en-cours" onClick={() => setMobileOpen(false)}>🔥 Bons plans en cours</a>
            <a href="/codes-promo-permanents" onClick={() => setMobileOpen(false)}>♾️ Codes promo permanents</a>
            <a href="/code-promo" onClick={() => setMobileOpen(false)}>Codes promo marques</a>
          </div>
          <div className="mobile-menu-section">
            <span className="mobile-menu-title">Tests Produits</span>
            <a href="/categorie/test-produit" onClick={() => setMobileOpen(false)}>Tous les tests</a>
            <a href="/categorie/test-gratuit" onClick={() => setMobileOpen(false)}>Tests Gratuits</a>
            <a href="/categorie/test-avis" onClick={() => setMobileOpen(false)}>Tests & Avis</a>
            <a href="/categorie/comparatif" onClick={() => setMobileOpen(false)}>Comparatifs</a>
          </div>
          <a href="/code-promo" onClick={() => setMobileOpen(false)}>Codes promo</a>
          <a href="/categorie/concours" onClick={() => setMobileOpen(false)}>Concours</a>
          <div className="mobile-menu-section">
            <span className="mobile-menu-title">Beauté</span>
            <a href="/categorie/beaute" onClick={() => setMobileOpen(false)}>Guides & Tests</a>
            <a href="/categorie/box-beaute" onClick={() => setMobileOpen(false)}>Box Beauté</a>
            <a href="/categorie/calendrier-avent" onClick={() => setMobileOpen(false)}>Calendrier de l&apos;Avent</a>
          </div>
          <a href="/blog" onClick={() => setMobileOpen(false)}>Tous les articles</a>
          <a href="/recherche" onClick={() => setMobileOpen(false)}>🔍 Rechercher</a>
        </div>
      )}
    </header>
  );
}
