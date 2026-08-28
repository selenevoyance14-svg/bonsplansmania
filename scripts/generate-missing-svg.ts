import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Palettes de couleurs par thematique
const COLOR_THEMES: Record<string, [string, string]> = {
  // Beaute / cosmetique
  beaute: ["#E91E63", "#880E4F"],
  cosmetique: ["#E91E63", "#880E4F"],
  manucure: ["#C62828", "#880E4F"],
  cheveux: ["#9C27B0", "#6A1B9A"],
  soin: ["#E91E63", "#AD1457"],
  maquillage: ["#D81B60", "#880E4F"],
  parfum: ["#CE93D8", "#6A1B9A"],
  // Tech
  tech: ["#1A237E", "#0D47A1"],
  gaming: ["#1A237E", "#0D47A1"],
  smartphone: ["#FF6F00", "#E65100"],
  tablette: ["#00796B", "#004D40"],
  montre: ["#1A1A2E", "#FF6F00"],
  ecran: ["#1A237E", "#0D47A1"],
  logiciel: ["#FFD600", "#F9A825"],
  // Maison / jardin
  jardin: ["#F57F17", "#E65100"],
  maison: ["#795548", "#4E342E"],
  cuisine: ["#2E7D32", "#1B5E20"],
  meubles: ["#5D4037", "#3E2723"],
  sommeil: ["#5C6BC0", "#283593"],
  // Mode
  mode: ["#0D47A1", "#1565C0"],
  vetements: ["#0D47A1", "#1565C0"],
  // Sport / bien-etre
  sport: ["#37474F", "#263238"],
  massage: ["#37474F", "#263238"],
  fitness: ["#37474F", "#263238"],
  // Alimentation
  alimentation: ["#FF6B00", "#E65100"],
  // Enfants
  bebe: ["#42A5F5", "#1E88E5"],
  enfant: ["#42A5F5", "#1E88E5"],
  // Animaux
  animaux: ["#FF6B00", "#E65100"],
  // Voyage
  voyage: ["#00ACC1", "#00838F"],
  hotel: ["#00ACC1", "#00838F"],
  // Concours
  concours: ["#7B1FA2", "#4A148C"],
  // Default
  default: ["#6366F1", "#4338CA"],
};

function getColors(tags: string[], category: string): [string, string] {
  // Chercher dans les tags d'abord
  for (const tag of tags) {
    const t = tag.toLowerCase();
    for (const [key, colors] of Object.entries(COLOR_THEMES)) {
      if (t.includes(key)) return colors;
    }
  }
  // Puis dans la categorie
  for (const [key, colors] of Object.entries(COLOR_THEMES)) {
    if (category.includes(key)) return colors;
  }
  return COLOR_THEMES.default;
}

function extractDiscount(title: string): string | null {
  const match = title.match(/-(\d+)%/);
  return match ? `-${match[1]}%` : null;
}

function extractPrice(title: string): string | null {
  // Cherche "XX,XX€ au lieu de YY,YY€" ou "XX€ au lieu de YY€"
  const match = title.match(
    /(\d+(?:,\d+)?)\s*€\s*au\s*lieu\s*de\s*(\d+(?:,\d+)?)\s*€/i
  );
  if (match) return `${match[1]}€ au lieu de ${match[2]}€`;
  // Cherche juste le prix
  const priceMatch = title.match(/(\d+(?:,\d+)?)\s*€/);
  if (priceMatch) return `${priceMatch[1]}€`;
  return null;
}

function extractProductName(title: string): string {
  // Enlever la partie prix/promo du titre
  let name = title
    .replace(/\s*à\s*-\d+%.*$/i, "")
    .replace(/\s*:\s*\d+.*$/i, "")
    .replace(/\s*-\s*\d+%.*$/i, "");
  // Tronquer si trop long
  if (name.length > 40) {
    const words = name.split(" ");
    name = "";
    for (const w of words) {
      if ((name + " " + w).length > 38) break;
      name = name ? name + " " + w : w;
    }
  }
  return name;
}

function splitText(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).length > maxLen && current) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + " " + w : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/€/g, "&#8364;");
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

function generateSvg(data: {
  title: string;
  description: string;
  tags: string[];
  category: string;
}): string {
  const [color1, color2] = getColors(data.tags, data.category);
  const light = isLightColor(color1);
  const textColor = light ? "#1A1A1A" : "white";
  const textColorSub = light ? "rgba(26,26,26,0.8)" : "rgba(255,255,255,0.9)";
  const textColorFaint = light
    ? "rgba(26,26,26,0.6)"
    : "rgba(255,255,255,0.7)";
  const overlayColor = light ? "black" : "white";
  const badgeTextColor = light ? "#1A1A1A" : color1;

  const discount = extractDiscount(data.title);
  const price = extractPrice(data.title);
  const productName = extractProductName(data.title);
  const nameLines = splitText(productName, 22);

  const badgeText = discount || "PROMO";
  const badgeWidth = discount ? 100 : 140;

  const titleY = 250;
  const titleLines = nameLines.map((line, i) => {
    const y = titleY + i * 70;
    return `  <text x="80" y="${y}" font-family="Georgia, serif" font-size="52" fill="${textColor}" font-weight="700">${escapeXml(line)}</text>`;
  });

  const lastTitleY = titleY + (nameLines.length - 1) * 70;
  const separatorY = lastTitleY + 25;
  const descY = separatorY + 55;
  const priceY = descY + 60;

  // Description courte depuis le frontmatter
  let shortDesc = data.description;
  if (shortDesc.length > 55) {
    shortDesc = shortDesc.substring(0, 52) + "...";
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1050" cy="100" r="200" fill="${overlayColor}" fill-opacity="0.07" />
  <circle cx="100" cy="550" r="160" fill="${overlayColor}" fill-opacity="0.05" />
  <rect x="80" y="60" width="220" height="44" rx="22" fill="${overlayColor}" fill-opacity="0.2" />
  <text x="190" y="88" font-family="Georgia, serif" font-size="18" fill="${textColor}" text-anchor="middle" font-weight="600">BonsPlansMania.fr</text>
  <rect x="80" y="128" width="${badgeWidth}" height="36" rx="18" fill="${overlayColor}" fill-opacity="0.25" />
  <text x="${80 + badgeWidth / 2}" y="152" font-family="Arial, sans-serif" font-size="16" fill="${badgeTextColor}" text-anchor="middle" font-weight="700">${badgeText}</text>
${titleLines.join("\n")}
  <rect x="80" y="${separatorY}" width="100" height="3" rx="2" fill="${textColor}" fill-opacity="0.4" />
  <text x="80" y="${descY}" font-family="Arial, sans-serif" font-size="24" fill="${textColorSub}">${escapeXml(shortDesc)}</text>
${price ? `  <text x="80" y="${priceY}" font-family="Arial, sans-serif" font-size="36" fill="${textColor}" font-weight="700">${escapeXml(price)}</text>` : ""}
  <text x="80" y="590" font-family="Arial, sans-serif" font-size="18" fill="${textColorFaint}">bonsplansmania.fr - 2026</text>
</svg>`;
}

// --- Main ---
let generated = 0;

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
  const { data } = matter(raw);

  if (data.published === false) continue;

  const imagePath = data.image as string | undefined;
  if (!imagePath) continue;

  // Ce script ne doit jamais fabriquer un SVG sous une extension d'image
  // matricielle (.png, .jpg, .webp…). Cela produirait un fichier invalide et
  // pourrait remplacer silencieusement une vraie photo produit manquante.
  // Les images matricielles absentes sont gérées par le visuel de secours du
  // site et doivent être restaurées ou ajoutées explicitement.
  if (path.extname(imagePath).toLowerCase() !== ".svg") continue;

  // Les anciens chemins /images/amazon provenaient d'un catalogue non PA-API.
  // Le chargeur d'articles les remplace par le visuel neutre du site : ne pas
  // recréer de fichiers à ces emplacements pendant le build.
  if (imagePath.startsWith("/images/amazon/")) continue;

  const fullPath = path.join(PUBLIC_DIR, imagePath);
  if (fs.existsSync(fullPath)) continue;

  // SVG manquant, on le genere
  const svg = generateSvg({
    title: data.title || "",
    description: data.description || "",
    tags: (data.tags as string[]) || [],
    category: data.category || "bon-plan",
  });

  // Creer le dossier si necessaire
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, svg);
  generated++;
  console.log(`  SVG genere: ${path.basename(fullPath)}`);
}

// Generer placeholder si manquant
const placeholderPath = path.join(PUBLIC_DIR, "images", "placeholder.svg");
if (!fs.existsSync(placeholderPath)) {
  const placeholder = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f0f0f0" />
  <rect x="60" y="60" width="1080" height="510" rx="20" fill="rgba(0,0,0,0.05)" />
  <text x="600" y="290" font-family="Georgia, serif" font-size="48" fill="#999" text-anchor="middle" font-weight="700">BonsPlansMania.fr</text>
  <text x="600" y="370" font-family="Arial, sans-serif" font-size="28" fill="#bbb" text-anchor="middle">Image a venir</text>
</svg>`;
  fs.writeFileSync(placeholderPath, placeholder);
  generated++;
  console.log("  SVG genere: placeholder.svg");
}

if (generated === 0) {
  console.log("Tous les SVG sont presents.");
} else {
  console.log(`${generated} SVG genere(s).`);
}
