import Link from "next/link";
import { Archive, ChevronRight } from "lucide-react";
import Header from "@/app/components/Header";

export default function LegacyArchiveNotice({ title }: { title: string }) {
  return (
    <>
      <Header />
      <main>
        <section className="category-header">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Fil d’Ariane">
              <Link href="/">Accueil</Link>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <Link href="/archives">Archives</Link>
              <ChevronRight size={12} style={{ margin: "0 4px", opacity: 0.5 }} />
              <span>{title}</span>
            </nav>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
              <Archive size={22} style={{ display: "inline", verticalAlign: "middle", marginRight: "8px" }} />
              {title}
            </h1>
            <p style={{ color: "var(--muted-foreground)", maxWidth: "720px" }}>
              Toutes les anciennes offres sont désormais regroupées dans une seule archive paginée, plus simple à parcourir.
            </p>
            <Link href="/archives" className="btn btn-primary" style={{ marginTop: "16px" }}>
              Consulter toutes les archives
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
