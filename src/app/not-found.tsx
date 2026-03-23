import Header from "@/app/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <p style={{ fontSize: "4rem", fontWeight: 800, color: "var(--primary)", marginBottom: "8px" }}>404</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>Page introuvable</h1>
          <p style={{ color: "var(--muted-foreground)", marginBottom: "32px" }}>
            Cette page n&apos;existe plus ou a été déplacée. Découvrez nos derniers bons plans beauté ci-dessous.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
            <a href="/" className="btn btn-primary">Accueil</a>
            <a href="/blog" className="btn btn-secondary">Tous les articles</a>
            <a href="/categorie/test-gratuit" className="btn btn-secondary">Tests gratuits</a>
            <a href="/categorie/concours" className="btn btn-secondary">Concours</a>
          </div>
        </div>
      </main>
    </>
  );
}