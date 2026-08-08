#!/usr/bin/env python3
"""
Amazon PA-API fetcher.

Récupère titre + prix + promo + image + note + nb d'avis pour un produit Amazon.
Optionnellement télécharge l'image normalisée + génère un brouillon MDX.

Usage:
    python3 scripts/amazon-fetch.py B0B695MSWT
    python3 scripts/amazon-fetch.py https://amzn.to/3PyMV3v
    python3 scripts/amazon-fetch.py B0B695MSWT --draft monslug
"""

import os
import re
import sys
import json
import csv
import subprocess
import argparse
from pathlib import Path
from datetime import date
from dotenv import load_dotenv
from amazon_creatorsapi import AmazonCreatorsApi, Country

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

CREATOR_CREDENTIAL_ID = os.getenv("AMAZON_CREATOR_CREDENTIAL_ID")
CREATOR_CREDENTIAL_SECRET = os.getenv("AMAZON_CREATOR_CREDENTIAL_SECRET")
CREATOR_CREDENTIAL_VERSION = os.getenv("AMAZON_CREATOR_CREDENTIAL_VERSION")
PARTNER_TAG = os.getenv("AMAZON_PARTNER_TAG", "lebrunnathali-21")
COUNTRY = "FR"
LOCAL_CREDENTIALS = ROOT / ".amazon-creators-credentials.csv"

IMAGES_DIR = ROOT / "public" / "images" / "articles"
CONTENT_DIR = ROOT / "content"


def safe(obj, *attrs):
    """Accède à obj.a.b.c en renvoyant None si un maillon est None."""
    for a in attrs:
        if obj is None:
            return None
        obj = getattr(obj, a, None)
    return obj


def resolve_short_url(url: str) -> str:
    # 1. Headers d'abord (souvent l'ASIN est dans la location finale)
    head = subprocess.run(
        ["curl", "-sIL", "-A", "Mozilla/5.0", url],
        capture_output=True, text=True, timeout=30,
    )
    m = re.search(r"/dp/([A-Z0-9]{10})", head.stdout)
    if m:
        return m.group(1)
    # 2. Sinon le corps
    body = subprocess.run(
        ["curl", "-sL", "-A", "Mozilla/5.0", url],
        capture_output=True, text=True, timeout=30,
    )
    m = re.search(r"/dp/([A-Z0-9]{10})", body.stdout)
    if m:
        return m.group(1)
    raise ValueError(f"Aucun ASIN trouvé sur {url}")


def extract_asin(arg: str) -> str:
    if re.fullmatch(r"[A-Z0-9]{10}", arg):
        return arg
    m = re.search(r"/dp/([A-Z0-9]{10})", arg)
    if m:
        return m.group(1)
    if "amzn.to/" in arg or "amzn.eu/" in arg:
        return resolve_short_url(arg)
    raise ValueError(f"Impossible d'extraire un ASIN de : {arg}")


def safe_dict(d, *keys):
    """Accès en chaîne dans des dicts imbriqués (offers_v2 renvoie des dicts)."""
    for k in keys:
        if d is None:
            return None
        d = d.get(k) if isinstance(d, dict) else getattr(d, k, None)
    return d


def creators_credentials() -> tuple[str, str, str]:
    """Charge les identifiants depuis .env ou le CSV local non versionné."""
    if all((CREATOR_CREDENTIAL_ID, CREATOR_CREDENTIAL_SECRET, CREATOR_CREDENTIAL_VERSION)):
        return (
            CREATOR_CREDENTIAL_ID,
            CREATOR_CREDENTIAL_SECRET,
            CREATOR_CREDENTIAL_VERSION,
        )

    if LOCAL_CREDENTIALS.exists():
        with LOCAL_CREDENTIALS.open(newline="", encoding="utf-8-sig") as handle:
            row = next(csv.DictReader(handle), None)
        if row:
            credential_id = row.get("Credential Id")
            credential_secret = row.get("Secret")
            version = row.get("Version")
            if all((credential_id, credential_secret, version)):
                return credential_id, credential_secret, version

    raise RuntimeError(
        "Identifiants Amazon Creators API absents. Renseignez "
        "AMAZON_CREATOR_CREDENTIAL_ID, AMAZON_CREATOR_CREDENTIAL_SECRET et "
        "AMAZON_CREATOR_CREDENTIAL_VERSION dans .env."
    )


def fetch(asin: str) -> dict:
    credential_id, credential_secret, version = creators_credentials()
    api = AmazonCreatorsApi(
        credential_id,
        credential_secret,
        version,
        PARTNER_TAG,
        country=Country.FR,
    )
    items = api.get_items(asin)
    if not items:
        return {}
    item = items[0]

    # offers_v2 est la nouvelle structure (prix + savings + dispo)
    listings_v2 = safe(item, "offers_v2", "listings")
    listing0 = listings_v2[0] if listings_v2 else None
    price = safe_dict(listing0, "price")
    savings = safe_dict(price, "savings")
    saving_basis = safe_dict(price, "saving_basis")
    availability = safe_dict(listing0, "availability")

    return {
        "asin": item.asin,
        "title": safe(item, "item_info", "title", "display_value"),
        "url": item.detail_page_url,
        "image": safe(item, "images", "primary", "large", "url"),
        "price": safe_dict(price, "money", "display_amount"),
        "price_amount": safe_dict(price, "money", "amount"),
        "currency": safe_dict(price, "money", "currency"),
        "old_price": safe_dict(saving_basis, "money", "display_amount"),
        "old_price_label": safe_dict(saving_basis, "saving_basis_type_label"),
        "savings": safe_dict(savings, "money", "display_amount"),
        "savings_percent": safe_dict(savings, "percentage"),
        "availability": safe_dict(availability, "message"),
        "in_stock": safe_dict(availability, "type") == "IN_STOCK",
        "brand": safe(item, "item_info", "by_line_info", "brand", "display_value"),
        "manufacturer": safe(item, "item_info", "by_line_info", "manufacturer", "display_value"),
        "features": safe(item, "item_info", "features", "display_values"),
        "color": safe(item, "item_info", "product_info", "color", "display_value"),
    }


def download_image(url: str, slug: str) -> Path:
    """Télécharge + normalise 1200x800 avec ImageMagick."""
    if not url:
        return None
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    raw = IMAGES_DIR / f"{slug}-raw.jpg"
    final = IMAGES_DIR / f"{slug}.png"
    subprocess.run(["curl", "-sL", "-o", str(raw), url], check=True)
    subprocess.run([
        "magick", str(raw),
        "-resize", "1200x800",
        "-background", "white",
        "-gravity", "center",
        "-extent", "1200x800",
        "-depth", "8",
        "-define", "png:color-type=2",
        str(final),
    ], check=True)
    raw.unlink()
    return final


def clean_catalog_title(title: str, brand: str, max_length: int = 72) -> str:
    """Transforme un intitulé catalogue Amazon en titre éditorial court."""
    cleaned = re.split(r"\s*\|\s*", title or "", maxsplit=1)[0].strip()
    if brand:
        cleaned = re.sub(rf"^(?:{re.escape(brand)}\s+)+", "", cleaned, flags=re.IGNORECASE)
        cleaned = f"{brand} {cleaned}".strip()
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" ,-–")
    if len(cleaned) <= max_length:
        return cleaned
    shortened = cleaned[: max_length + 1]
    cut = shortened.rfind(" ")
    return shortened[: cut if cut > 48 else max_length].rstrip(" ,-–")


def make_draft(data: dict, slug: str) -> Path:
    today = date.today().isoformat()
    title = data.get("title") or "Bon plan Amazon"
    brand = data.get("brand") or ""
    editorial_title = clean_catalog_title(title, brand)
    price = data.get("price") or "à voir"
    savings = data.get("savings") or ""
    pct = data.get("savings_percent")
    pct_str = f" (-{pct}%)" if pct else ""
    asin = data.get("asin")
    affiliate_url = f"https://www.amazon.fr/dp/{asin}?tag={PARTNER_TAG}"

    savings_phrase = f"{savings} d'économie" if savings else ""
    brand_tag = f'"{brand.lower()}", ' if brand else ""
    body = f"""---
title: "{editorial_title}"
description: "{editorial_title} : caractéristiques essentielles et prix actualisé automatiquement. {savings_phrase}"
date: "{today}"
category: "bon-plan"
tags: [{brand_tag}"amazon", "bon plan", "2026"]
image: "/images/articles/{slug}.png"
imageAlt: "{editorial_title}"
affiliateUrl: "{affiliate_url}"
affiliateLabel: "Voir sur Amazon"
published: true
featured: false
seoTitle: "{editorial_title} : prix et bon plan"
seoDescription: "Découvrez {editorial_title} : caractéristiques, conseils et prix actualisé automatiquement."
---

## {editorial_title}

[Voir sur Amazon]({affiliate_url})

---

## Le détail du bon plan

| Élément | Détail |
|---|---|
| **Produit** | {editorial_title} |
| **Marque** | {brand} |
| **Prix** | {price} |
| **Économie** | {savings or 'N/A'} {pct_str} |

[Voir sur Amazon]({affiliate_url})

---

## Caractéristiques

"""
    for f in (data.get("features") or [])[:10]:
        body += f"- {f}\n"

    body += f"""

---

## Notre avis

[À compléter — pourquoi c'est un bon plan, pour qui, comment l'utiliser, alternatives]

[Voir sur Amazon]({affiliate_url})

---

## Pour aller plus loin

- [Autres bons plans Amazon](/categorie/bon-plan)
"""

    out = CONTENT_DIR / f"{slug}.mdx"
    out.write_text(body, encoding="utf-8")
    return out


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("input", help="ASIN ou URL Amazon (court ou long)")
    parser.add_argument("--draft", metavar="SLUG", help="Génère un brouillon MDX + image normalisée")
    args = parser.parse_args()

    asin = extract_asin(args.input)
    print(f"ASIN détecté : {asin}", file=sys.stderr)
    data = fetch(asin)

    if args.draft:
        slug = args.draft
        if data.get("image"):
            img_path = download_image(data["image"], slug)
            print(f"Image : {img_path}", file=sys.stderr)
        else:
            print("⚠ Pas d'image disponible — slug sans image", file=sys.stderr)
        mdx_path = make_draft(data, slug)
        print(f"Brouillon : {mdx_path}", file=sys.stderr)

    print(json.dumps(data, indent=2, ensure_ascii=False))
