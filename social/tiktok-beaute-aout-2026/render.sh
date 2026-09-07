#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$ROOT/assets"
OUT="$ROOT/output"
FRAMES="$OUT/cards"
mkdir -p "$FRAMES"

FONT="/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
TEAL="#087f82"
INK="#17151c"

brand_bar() {
  magick -size 940x92 xc:"$TEAL" \
    -fill white -font "$FONT_BOLD" -pointsize 31 -gravity center \
    -annotate +0+0 "BONS PLANS MANIA  •  bonsplansmania.fr" \
    -alpha set -channel A -evaluate set 96% +channel "$1"
}

brand_bar "$FRAMES/brand.png"

magick -size 1080x1920 gradient:'#fff5fa-#e9fbfa' \
  -fill '#ffdce8' -draw 'circle 920,300 1100,300' \
  -fill '#d7f6f1' -draw 'circle 130,1530 340,1530' \
  "$FRAMES/brand.png" -geometry +70+72 -composite \
  -fill "$INK" -font "$FONT_BOLD" -pointsize 104 -gravity center \
  -annotate +0-120 "5 BONS PLANS\nBEAUTÉ 🔥" \
  -fill '#ff4f78' -draw 'roundrectangle 240,1080 840,1190 55,55' \
  -fill white -pointsize 43 -annotate +0+175 "À NE PAS RATER" \
  "$FRAMES/00-hook.png"

make_card() {
  local file="$1" brand="$2" name="$3" price="$4" old="$5" discount="$6" accent="$7" output="$8"
  magick "$ASSETS/$file" -resize '892x932>' -background white -gravity center -extent 892x932 "$FRAMES/product.png"
  magick -size 1080x1920 gradient:'#fff8fb-#eafaf9' \
    -fill "${accent}22" -draw 'circle 980,350 1210,350' \
    -fill "${accent}18" -draw 'circle 80,1500 290,1500' \
    "$FRAMES/brand.png" -geometry +70+72 -composite \
    -fill white -stroke '#e8e8ec' -strokewidth 2 -draw 'roundrectangle 70,285 1010,1265 52,52' \
    "$FRAMES/product.png" -geometry +94+309 -composite \
    -fill "$accent" -stroke none -draw 'roundrectangle 720,230 1010,352 61,61' \
    -fill white -font "$FONT_BOLD" -pointsize 57 -gravity northwest -annotate +770+260 "$discount" \
    -fill "$accent" -pointsize 68 -gravity center -annotate +0+440 "$brand" \
    -fill "$INK" -pointsize 43 -annotate +0+545 "$name" \
    -pointsize 96 -annotate +0+665 "$price" \
    -fill '#66636c' -font "$FONT" -pointsize 37 -annotate +0+755 "au lieu de $old" \
    -fill '#211f25' -draw 'roundrectangle 180,1780 900,1856 38,38' \
    -fill white -font "$FONT_BOLD" -pointsize 27 -annotate +0+862 "PRIX RELEVÉ • PEUT ÉVOLUER" \
    "$FRAMES/$output"
}

make_card 'baija.webp' 'BAÏJA' 'TRIO MOUSSES DE DOUCHE' '34,83 €' '38,70 €' '-10%' '#ff607f' '01-baija.png'
make_card 'dyson.png' 'DYSON' 'SUPERSONIC BLEU / CUIVRE' '349 €' '429 €' '-19%' '#268fe9' '02-dyson.png'
make_card 'foreo.png' 'FOREO' 'BEAR MINI PEARL PINK' '119 €' '151,90 €' '-22%' '#ef5ba2' '03-foreo.png'
make_card 'revlon.png' 'REVLON' 'ONE-STEP VOLUMISER' '69,97 €' '79,99 €' '-13%' '#8e4ed3' '04-revlon.png'
make_card 'clinique.png' 'CLINIQUE' 'ALMOST LIPSTICK BLACK HONEY' '17,99 €' '19,91 €' '-10%' '#8d1534' '05-clinique.png'

magick -size 1080x1920 gradient:'#fff6fa-#e5faf8' \
  -fill "$INK" -font "$FONT_BOLD" -pointsize 86 -gravity center \
  -annotate +0-390 "RETROUVE\nTOUTES LES OFFRES" \
  -fill "$TEAL" -draw 'roundrectangle 90,900 990,1090 55,55' \
  -fill white -pointsize 68 -annotate +0+30 "bonsplansmania.fr" \
  -fill '#333139' -pointsize 43 -annotate +0+310 "Suis le compte pour ne rien rater ✨" \
  -fill '#6a6870' -font "$FONT" -pointsize 27 -annotate +0+760 "Prix et disponibilités à vérifier avant achat." \
  "$FRAMES/06-outro.png"

ffmpeg -y \
  -i "$FRAMES/00-hook.png" \
  -i "$FRAMES/01-baija.png" \
  -i "$FRAMES/02-dyson.png" \
  -i "$FRAMES/03-foreo.png" \
  -i "$FRAMES/04-revlon.png" \
  -i "$FRAMES/05-clinique.png" \
  -i "$FRAMES/06-outro.png" \
  -i "$OUT/voix.aiff" \
  -filter_complex "\
    [0:v]scale=1080:1920,zoompan=z='min(zoom+0.0012,1.08)':d=60:s=1080x1920:fps=30[v0];\
    [1:v]scale=1080:1920,zoompan=z='min(zoom+0.00035,1.06)':d=150:s=1080x1920:fps=30[v1];\
    [2:v]scale=1080:1920,zoompan=z='min(zoom+0.00035,1.06)':d=150:s=1080x1920:fps=30[v2];\
    [3:v]scale=1080:1920,zoompan=z='min(zoom+0.00035,1.06)':d=150:s=1080x1920:fps=30[v3];\
    [4:v]scale=1080:1920,zoompan=z='min(zoom+0.00035,1.06)':d=150:s=1080x1920:fps=30[v4];\
    [5:v]scale=1080:1920,zoompan=z='min(zoom+0.00035,1.06)':d=150:s=1080x1920:fps=30[v5];\
    [6:v]scale=1080:1920,zoompan=z='min(zoom+0.0007,1.07)':d=90:s=1080x1920:fps=30[v6];\
    [v0][v1][v2][v3][v4][v5][v6]concat=n=7:v=1:a=0,format=yuv420p[v]" \
  -map '[v]' -map 7:a:0 -c:v libx264 -preset medium -crf 20 -profile:v high \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest \
  "$OUT/tiktok-bons-plans-beaute.mp4"

ffmpeg -y -ss 00:00:09 -i "$OUT/tiktok-bons-plans-beaute.mp4" -frames:v 1 -update 1 "$OUT/apercu.png"
echo "$OUT/tiktok-bons-plans-beaute.mp4"
