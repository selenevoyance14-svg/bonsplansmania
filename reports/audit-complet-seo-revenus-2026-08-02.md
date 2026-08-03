# Audit complet SEO & revenus — Bons Plans Mania

**Date :** 2 août 2026
**Périmètre :** dépôt local `bonsplansmania`, site public `https://bonsplansmania.fr`, catalogue MDX, sitemap/robots/en-têtes HTTP, rendu navigateur de la page d'accueil et d'un article commercial.
**Objectif :** comprendre pourquoi le site ne rapporte pas davantage et fournir un plan d'action SEO + monétisation priorisé.

## 1. Verdict exécutif

Bons Plans Mania ne souffre pas d'un unique « bug SEO ». Le site possède de bonnes bases techniques et un actif éditorial réel, mais son rendement est freiné par un problème de modèle : **la production et l'indexation ont grandi beaucoup plus vite que la qualité moyenne, l'autorité, la consolidation et la mesure des revenus**.

Le catalogue compte **4 733 articles**, mais le sitemap public expose **6 207 URL**, dont **2 191 pages `/marque/`**. Une grande partie de ces pages sont créées automatiquement à partir de simples tags, y compris des tags qui ne sont pas des marques (`2026`, `juillet-2026`, `bon-plan`, `sans-engagement`, etc.). Le site demande donc à Google de crawler et d'évaluer des milliers de pages secondaires faibles, alors que son autorité devrait être concentrée sur quelques centaines de pages stratégiques.

En parallèle :

- **2 934 articles sur 4 733 (62 %) sont des bons plans**, un format très périssable et souvent peu différencié ;
- **2 414 articles (51 %) font moins de 500 mots** et **1 108 (23 %) moins de 300 mots** ;
- **2 317 destinations actives passent par Amazon**, soit environ 59 % des articles affiliés actifs, avec des commissions généralement modestes et une forte dépendance à un seul marchand ;
- **735 articles sont considérés expirés par la logique du site**, mais les pages expirées ne reçoivent pas automatiquement de `noindex` ;
- **2 175 articles ne reçoivent aucun lien contextuel depuis le corps d'un autre article** ;
- **202 destinations affiliées sont partagées entre plusieurs articles**, ce qui signale des grappes potentiellement cannibalisées ;
- le tracking de clic existe dans le code, mais les fichiers de pilotage contiennent **0 ligne GA4 et 0 ligne de commissions** : aucune décision fiable de production, de mise à jour ou de suppression ne peut être prise selon le revenu réel.

### Diagnostic business en une phrase

Le site produit beaucoup de trafic potentiel à faible durée de vie et faible intention d'achat, le disperse sur trop d'URL, puis ne mesure pas correctement quelles pages et quels marchands transforment ce trafic en argent.

## 2. Scorecard

| Axe | Note | Diagnostic |
|---|---:|---|
| Crawlabilité | 7/10 | Robots et sitemap accessibles, mais sitemap beaucoup trop large et contradictoire |
| Indexation | 4/10 | Inflation des pages marque, expirés encore indexables, recherche noindex présente dans le sitemap |
| Technique | 6/10 | SSG et Cloudflare solides, mais cache dynamique, images non optimisées et poids JS/pub à mesurer |
| On-page | 8/10 | Titles, descriptions, H1, canonicals et données structurées globalement bien gérés |
| Contenu | 4/10 | Volume impressionnant, mais trop de contenu mince, périssable et peu différencié |
| E-E-A-T / confiance | 5/10 | Page auteure et mentions légales présentes, mais preuves de test insuffisantes et promesses trop larges |
| Maillage interne | 5/10 | Navigation riche, mais faible maillage éditorial contextuel et nombreuses grappes isolées |
| Autorité externe | Non noté | Aucun export backlinks fourni ; à mesurer avec GSC/Ahrefs/Semrush |
| Monétisation | 4/10 | AdSense + affiliation bien intégrés, mais mix peu rentable et attribution inexistante |
| Pilotage data | 1/10 | Événements codés, mais aucune donnée importée dans le cockpit |

## 3. Ce qui est déjà bon

Il ne faut pas refaire le site de zéro. Plusieurs fondations sont correctes :

- HTTPS, HTTP/2, Cloudflare et rendu statique ;
- `robots.txt` ouvert et sitemap déclaré ;
- canonicals auto-référents sur les articles et catégories ;
- une seule balise H1 sur les pages contrôlées ;
- titles maintenant maîtrisés : seulement **47 titles au-dessus de 60 caractères**, aucun au-dessus de 65 dans l'audit actuel ;
- meta descriptions présentes sur toutes les pages sauf 23 `seoDescription` spécifiques manquantes (fallback disponible) ;
- images de l'échantillon avec attributs `alt` ;
- liens affiliés en `nofollow sponsored noopener` ;
- page `/recherche` en `noindex, follow` ;
- données structurées `Article`, `Product` et `BreadcrumbList` présentes dans le DOM rendu ;
- suppression des fausses notes agrégées du schéma Product ;
- pages expirées retirées du sitemap ;
- bandeaux d'obsolescence visibles et passage `OutOfStock` pour les offres périmées ;
- page auteure, SIRET, contact, mentions légales et déclaration d'affiliation présents.

Ces corrections sont réelles. L'ancien rapport du 29 juillet qui évoquait 2 177 titles trop longs et une fausse note Product n'est plus à jour sur ces points.

## 4. Problèmes critiques P0

### P0.1 — Aucun pilotage revenu exploitable

**Preuve**

- `data/revenue/ga4-affiliate-clicks.csv` : uniquement l'en-tête ;
- `data/revenue/affiliate-commissions.csv` : uniquement l'en-tête ;
- cockpit : `ga4Rows: 0`, `commissionRows: 0`, `affiliateClicks: 0`, `commissionEur: 0` ;
- le code déclenche bien `affiliate_click`, mais la destination réelle reste classée comme `redirect` / `bonsplansmania.fr` pour les liens `/go/`.

**Impact**

Impossible de connaître :

- l'EPC (revenu par clic) par réseau et marchand ;
- le RPM par page ou catégorie ;
- les pages qui ont du trafic mais ne convertissent pas ;
- les pages qui convertissent et méritent une mise à jour ;
- si 10 nouveaux bons plans Amazon rapportent davantage qu'un seul comparatif ou test réel.

**Correction**

1. Export GA4 automatique hebdomadaire des événements `affiliate_click` avec `source_slug`, `click_location` et marchand réel.
2. Ajouter le réseau et le marchand au mapping serveur `/go/`, puis les exposer dans des attributs `data-*` sur le bouton sans exposer l'URL d'affiliation.
3. Importer chaque semaine les commissions Amazon, Awin, Affilae, Effiliation, TimeOne, YesStyle, etc.
4. Calculer par page : sessions, clics, CTR affilié, commandes, commission, EPC, RPM affiliation, RPM AdSense.
5. Ajouter un identifiant de sous-campagne par article quand le réseau le permet (`subid`, `clickref`, tracking ID Amazon dédié).

**KPI de sortie P0 :** 95 % des clics affiliés attribués à un slug et 80 % des commissions attribuées au moins à un marchand/réseau sous 30 jours.

### P0.2 — Explosion de pages `/marque/` faibles

**Preuve**

- **2 191 pages marque dans le sitemap public** ;
- seuil de génération : seulement 3 articles partageant un tag ;
- **11 189 slugs de tags uniques** dans le catalogue ;
- 2 210 tags franchissent le seuil local de 3 utilisations ;
- top tags générateurs : `2026` (1 938), `amazon` (1 857), `bon-plan` (1 238), `juillet-2026` (580), `juin-2026` (557), `concours` (518), `mai-2026` (503), `ete-2026` (422).

**Impact**

- dilution du crawl et des liens internes ;
- pages minces ou quasi-dupliquées ;
- confusion sémantique : une route appelée `/marque/` sert aussi pour des années, intentions, formats et attributs ;
- risque de cannibalisation avec les catégories et hubs ;
- Google reçoit un signal « quantité avant qualité ».

**Correction**

- remplacer le seuil automatique par une **whitelist de vraies marques** ;
- n'indexer une page marque que si elle remplit tous les critères : au moins 8 à 10 articles actifs, introduction unique, offre/code actif, FAQ ou conseils propres, maillage vers catégories et comparatifs ;
- mettre `noindex, follow` sur toutes les autres pages de tags ;
- retirer immédiatement du sitemap les tags temporels, génériques et intentionnels ;
- créer des routes distinctes si nécessaire : marques, thèmes, saisons. Ne pas tout mélanger dans `/marque/`.

**Cible :** passer de 2 191 pages marque à **100–250 pages réellement travaillées**.

### P0.3 — Contenu expiré encore indexable

**Preuve**

- 360 frontmatters `expired: true` ;
- seulement 5 articles avec `noindex: true` ;
- 358 pages explicitement expirées restent donc indexables ;
- la logique `isEffectivelyExpired` dénombre 735 pages expirées (date de fin comprise) ;
- `generateMetadata` applique `noindex` uniquement si `article.meta.noindex`, pas si l'article est effectivement expiré.

**Impact**

Le retrait du sitemap réduit la priorité de crawl, mais ne désindexe pas une URL déjà connue. Google peut continuer à indexer et classer une offre terminée, créer une mauvaise expérience et diluer les signaux du site.

**Correction selon le type d'URL**

- offre définitivement terminée sans équivalent : `noindex, follow`, puis 410 après 60–90 jours si elle n'a ni liens ni trafic ;
- offre récurrente/marque forte : conserver une URL evergreen, remplacer l'offre et mettre à jour le contenu ;
- doublon d'une offre plus récente : fusion + 301 vers la page active ;
- concours/test fini mais ayant une valeur documentaire : conserver indexable uniquement si la page répond encore à une intention utile (résultats, fonctionnement, édition suivante).

### P0.4 — Risque de contenu à grande échelle peu différencié

**Preuve**

- 4 733 articles, dont 2 934 bons plans ;
- 2 414 contenus sous 500 mots ;
- 1 108 sous 300 mots ;
- cadence déclarée de 5 à 15 publications par jour ;
- 1 594 pages commerciales anciennes sans protection suffisante dans l'audit d'intégrité ;
- 250 concours/tests anciens sans protection ;
- nombreuses formulations et structures répétitives autour du prix, des caractéristiques marchandes et de « notre avis ».

**Impact**

Google ne pénalise pas l'IA en soi, mais ses règles visent les nombreuses pages non originales créées surtout pour capter des requêtes. Le risque ici n'est pas le nombre absolu, mais le ratio élevé de pages à faible valeur unique par rapport à l'autorité et aux preuves originales du site.

**Correction**

- arrêter pendant 30 jours la création massive de bons plans unitaires à faible marge ;
- instaurer un score de publication : demande SEO, commission, différenciation, preuve, durée de vie, concurrence ;
- fusionner les variantes d'un même produit/marchand dans des hubs evergreen ;
- imposer un apport unique : historique de prix, photo/capture datée, test réel, comparaison, conditions vérifiées, alternative, erreur à éviter ;
- ne pas indexer une page qui n'ajoute pas une réponse clairement meilleure que la fiche marchand.

## 5. Problèmes SEO importants P1

### P1.1 — Sitemap contradictoire et dates artificielles

- `/recherche` est `noindex` mais figure dans le sitemap ;
- toutes les pages statiques et marque reçoivent `lastModified: now` à chaque build, même sans modification éditoriale ;
- `priority` et `changeFrequency` n'apportent pas de bénéfice mesurable à Google ;
- trois hubs saisonniers anciens sont toujours présents (`ete-2026`, `fete-des-peres-2026`, `noel-2026`) sans stratégie de cycle explicitée.

**Fix :** sitemap uniquement canonicals indexables et utiles ; vrais `lastmod` ; séparation en sitemap articles, marques, catégories pour lire les taux d'indexation dans Search Console.

### P1.2 — Maillage contextuel insuffisant

Le site a une navigation riche, des cartes et des articles connexes automatiques. Mais l'analyse des liens présents dans les corps MDX trouve :

- 11 176 liens contextuels vers des articles ;
- **2 175 articles sans aucun backlink éditorial depuis le corps d'un autre article**.

Les cartes automatiques évitent l'orphelin technique, mais transmettent moins de contexte et changent avec le temps. Les pages business doivent recevoir des liens éditoriaux stables depuis des contenus proches.

**Fix :** créer 20–30 clusters ; chaque article satellite pointe vers un hub, et chaque hub vers 5–10 pages transactionnelles ; ancres descriptives ; contrôle automatique des pages sans backlink contextuel.

### P1.3 — Cannibalisation par destination et sujet

**202 destinations sont partagées**. Exemples :

- ConsoBaby : 30 articles ;
- Mamadvisor : 28 ;
- même lien Awin : 22 ;
- Kiabi communauté : 18 ;
- box beauté `fnty.co` : 17 ;
- ACM ambassadeurs : 17 ;
- YesStyle : 16 ;
- Free Cosmetic Testing : 14.

Partager une destination n'est pas automatiquement mauvais, mais ces grappes doivent être auditées pour détecter des pages répondant à la même requête.

**Fix :** par grappe, conserver une page evergreen principale, intégrer les nouveautés dans cette page, rediriger les variantes faibles, garder une nouvelle URL seulement si l'intention est réellement distincte.

### P1.4 — Taxonomie trop riche et instable

4 134 occurrences de tags temporels ont été détectées. La taxonomie mélange marque, année, mois, type d'offre, bénéfice, public et univers. Cela rend le maillage imprévisible et génère des pages inutiles.

**Fix :** schéma fermé : `brand`, `universe`, `audience`, `format`, `season` ; le champ `tags` libre ne doit jamais générer automatiquement une page indexable.

### P1.5 — E-E-A-T et preuves de test insuffisantes

Points positifs : page auteure détaillée, 15 ans d'expérience déclarée, mentions légales et SIRET.

Points faibles :

- aucun lien auteure visible sur l'article commercial contrôlé, même si l'auteure existe en JSON-LD ;
- l'audit trouve 58 formulations de test à justifier, mais un seul test personnel avec réception explicitement documentée ;
- les catégories affirment « tests basés sur l'utilisation réelle », « on teste et on tranche », « chaque promo testée », ce qui dépasse les preuves disponibles ;
- la page d'accueil affiche un nombre de « marques partenaires » calculé depuis une liste de marques/code promo, pas depuis de vrais contrats partenaires ;
- la page auteure dit lancement en 2024 alors que d'autres supports parlent d'articles depuis 2020 : incohérence à clarifier.

**Fix :** signature visible, bio courte, méthodologie, preuves datées, photos originales, distinction stricte entre « testé », « analysé », « repéré » et « sponsorisé » ; remplacer « marques partenaires » par « marques suivies » sauf contrat réel.

### P1.6 — Pages avis/comparatifs pas assez solides pour l'intention commerciale

Le catalogue ne contient que 82 `test-avis` (1,7 %) et 236 comparatifs (5 %), contre 62 % de bons plans. Or les requêtes « avis », « meilleur », « comparatif » et « X vs Y » sont plus proches de l'achat et ont une durée de vie supérieure.

Les textes de catégorie parlent de critères objectifs et de tests, mais plusieurs contenus reposent surtout sur prix, fiches marchandes et avis tiers. Pour performer durablement, il faut apporter une expérience de première main et expliquer comment le choix a été fait.

**Fix :** 2 tests réels + 2 comparatifs de haute qualité par semaine, chacun avec protocole, photos, mesures, limites, alternatives et date de contrôle.

## 6. Technique et performance

### Constats vérifiés

- page d'accueil : 41 images, 36 lazy-loadées, aucune image sans alt dans l'échantillon ;
- article contrôlé : 5 images, aucune sans alt ;
- 5 emplacements AdSense sur la home, 7 sur l'article contrôlé ;
- `cache-control: public, max-age=300, must-revalidate` ;
- `cf-cache-status: DYNAMIC` sur la home ;
- `images.unoptimized: true` : Next ne redimensionne ni ne convertit les images ;
- 5 images et le script GA sont préchargés sur la home ;
- HSTS et CSP absentes ;
- rendu mobile responsive présent dans le code, mais CWV terrain non disponibles.

### Risques

- trop de préchargements d'images peuvent concurrencer la vraie image LCP ;
- images originales non optimisées = poids réseau élevé sur mobile ;
- 7 blocs publicitaires sur un article court peuvent dégrader la lisibilité, la viewability, le CLS et l'INP ;
- cache Cloudflare dynamique = TTFB et coûts inutiles pour un site statique ;
- composants client globaux (popup newsletter, tracking, retour en haut, ads) ajoutent du JS sur chaque page.

### Limite de l'audit

Le test officiel PageSpeed a renvoyé une limite de quota HTTP 429 le 2 août. Aucun score Lighthouse ne doit donc être inventé. Il faut exporter PageSpeed et surtout les données terrain CrUX/Search Console pour la home, une catégorie, un article Amazon, un comparatif et un test.

### Actions

1. Activer cache CDN `s-maxage=3600` ou cache immuable pour les assets et purge au déploiement.
2. Convertir les héros en WebP/AVIF et produire des variantes 480/768/1200 px.
3. Précharger uniquement l'image LCP effective, pas cinq images.
4. Charger popup/newsletter et sticky ad après interaction ou scroll.
5. Tester une densité pub réduite sur contenus courts ; mesurer revenu/session, viewability et engagement.
6. Ajouter HSTS. CSP seulement après test complet AdSense/GA/Awin.

## 7. Données structurées

### Bon

Le navigateur rendu confirme `WebSite` sur la home et `Article`, `Product`, `BreadcrumbList` sur l'article contrôlé. Les fausses notes agrégées ont été supprimées.

### À corriger

- le schéma Product est généré pour toute page ayant un prix et un lien, même si la page ne décrit pas un produit unique ;
- `Product` peut donc apparaître sur une box, un lot, un bon d'achat ou une offre dont le premier nombre extrait n'est pas le vrai prix ;
- la disponibilité est déduite de l'âge/expiration interne, pas vérifiée chez le marchand ;
- l'auteur est présent dans le schéma mais absent visuellement de l'article.

**Fix :** réserver Product aux fiches mono-produit vérifiées ; ajouter un champ structuré `productPrice` plutôt que parser du texte libre ; valider un échantillon dans Rich Results Test ; afficher l'auteur et la date de vérification sur la page.

## 8. Pourquoi le site ne rapporte pas plus

### 8.1 Mauvais mix d'intentions

Les concours et tests gratuits attirent un public cherchant du gratuit, pas un achat. Les bons plans unitaires Amazon captent une intention commerciale, mais sur une fenêtre très courte et avec une commission faible. Le site manque de contenus qui accompagnent une décision d'achat complète : comparatifs, alternatives, avis réels, guides « pour qui », pages marques evergreen.

### 8.2 Dépendance à Amazon

2 317 destinations Amazon sur 3 901 articles affiliés actifs. Même avec un bon CTR, un panier faible et une commission faible plafonnent le revenu. Il faut privilégier :

- partenaires directs à commission récurrente ou fixe ;
- box beauté et abonnements ;
- marchands Awin/Affilae mieux rémunérés ;
- lead generation qualifiée ;
- sponsoring clairement déclaré sur les hubs qui ont déjà du trafic.

### 8.3 Pages trop courtes et trop vite périmées

Un bon plan publié aujourd'hui peut ne plus avoir de demande ou de prix valable dans quelques jours. Une page courte ne construit ni backlinks, ni fidélité, ni avantage compétitif. Le coût éditorial se répète sans accumulation d'actif.

### 8.4 Autorité dispersée

Au lieu de pousser 100 pages capables de devenir leaders, le site distribue ses liens et son crawl entre plus de 6 000 URL. Les 2 191 pages marque sont le symptôme le plus visible.

### 8.5 Absence d'optimisation par revenu

Sans EPC/RPM par page, la production suit le volume et l'intuition. Il est possible que 80 % du revenu vienne de moins de 5 % des pages, mais le site ne sait pas lesquelles.

### 8.6 Monétisation publicitaire potentiellement contre-productive

Plus de blocs publicitaires ne signifie pas automatiquement plus de revenu. Sur un article court, 7 slots peuvent réduire la lecture, les clics affiliés et la viewability moyenne. Il faut arbitrer AdSense contre affiliation par type de page.

## 9. Plan d'action 90 jours

### Jours 1–14 — Stopper les fuites

1. Connecter GA4 + commissions au cockpit.
2. Retirer `/recherche` du sitemap.
3. Passer les pages marque à une whitelist de 100–250 vraies marques.
4. Mettre en `noindex, follow` les pages expirées sans valeur evergreen.
5. Corriger le `lastmod` artificiel.
6. Remplacer les promesses non prouvées (« partenaires », « testé ») par des formulations exactes.
7. Geler les nouveaux bons plans unitaires à faible valeur pendant l'assainissement.

### Jours 15–30 — Consolider

1. Auditer les 202 destinations partagées et fusionner les 20 grappes les plus fortes.
2. Sélectionner les 100 pages avec le plus d'impressions GSC et positions 4–20.
3. Enrichir ces pages avec preuve, tableaux, mise à jour et maillage.
4. Construire 10 hubs : box beauté, tests gratuits, codes promo beauté, K-beauty, soin cheveux, bébé, maison, tech, concours, Amazon beauté.
5. Lier chaque article satellite à son hub.

### Jours 31–60 — Changer le mix éditorial

Répartition recommandée des nouvelles productions :

- 35 % comparatifs/guides evergreen ;
- 25 % tests et avis réels ;
- 20 % codes promo/pages marchands à forte commission ;
- 10 % hubs/mises à jour ;
- 10 % bons plans flash seulement si marge, demande ou exclusivité.

Chaque nouveau contenu doit avoir une hypothèse de mot-clé, de conversion, de commission et une durée de vie attendue.

### Jours 61–90 — Optimiser le revenu

1. Classer les pages par `commission / 1 000 sessions`.
2. Tester CTA haut vs milieu, libellé prix vs bénéfice, et 1 vs 2 CTA principaux.
3. Tester densité AdSense par longueur et intention de page.
4. Négocier 5 partenariats directs sur les marques déjà génératrices de clics.
5. Créer une newsletter segmentée : concours, beauté, maison/tech.
6. Mettre à jour les 20 pages à plus fort revenu chaque semaine.

## 10. KPI à suivre chaque semaine

### SEO

- URL valides indexées / URL soumises par sitemap ;
- clics et impressions non-brand ;
- nombre de pages en positions 4–20 ;
- part de trafic des hubs et evergreen ;
- pages crawlées mais non indexées ;
- pages sans backlink contextuel ;
- CWV mobile par type de page.

### Revenu

- revenu total et revenu par réseau ;
- RPM AdSense ;
- RPM affiliation ;
- EPC et taux de conversion par marchand ;
- CTR affilié par emplacement ;
- revenu par catégorie ;
- part du revenu hors Amazon ;
- revenu par email envoyé et par segment.

### Qualité

- nouveaux articles vs articles consolidés ;
- pourcentage de contenus avec preuve originale ;
- pages expirées encore indexables ;
- pages marque indexables ;
- contenu sous 300/500 mots ;
- temps passé à mettre à jour les gagnants vs publier du neuf.

## 11. Objectifs réalistes à 90 jours

Sans données GA4/GSC et commissions, aucune promesse de CA sérieuse n'est possible. Les objectifs contrôlables sont :

- sitemap réduit de 6 207 à environ 4 000–4 500 URL utiles ;
- pages marque réduites de 2 191 à 100–250 ;
- 100 % des expirés traités par noindex, fusion, 301, 410 ou evergreen ;
- 95 % des clics affiliés attribués ;
- 80 % des commissions attribuées au réseau/marchand ;
- part Amazon ramenée sous 50 % des clics affiliés ;
- 100 pages stratégiques enrichies ;
- 20 grappes cannibalisées consolidées ;
- 30 contenus de haute intention publiés ou refondus avec preuve réelle.

## 12. Priorités absolues

Si seulement cinq actions sont réalisées, faire celles-ci dans cet ordre :

1. **Connecter trafic, clics et commissions.**
2. **Supprimer l'indexation automatique des milliers de tags/pages marque.**
3. **Traiter toutes les pages expirées.**
4. **Consolider au lieu de publier 5–15 pages faibles par jour.**
5. **Déplacer la production vers tests réels, comparatifs et partenaires mieux rémunérés.**

## 13. Données encore nécessaires pour finaliser le diagnostic financier

- export Search Console 16 mois : requêtes, pages, appareils, pays, Discover ;
- export GA4 12 mois : landing pages, sessions, engagement, événements affiliés ;
- rapports AdSense par URL et appareil ;
- commissions 12 mois par réseau et marchand ;
- taux d'ouverture/clic newsletter ;
- backlinks et domaines référents ;
- rapport PageSpeed/CrUX sur cinq gabarits.

Une fois ces données branchées, il sera possible de chiffrer précisément le manque à gagner page par page et de produire un plan de revenu basé sur les gagnants réels, pas sur des moyennes sectorielles.

## Références officielles

- Google Search Central — règles anti-spam et contenu à grande échelle : https://developers.google.com/search/docs/essentials/spam-policies?hl=fr
- Google Search Central — système d'évaluation des avis : https://developers.google.com/search/docs/appearance/reviews-system
- Google Search Central — sitemaps : https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central — contenu utile et centré utilisateur : https://developers.google.com/search/docs/fundamentals/creating-helpful-content
