// Sélection déterministe de "flash deals" pour un article donné.
// Le même article affiche toujours les mêmes produits (stable),
// mais 2 articles différents montrent des sets différents (rotation naturelle).

export interface FlashDealProduct {
    asin: string;
    slug: string;
    title: string;
    price: number;
    rating?: number;
    reviews_count?: number;
    image: string;
    affiliate_url: string;
}

interface CatalogData {
    generated_at: string;
    count: number;
    products: FlashDealProduct[];
}

let cachedCatalog: FlashDealProduct[] | null = null;

function loadCatalog(): FlashDealProduct[] {
    if (cachedCatalog) return cachedCatalog;
    try {
        // Import dynamique du JSON (évite l'erreur si le fichier n'existe pas encore)
        // En statique export, le require est résolu au build.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const data: CatalogData = require("@/data/amazon-flash-deals.json");
        cachedCatalog = data.products || [];
    } catch {
        cachedCatalog = [];
    }
    return cachedCatalog;
}

// Hash simple : transforme un slug en nombre stable
function hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

/**
 * Retourne 4 produits "flash deals" déterministes pour un article donné.
 * Même article = mêmes produits (stable). Articles différents = sets variés.
 */
export function getFlashDealsForSlug(slug: string, count = 4): FlashDealProduct[] {
    const all = loadCatalog();
    if (all.length === 0) return [];
    if (all.length <= count) return all;

    // On part d'un offset basé sur le hash du slug, et on prend N produits consécutifs
    // (avec wrap autour du tableau)
    const start = hash(slug) % all.length;
    const result: FlashDealProduct[] = [];
    for (let i = 0; i < count; i++) {
        result.push(all[(start + i * 7) % all.length]); // step 7 pour mieux mélanger
    }
    return result;
}

export function decodeTitle(t: string): string {
    return t.replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}
