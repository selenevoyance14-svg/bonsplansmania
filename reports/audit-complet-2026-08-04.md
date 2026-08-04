# Audit complet — Bons Plans Mania

**Date :** 4 août 2026  
**Périmètre :** code Next.js, catalogue MDX, build statique, sitemap, robots, redirections, métadonnées, contenu, affiliation, publicité et confiance.  
**Limites :** aucun accès Search Console, GA4, AdSense, plateformes d'affiliation, CrUX ni outil de backlinks. Les conclusions de trafic, d'indexation réelle, de revenus, de Core Web Vitals et d'autorité externe doivent être complétées avec ces exports.

> **Rectification du 4 août 2026 :** une première version de ce rapport s'appuyait aussi sur une copie publique mise en cache depuis six jours. Elle affichait encore « 4 600+ articles vérifiés » et « 50+ marques partenaires », deux mentions déjà retirées du code actuel. Ces observations obsolètes ont été supprimées du rapport et ne doivent pas être considérées comme des problèmes actuels.

## Verdict exécutif

Bons Plans Mania est techniquement déployable et mieux structuré que lors du précédent audit : le build génère correctement 5 220 pages, les pages `/marque/` ont été ramenées d'environ 2 191 à 141 dans le sitemap, les doublons éditoriaux détectables sont nuls et les métadonnées fondamentales sont présentes.

Le principal risque n'est plus un défaut technique bloquant. C'est la qualité moyenne et la durée de vie d'un catalogue devenu trop grand par rapport à sa capacité de maintenance : 4 734 à 4 767 articles selon les deux scripts internes, 933 articles expirés, 2 542 contenus expirables anciens sans `endDate`, 1 616 pages commerciales anciennes sans protection et 435 concours/tests anciens sans date de fin. Le site continue ainsi à produire et servir beaucoup d'URL dont la fraîcheur, l'utilité et le potentiel de revenu sont difficiles à garantir.

La deuxième faiblesse critique reste le pilotage économique. 3 749 articles affiliés actifs sont détectés, dont 2 322 via Amazon (62 %). Le tracking `/go/` classe encore le réseau comme `redirect` et la destination comme `bonsplansmania.fr`, ce qui empêche une attribution marchande propre au niveau du clic. Sans données GA4 et commissions rapprochées par slug, le site ne peut pas arbitrer correctement entre bons plans, comparatifs, tests, concours, AdSense et affiliation.

## Scorecard

| Axe | Note | Diagnostic |
|---|---:|---|
| Build et stabilité | 8/10 | Build production réussi sur 5 220 pages ; lint en échec sur un composant client |
| Crawlabilité | 8/10 | Robots et sitemap présents ; empreinte sitemap réduite à 3 990 URL |
| Indexation | 6/10 | 4 URL `noindex` encore dans le sitemap ; forte dette d'expiration |
| On-page | 8/10 | Aucun title/meta manquant ; quelques longueurs et pages faibles à corriger |
| Données structurées | 7/10 | JSON-LD présent dans le code ; Product doit rester réservé aux vrais mono-produits |
| Contenu | 4/10 | Catalogue massif, dette de fraîcheur et nombreuses pages commerciales anciennes |
| E-E-A-T | 6/10 | Identité et transparence présentes ; preuves d'usage réel encore insuffisantes |
| Performance | 5/10 | Export statique favorable, mais 1,2 Go d'images non optimisées et JS/pub globaux |
| Monétisation | 5/10 | Diversification partielle ; dépendance Amazon et attribution insuffisante |
| Pilotage data | 2/10 | Scripts de contrôle utiles, mais pas de données business réconciliées fournies |

## Constats prioritaires

### P0 — Traiter l'obsolescence à l'échelle du catalogue

**Preuves**

- 933 articles expirés dans l'audit revenus ;
- 2 542 contenus expirables anciens sans `endDate` ;
- 1 616 pages commerciales anciennes sans protection ;
- 435 concours/tests anciens sans `endDate` ;
- seulement quelques centaines de pages sont exclues de l'index alors que la dette potentielle est bien plus large.

**Impact**

Mauvaise expérience, gaspillage de crawl, signaux de fraîcheur faibles, offres invalides, baisse de confiance et risque de pages sans valeur résiduelle.

**Action**

1. Rendre `endDate` obligatoire pour tout bon plan, concours et test temporaire.
2. Calculer automatiquement le statut : actif, à vérifier, expiré evergreen, expiré à fusionner, expiré à supprimer.
3. Appliquer la politique suivante : mise à jour pour les pages evergreen ; 301 pour les doublons ; `noindex, follow` pour les offres finies sans valeur ; 410 après délai pour les pages sans trafic, liens ni équivalent.
4. Sortir automatiquement du sitemap toute page expirée ou `noindex`.
5. Prioriser les 1 616 pages commerciales anciennes par impressions GSC, clics affiliés et commissions.

**Critère de sortie :** moins de 2 % de contenus expirables sans `endDate` et zéro offre expirée présentée comme active.

### P0 — Rendre le revenu attribuable par page et marchand

**Preuves**

- 3 749 articles affiliés actifs ;
- 2 322 destinations Amazon, soit environ 62 % ;
- les clics `/go/` sont envoyés avec `affiliate_network: redirect` et `destination_hostname: bonsplansmania.fr` ;
- aucune donnée GA4/commission exploitable n'a été fournie pour cet audit.

**Impact**

Impossible de calculer EPC, RPM, marge par catégorie, perte causée par AdSense ou rentabilité d'une mise à jour.

**Action**

1. Exposer sur chaque lien `/go/` le marchand et le réseau via attributs `data-*` générés depuis le mapping serveur.
2. Ajouter `source_slug`, `merchant`, `network`, `click_location`, `offer_id` et un sous-identifiant réseau.
3. Importer chaque semaine clics, sessions, commandes, commissions et revenus AdSense.
4. Produire un tableau par slug : sessions, CTR affilié, EPC, RPM affiliation, RPM pub, revenu total et date de dernière vérification.
5. Arrêter ou consolider les formats dont le coût éditorial dépasse le revenu attendu.

**Critère de sortie :** 95 % des clics attribués à un slug/marchand et 80 % des commissions rapprochées d'un marchand sous 30 jours.

### P0 — Réduire la production de pages faibles et renforcer les actifs evergreen

**Preuves**

- 4 734 articles publiés dans l'audit contenu ;
- 4 767 lignes analysées dans l'audit revenus ;
- 198 destinations utilisées plusieurs fois ;
- 50 formulations de test à justifier, mais un seul test personnel explicitement documenté ;

**Impact**

Dilution de l'autorité, cannibalisation, promesse éditoriale difficile à tenir, faible différenciation face aux marchands et comparateurs.

**Action**

- suspendre les bons plans unitaires sans demande, marge, durée de vie ou apport original ;
- concentrer 70 % de l'effort sur comparatifs, avis de première main, pages marque et hubs evergreen ;
- imposer une preuve unique : photo originale, relevé de prix daté, protocole, tableau comparatif, limite, alternative ou source primaire ;
- distinguer visiblement `testé`, `analysé`, `repéré`, `sponsorisé` et `partenaire` ;

## SEO technique

### Points solides

- build Next.js 16 réussi ;
- export statique et 5 220 pages générées ;
- HTTPS et domaine canonique cohérents dans le code ;
- robots.txt et sitemap déclarés ;
- 3 990 URL seulement dans le sitemap contre plus de 6 000 précédemment ;
- 3 815 articles indexables dans le sitemap ;
- 141 pages marque au lieu de plus de 2 000 ;
- 11 catégories et les hubs principaux sont inclus ;
- aucun title, aucune meta description manquants dans les 5 218 HTML analysés.

### Anomalies à corriger

1. **Quatre URL `noindex` sont encore dans le sitemap :** `/recherche`, `/mentions-legales`, `/confidentialite`, `/politique-de-confidentialite`. Les retirer.
2. **La taxonomie `/marque/` n'est pas entièrement propre :** le build génère encore `/marque/soin-visage`, `/marque/anti-age` et `/marque/bio`, qui sont des thèmes/attributs et non des marques. Passer à une whitelist stricte.
3. **229 pages construites sont `noindex`.** C'est acceptable pour pagination et utilitaires, mais il faut contrôler qu'elles ne reçoivent pas trop de liens internes et qu'aucune page business n'est exclue par erreur.
4. **Le build supprime 42 138 payloads RSC `.txt`.** Le contournement réduit le nombre de fichiers Cloudflare mais doit faire l'objet d'un test de navigation client à chaque mise à jour Next.js.
5. **Le lint échoue** dans `ProductFavoriteButton.tsx` à cause d'un `setState` synchrone dans un effet. Ce n'est pas un blocage de build, mais c'est une dette de qualité/performance à corriger.

## On-page et SERP

Sur 5 218 pages HTML :

- 0 title manquant ;
- 0 meta description manquante ;
- 19 titles de plus de 60 caractères ;
- 192 titles de moins de 30 caractères ;
- 359 descriptions de plus de 160 caractères ;
- 1 285 descriptions de moins de 120 caractères.

Ces seuils ne sont pas des règles absolues, mais les pages business concernées doivent être revues selon leurs impressions et CTR GSC. Priorité aux pages code promo, hubs et produits ayant déjà des impressions. Les pages courtes peuvent être correctes si la proposition de valeur est claire ; les descriptions longues seront souvent réécrites ou tronquées par Google.

Actions rapides :

- exporter les requêtes/pages avec impressions élevées et CTR faible ;
- réécrire title + description par intention, pas en masse selon une longueur seule ;
- ajouter la date de vérification et l'état de l'offre dans le contenu visible ;
- maintenir un H1 unique, un fil d'Ariane et des liens contextuels stables vers les hubs.

## Contenu, maillage et E-E-A-T

### Forces

- aucun groupe de titres identiques ;
- aucun groupe de titles SEO identiques ;
- aucune description identique ;
- aucun groupe de corps quasi identiques détecté ;
- aucune remise arithmétiquement incohérente ;
- pages auteure, mentions légales, contact et déclaration d'affiliation présentes ;
- 759 concours/tests bénéficient d'une passerelle contextuelle automatique.

### Faiblesses

- les passerelles automatiques ne remplacent pas le maillage éditorial contextuel ;
- 198 destinations répétées indiquent des grappes à consolider ;
- une seule expérience de réception/test est explicitement documentée ;
- 50 formulations de test doivent être justifiées ;
- le volume rend irréaliste une vérification manuelle quotidienne de toutes les offres.

Créer 20 à 30 clusters prioritaires. Chaque cluster doit avoir un hub evergreen, des articles satellites réellement distincts, des liens contextuels bidirectionnels et un propriétaire de mise à jour. Les contenus YMYL ou réglementaires doivent citer des sources primaires et afficher une date de révision.

## Performance et UX

### Mesures locales

- `public/images` pèse environ 1,2 Go ;
- 205 images dépassent 500 Ko ;
- 151 dépassent 1 Mo ;
- 59 dépassent 2 Mo ;
- les images Next sont configurées avec `unoptimized: true` ;
- AdSense, tracking, popup/newsletter et fonctions client sont chargés globalement ou largement.

### Risques

Poids mobile, LCP, consommation de données, CLS publicitaire, INP et baisse des clics affiliés sur les contenus courts. Les grandes images Pinterest ne sont pas nécessairement chargées sur les pages, mais elles alourdissent le déploiement et doivent être séparées ou compressées.

### Actions

1. Générer WebP/AVIF et variantes 480/768/1200 px pour les images éditoriales visibles.
2. Compresser ou externaliser les visuels Pinterest ; fixer un budget de 250 Ko par image web courante.
3. Précharger uniquement l'image LCP réelle.
4. Réserver l'espace des publicités et réduire les slots sur les articles courts.
5. Charger popup, sticky ad et composants non essentiels après interaction/scroll.
6. Mesurer CrUX/Lighthouse sur home, catégorie, article commercial, comparatif et page produit.

## Données structurées

Le code contient WebSite, Article, BreadcrumbList et Product. Le précédent contrôle rendu avait confirmé leur présence. La règle importante reste de ne pas générer Product pour une box, un lot, un bon d'achat ou une page multi-offres. Le prix et la disponibilité doivent venir de champs structurés et vérifiés, pas d'une extraction opportuniste du texte.

Valider après chaque changement un échantillon dans le Rich Results Test : home, article éditorial, mono-produit, comparatif, code promo, catégorie et page marque.

## Monétisation et conversion

Le site a trois leviers : affiliation, publicité et partenariats. L'affiliation est trop concentrée sur Amazon et la densité publicitaire peut concurrencer les clics à forte valeur.

Actions :

- tester une version avec moins de publicité sur les pages transactionnelles ;
- comparer revenu total/session et non revenu AdSense seul ;
- privilégier les partenaires directs et réseaux à meilleur EPC ;
- créer des tableaux de choix et CTA différenciés par intention ;
- afficher clairement validité, conditions, prix vérifié, marchand et nature affiliée ;
- construire une liste email segmentée par univers, avec consentement et valeur récurrente.

## Plan d'action

### Jours 1 à 7

1. Retirer les 4 URL `noindex` du sitemap.
2. Corriger le lint React.
3. Whitelister les vraies marques et exclure `soin-visage`, `anti-age`, `bio`, dates et attributs.
4. Rendre `endDate` obligatoire dans le pipeline de publication.
5. Corriger l'attribution des clics `/go/`.
6. Exporter GSC 16 mois, GA4 90 jours, AdSense et commissions 12 mois.

### Jours 8 à 30

1. Trier les 1 616 pages commerciales anciennes selon trafic, revenu et liens.
2. Mettre à jour/fusionner/noindexer les 500 premières.
3. Optimiser les images réellement chargées sur les 100 pages les plus vues.
4. Revoir les titles/descriptions des pages à forte impression et faible CTR.
5. Lancer un test de densité publicitaire par type de page.
6. Publier 4 tests réels et 4 comparatifs structurants avec preuves originales.

### Jours 31 à 90

1. Ramener la dette sans `endDate` sous 2 %.
2. Consolider toutes les grappes partageant une destination et une intention.
3. Construire 20 à 30 clusters evergreen.
4. Produire un cockpit hebdomadaire revenu/SEO par slug.
5. Diversifier le revenu hors Amazon.
6. Obtenir des liens éditoriaux vers les meilleurs actifs plutôt que vers des offres éphémères.

## KPI de pilotage

- taux d'URL sitemap indexées ;
- pages exclues par motif GSC ;
- clics organiques non-brand et CTR par page ;
- nombre de pages expirables sans `endDate` ;
- offres expirées présentées comme actives ;
- part des pages mises à jour/fusionnées/noindexées ;
- CTR affilié, EPC et RPM total par slug ;
- part Amazon dans le revenu, pas seulement dans les liens ;
- LCP, INP, CLS et poids médian des pages ;
- revenu/session par type de page ;
- nombre de contenus avec preuve originale et backlinks éditoriaux.

## Conclusion

La prochaine croissance ne viendra pas de davantage d'URL. Elle viendra de la réduction de la dette d'expiration, de l'attribution économique par page, d'une taxonomie stricte et d'un portefeuille plus petit d'actifs evergreen réellement utiles. Le socle technique est assez bon pour exécuter cette stratégie sans refonte complète.
