# Données du cockpit revenus

Le cockpit fonctionne immédiatement avec l’inventaire éditorial. Les exports
ci-dessous sont optionnels : quand ils sont présents, ils enrichissent le
rapport avec les clics et les commissions réellement observés.

## `ga4-affiliate-clicks.csv`

Export GA4 de l’événement `affiliate_click`, avec ces colonnes :

```csv
date,page_path,affiliate_slug,click_location,clicks
2026-07-27,/,amazon-exemple-produit,article_card,12
```

Dimensions GA4 à utiliser :

- Date
- Chemin de la page
- `affiliate_slug`
- `click_location`

Métrique : nombre d’événements.

## `affiliate-commissions.csv`

Synthèse des plateformes d’affiliation :

```csv
date,network,orders,sales_eur,commission_eur
2026-07-27,Amazon,3,149.90,5.40
2026-07-27,Awin,1,79.00,7.90
```

Ces commissions sont consolidées par réseau. Elles ne sont pas attribuées à un
article précis sans identifiant de suivi propre à la plateforme.
