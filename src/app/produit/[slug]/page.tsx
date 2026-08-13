import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommunityProductPage from "@/app/components/CommunityProductPage";
import { COMMUNITY_PRODUCTS } from "@/lib/community-products";

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return COMMUNITY_PRODUCTS.filter((product) => product.lead && product.offers).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = COMMUNITY_PRODUCTS.find((item) => item.slug === slug);
  if (!product) return {};
  return {
    title: product.seoTitle || `${product.name} ${product.brand} : avis et comparateur de prix`,
    description: product.seoDescription || `${product.name} de ${product.brand} : avis court, marchands, prix constatés et offres disponibles.`,
    alternates: { canonical: `https://bonsplansmania.fr/produit/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = COMMUNITY_PRODUCTS.find((item) => item.slug === slug);
  if (!product?.lead || !product.offers) notFound();

  return (
    <CommunityProductPage
      slug={product.slug}
      brand={product.brand}
      name={product.name}
      image={product.image}
      imageAlt={product.imageAlt}
      lead={product.lead}
      idealFor={product.idealFor}
      strengths={product.strengths}
      watchOut={product.watchOut}
      editorialNote={product.editorialNote}
      offers={product.offers}
    />
  );
}
