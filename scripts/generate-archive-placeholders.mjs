import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "public", "images", "articles");

const placeholders = [
  {
    filename: "_archive-concours-termine.png",
    eyebrow: "ARCHIVES BONS PLANS MANIA",
    title: "Concours terminé",
    subtitle: "Ce jeu n’accepte plus de participations",
    accent: "#7C3AED",
    soft: "#F3E8FF",
    icon: "★",
  },
  {
    filename: "_archive-test-produit-termine.png",
    eyebrow: "ARCHIVES BONS PLANS MANIA",
    title: "Test produit terminé",
    subtitle: "Les candidatures sont désormais closes",
    accent: "#0F9F9A",
    soft: "#DDF7F5",
    icon: "✓",
  },
  {
    filename: "_archive-offre-expiree.png",
    eyebrow: "ARCHIVES BONS PLANS MANIA",
    title: "Offre expirée",
    subtitle: "Cette promotion n’est plus disponible",
    accent: "#E85D75",
    soft: "#FFE7EC",
    icon: "×",
  },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createSvg({ eyebrow, title, subtitle, accent, soft, icon }) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFFFFF"/>
          <stop offset="1" stop-color="${soft}"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="675" rx="36" fill="url(#background)"/>
      <circle cx="1090" cy="95" r="175" fill="${accent}" opacity="0.08"/>
      <circle cx="95" cy="610" r="145" fill="${accent}" opacity="0.07"/>
      <rect x="86" y="78" width="330" height="52" rx="26" fill="${soft}"/>
      <text x="251" y="111" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="1.5" fill="${accent}">${escapeXml(eyebrow)}</text>
      <circle cx="600" cy="270" r="78" fill="${accent}"/>
      <text x="600" y="296" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="700" fill="#FFFFFF">${escapeXml(icon)}</text>
      <text x="600" y="420" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="800" fill="#172033">${escapeXml(title)}</text>
      <text x="600" y="476" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="400" fill="#526071">${escapeXml(subtitle)}</text>
      <rect x="450" y="530" width="300" height="5" rx="2.5" fill="${accent}" opacity="0.65"/>
      <text x="600" y="590" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="${accent}">bonsplansmania.fr</text>
    </svg>
  `;
}

fs.mkdirSync(outputDir, { recursive: true });

await Promise.all(
  placeholders.map(async (placeholder) => {
    const outputPath = path.join(outputDir, placeholder.filename);
    await sharp(Buffer.from(createSvg(placeholder)))
      .png({ compressionLevel: 9, palette: true })
      .toFile(outputPath);
    console.log(`Créé : ${outputPath}`);
  }),
);
