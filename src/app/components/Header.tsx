"use client";
import { useState, useRef, useEffect } from "react";

export default function Header({ activePage }: { activePage?: string }) {
  const [beautyOpen, setBeautyOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setBeautyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isBeautyActive = ["/beaute", "/box-beaute", "/calendrier", "/calendrier-avent"].some(p => activePage === p);

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <a href="/" className="logo">
            Bons Plans <span>Mania</span>
          </a>
          <nav className="nav">
            <a href="/" className={activePage === "/" ? "active" : ""}>Accueil</a>
            <a href="/categorie/bon-plan" className={activePage === "/bon-plan" ? "active" : ""}>Bons Plans</a>
            <a href="/categorie/test-gratuit" className={activePage === "/test-gratuit" ? "active" : ""}>Tests Gratuits</a>
            <a href="/categorie/concours" className={activePage === "/concours" ? "active" : ""}>Concours</a>
            <div className="nav-dropdown" ref={dropdownRef}>
              <button
                className={`nav-dropdown-toggle ${isBeautyActive ? "active" : ""}`}
                onClick={() => setBeautyOpen(!beautyOpen)}
              >
                Beauté ▾
              </button>
              {beautyOpen && (
                <div className="nav-dropdown-menu">
                  <a href="/categorie/beaute">Conseils & Tests</a>
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
        </div>
      </div>
    </header>
  );
}
