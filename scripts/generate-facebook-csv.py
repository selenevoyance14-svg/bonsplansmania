#!/usr/bin/env python3
"""
Génère un CSV pour Meta Business Suite Bulk Composer / Planner.

Scanne content/*.mdx récents, extrait le frontmatter, et produit un CSV
prêt à uploader sur : https://business.facebook.com/latest/bulk_composer

Colonnes CSV :
    Post Text | Media URL | Publish Date | Publish Time | Link

Usage :
    python3 scripts/generate-facebook-csv.py                    # 7 derniers jours
    python3 scripts/generate-facebook-csv.py --days 1           # jour même
    python3 scripts/generate-facebook-csv.py --days 3
    python3 scripts/generate-facebook-csv.py --since 2026-07-04
    python3 scripts/generate-facebook-csv.py --start-date 2026-07-07
    python3 scripts/generate-facebook-csv.py --posts-per-day 12
"""

import argparse
import csv
import re
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"
OUTPUT_DIR = ROOT / "scripts" / "output"
SITE_URL = "https://bonsplansmania.fr"

# Emoji d'accroche selon la catégorie
CATEGORY_EMOJI = {
    "bon-plan": "🔥",
    "code-promo": "💰",
    "test-avis": "⭐",
    "test-gratuit": "🎁",
    "concours": "🎉",
    "box-beaute": "💄",
    "beaute": "✨",
    "selection": "🛍️",
    "calendrier-avent": "🎄",
}

# 18 créneaux étalés 08h15 → 21h00 (évite pattern spam FB)
DEFAULT_SLOTS = [
    "08:15", "09:00", "09:45", "10:30", "11:15", "12:00",
    "12:45", "13:30", "14:15", "15:00", "15:45", "16:30",
    "17:15", "18:00", "18:45", "19:30", "20:15", "21:00",
]


def get_fm(text: str, key: str) -> str:
    """Extrait une valeur du frontmatter YAML (ligne simple)."""
    m = re.search(rf"^{re.escape(key)}:\s*(.*?)$", text, re.MULTILINE)
    if not m:
        return ""
    v = m.group(1).strip()
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        v = v[1:-1]
    return v


def build_post_text(title: str, description: str, url: str, emoji: str) -> str:
    """Assemble le texte du post FB : hook + description + CTA + URL."""
    title = title.strip()
    description = description.strip()
    # Coupe la description à ~350 chars (post FB court + percutant)
    if len(description) > 350:
        description = description[:350].rsplit(" ", 1)[0] + "…"
    return f"{emoji} {title}\n\n{description}\n\n👉 {url}"


def load_articles(cutoff: date):
    """Charge tous les MDX publiés, non expirés, avec date >= cutoff."""
    articles = []
    for path in sorted(CONTENT_DIR.glob("*.mdx")):
        try:
            text = path.read_text(encoding="utf-8")
        except Exception:
            continue

        if get_fm(text, "published").lower() == "false":
            continue
        if get_fm(text, "expired").lower() == "true":
            continue

        art_date_str = get_fm(text, "date")
        try:
            art_date = datetime.strptime(art_date_str, "%Y-%m-%d").date()
        except ValueError:
            continue
        if art_date < cutoff:
            continue

        title = get_fm(text, "title")
        description = get_fm(text, "description")
        image = get_fm(text, "image")
        category = get_fm(text, "category")

        if not title:
            continue

        slug = path.stem
        url = f"{SITE_URL}/article/{slug}"
        media_url = SITE_URL + image if image.startswith("/") else image
        emoji = CATEGORY_EMOJI.get(category, "🔥")

        articles.append({
            "date": art_date,
            "slug": slug,
            "post_text": build_post_text(title, description, url, emoji),
            "media_url": media_url,
            "link": url,
            "title": title,
            "category": category,
        })
    return articles


def build_slots(posts_per_day: int):
    """Répartit uniformément posts_per_day créneaux entre 8h15 et 21h."""
    if posts_per_day <= 0:
        return []
    if posts_per_day >= len(DEFAULT_SLOTS):
        return DEFAULT_SLOTS[:posts_per_day]
    # Sous-échantillonnage régulier
    step = len(DEFAULT_SLOTS) / posts_per_day
    return [DEFAULT_SLOTS[int(i * step)] for i in range(posts_per_day)]


def main():
    parser = argparse.ArgumentParser(description="Meta Business Suite Bulk Composer CSV generator")
    parser.add_argument("--days", type=int, default=7, help="Nb de jours à scanner (défaut 7)")
    parser.add_argument("--since", help="Date début YYYY-MM-DD (override --days)")
    parser.add_argument("--start-date", help="Date de la 1re publication FB (défaut demain)")
    parser.add_argument("--posts-per-day", type=int, default=18, help="Nb de posts FB par jour (défaut 18)")
    parser.add_argument("--output", help="Chemin CSV output personnalisé")
    # Filtres de catégorie : les concours sont le contenu le plus partagé sur
    # Facebook (meilleur CTR du site), mais ils sont noyés dans la masse des
    # bons plans remontés. Ces deux options permettent de cibler.
    parser.add_argument(
        "--category",
        help="Ne garder que ces catégories, séparées par des virgules (ex: concours,test-gratuit)",
    )
    parser.add_argument(
        "--exclude-category",
        help="Exclure ces catégories, séparées par des virgules",
    )
    args = parser.parse_args()

    if args.since:
        cutoff = datetime.strptime(args.since, "%Y-%m-%d").date()
    else:
        cutoff = date.today() - timedelta(days=args.days)

    if args.start_date:
        publish_start = datetime.strptime(args.start_date, "%Y-%m-%d").date()
    else:
        publish_start = date.today() + timedelta(days=1)

    slots = build_slots(args.posts_per_day)
    if not slots:
        print("❌ posts-per-day doit être > 0", file=sys.stderr)
        sys.exit(1)

    articles = load_articles(cutoff)

    if args.category:
        keep = {c.strip() for c in args.category.split(",") if c.strip()}
        articles = [a for a in articles if a["category"] in keep]
    if args.exclude_category:
        drop = {c.strip() for c in args.exclude_category.split(",") if c.strip()}
        articles = [a for a in articles if a["category"] not in drop]

    if not articles:
        print(f"❌ Aucun article éligible depuis {cutoff.isoformat()}.", file=sys.stderr)
        sys.exit(1)

    # Tri par date (les plus récents à la fin → publiés en dernier sur FB)
    articles.sort(key=lambda a: a["date"])

    scheduled = []
    day_offset = 0
    slot_idx = 0
    for art in articles:
        pub_date = publish_start + timedelta(days=day_offset)
        pub_time = slots[slot_idx]
        scheduled.append((pub_date, pub_time, art))
        slot_idx += 1
        if slot_idx >= len(slots):
            slot_idx = 0
            day_offset += 1

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = Path(args.output) if args.output else OUTPUT_DIR / f"facebook-bulk-{date.today().isoformat()}.csv"

    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_ALL)
        writer.writerow(["Post Text", "Media URL", "Publish Date", "Publish Time", "Link"])
        for pub_date, pub_time, art in scheduled:
            writer.writerow([
                art["post_text"],
                art["media_url"],
                pub_date.isoformat(),
                pub_time,
                art["link"],
            ])

    print(f"✅ CSV généré : {output_path}")
    print(f"📊 {len(scheduled)} posts programmés sur {day_offset + 1} jour(s)")
    print(f"📅 1er post : {scheduled[0][0].isoformat()} à {scheduled[0][1]}")
    print(f"📅 Dernier   : {scheduled[-1][0].isoformat()} à {scheduled[-1][1]}")
    print()
    print("➡️  Étapes suivantes :")
    print("   1. Va sur https://business.facebook.com/latest/bulk_composer")
    print("   2. Sélectionne ta Page bonsplansmania")
    print("   3. Clique « Importer un fichier » et upload le CSV ci-dessus")
    print("   4. Vérifie l'aperçu → valide la planification")


if __name__ == "__main__":
    main()
