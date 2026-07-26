#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function routeFromFile(file) {
  const relative = path.relative(OUT_DIR, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) {
    return `/${relative.slice(0, -"/index.html".length)}`;
  }
  return `/${relative.slice(0, -".html".length)}`;
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeInternalHref(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return null;
  const pathname = href.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  if (
    pathname.startsWith("/go/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    /\.[a-z0-9]{2,5}$/i.test(pathname)
  ) {
    return null;
  }
  return pathname;
}

const htmlFiles = walk(OUT_DIR).filter((file) => file.endsWith(".html"));
if (htmlFiles.length === 0) {
  console.error("Aucune sortie HTML trouvée. Lancez d’abord `next build`.");
  process.exit(1);
}

const routeFiles = new Map(
  htmlFiles.map((file) => [routeFromFile(file), file])
);
const routes = new Set(routeFiles.keys());
const incomingLinks = new Map([...routes].map((route) => [route, 0]));
const brokenLinks = new Map();
const titleRoutes = new Map();
const descriptionRoutes = new Map();
const missing = {
  title: [],
  description: [],
  canonical: [],
  h1: [],
  multipleH1: [],
};

for (const [route, file] of routeFiles) {
  const html = fs.readFileSync(file, "utf8");
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim());
  const description = decode(
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i)?.[1]
  );
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0];
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!title) missing.title.push(route);
  else titleRoutes.set(title, [...(titleRoutes.get(title) || []), route]);

  if (!description) missing.description.push(route);
  else {
    descriptionRoutes.set(description, [
      ...(descriptionRoutes.get(description) || []),
      route,
    ]);
  }

  if (!canonical) missing.canonical.push(route);
  if (h1Count === 0) missing.h1.push(route);
  if (h1Count > 1) missing.multipleH1.push({ route, count: h1Count });

  for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const target = normalizeInternalHref(decode(match[1]));
    if (!target) continue;
    if (routes.has(target)) {
      incomingLinks.set(target, (incomingLinks.get(target) || 0) + 1);
    } else {
      const key = `${route} → ${target}`;
      brokenLinks.set(key, (brokenLinks.get(key) || 0) + 1);
    }
  }
}

const duplicateTitles = [...titleRoutes.entries()]
  .filter(([, duplicateRoutes]) => duplicateRoutes.length > 1)
  .map(([value, duplicateRoutes]) => ({ value, routes: duplicateRoutes }));
const duplicateDescriptions = [...descriptionRoutes.entries()]
  .filter(([, duplicateRoutes]) => duplicateRoutes.length > 1)
  .map(([value, duplicateRoutes]) => ({ value, routes: duplicateRoutes }));
const orphanRoutes = [...incomingLinks.entries()]
  .filter(([route, count]) => route !== "/" && count === 0)
  .map(([route]) => route);

console.log(
  JSON.stringify(
    {
      pages: htmlFiles.length,
      brokenLinks: {
        count: brokenLinks.size,
        sample: [...brokenLinks.keys()].slice(0, 40),
      },
      missing,
      duplicateTitles: {
        count: duplicateTitles.length,
        sample: duplicateTitles.slice(0, 20),
      },
      duplicateDescriptions: {
        count: duplicateDescriptions.length,
        sample: duplicateDescriptions.slice(0, 20),
      },
      orphanRoutes: {
        count: orphanRoutes.length,
        sample: orphanRoutes.slice(0, 40),
      },
    },
    null,
    2
  )
);
