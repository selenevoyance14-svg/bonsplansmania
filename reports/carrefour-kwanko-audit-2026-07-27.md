# Audit Carrefour x Kwanko — 27 juillet 2026

## Périmètre et méthode

- Route auditée : `/marque/carrefour`.
- Source de l'association aux marques : tableau `tags` du frontmatter MDX.
- Article considéré comme associé à Carrefour lorsqu'un tag normalisé correspond
  exactement à `carrefour`.
- Contrôle complémentaire effectué sur les noms de fichiers, titres, descriptions,
  liens et tags contenant « Carrefour ».
- Les informations commerciales n'ont pas été remplacées par des estimations.
- Les liens et affirmations ci-dessous doivent être revérifiés auprès de leur source
  avant toute activation d'une campagne Carrefour x Kwanko.

## Résumé

La page de marque utilisait un tag brut choisi selon l'ordre de lecture des fichiers.
Comme `Carrefour` et `carrefour` étaient distincts, la route publique n'affichait
qu'un article au moment de l'audit. Greenweez n'est présent ni dans les résultats
calculés pour le slug `carrefour`, ni dans la page publique contrôlée le 27 juillet
2026. Sa présence signalée n'est donc pas reproductible dans l'état audité. Elle
peut provenir d'un ancien build, d'un cache ou d'un bloc de recommandation distinct
de la liste de marque.

La correction regroupe désormais uniquement les tags dont le slug normalisé est
exactement `carrefour`. Une occurrence Carrefour manquait sur l'ancien concours
Vico de juin ; le tag exact a été ajouté à cet article uniquement.

La normalisation est volontairement activée uniquement pour Carrefour. Une
application globale aurait également modifié les pages Amazon, Leclerc, Auchan et
Intermarché ; ce changement plus large est exclu de ce diff.

## Anomalies de taxonomie

| Priorité | Anomalie | Conséquence | Correction |
|---|---|---|---|
| Haute | `Carrefour` et `carrefour` étaient traités comme deux tags distincts après résolution de la route | `/marque/carrefour` n'affichait qu'un seul article | Recherche par slug normalisé exact |
| Moyenne | Le concours Vico de juin avait seulement les tags composés `concours carrefour` et `vico x carrefour` | Article absent de la page Carrefour | Ajout du tag exact `carrefour` |
| Information | Greenweez n'est pas tagué Carrefour et n'apparaît pas dans le résultat actuel | Signalement non reproductible | Aucun article Greenweez modifié |

## Impact mesuré de la logique de tags

| Route | Avant | Après | Ajouts | Retraits | Différence inattendue |
|---|---:|---:|---|---|---|
| `/marque/carrefour` | 8 | 10 | Concours Le Chat Excellence ; Concours Vico x Carrefour de juin | Aucun | Non |
| `/marque/amazon` | 1 631 | 1 631 | Aucun | Aucun | Non |
| `/marque/leclerc` | 8 | 8 | Aucun | Aucun | Non |
| `/marque/auchan` | 2 | 2 | Aucun | Aucun | Non |
| `/marque/intermarche` | 4 | 4 | Aucun | Aucun | Non |

Une simulation rejetée de la normalisation globale aurait donné Amazon 1 826,
Leclerc 10, Auchan 4 et Intermarché 7 articles. Elle n'est pas incluse car elle
aurait modifié des marques non auditées.

## Inventaire des variantes de tags Carrefour

La recherche porte sur tous les tags dont la forme normalisée commence par
`carrefour`. Les variantes ne sont pas automatiquement rattachées à la page
Carrefour :

| Tag exact | Slug normalisé | Occurrences | Association automatique |
|---|---|---:|---|
| `carrefour` | `carrefour` | 9 | Oui, correspondance exacte |
| `Carrefour` | `carrefour` | 1 | Oui, correspondance exacte après normalisation |
| `carrefour market` | `carrefour-market` | 1 | Non |
| `carrefour proxi` | `carrefour-proxi` | 1 | Non |

Aucun tag `Carrefour Drive`, `Carrefour Voyages` ou autre variante commençant par
Carrefour n'a été trouvé dans le frontmatter des articles.

## Vérification du rattachement Vico

Le rattachement du concours Vico de juin à Carrefour est démontrable à partir des
données déjà présentes dans l'article :

- titre : « Concours Vico x Carrefour Juin 2026 » ;
- description : obligation d'achat de deux produits Vico chez Carrefour ;
- tableau : organisateurs Vico (Intersnack) x Carrefour ;
- consignes : achat chez Carrefour uniquement ;
- URL de l'opération : page Mes Instants Vico dédiée.

Le tag exact `carrefour` est donc conservé. Cette vérification confirme l'enseigne,
mais ne valide pas automatiquement les estimations de prix, de valeur ou de chances
présentes ailleurs dans le texte.

## Classement de l'état Git

### Modifications Carrefour créées pendant cet audit

- `content/concours-carrefour-he-amsterdam-fours-pizza-imprimantes-juillet-2026.mdx`
- `content/concours-vico-carrefour-juin-2026-170-lots-foot-videoprojecteurs.mdx`
- `src/app/marque/[slug]/page.tsx`
- `src/lib/articles.ts`
- `src/lib/brand-editorial-data.ts` — nouveau fichier non suivi
- `reports/carrefour-kwanko-audit-2026-07-27.md` — nouveau rapport non suivi

### Modifications antérieures du comparatif des drives

- `content/guide-comparatif-drives-carrefour-leclerc-auchan-intermarche-2026.mdx`
- `public/images/articles/comparatif-drives-supermarches-2026.png` — nouvelle
  image non suivie

Ces deux fichiers sont conservés intégralement et ne font pas partie du diff
Carrefour isolé.

### Fichiers générés automatiquement

- `functions/data/affiliate-mapping.json`
- `public/articles.json`
- `public/rss.xml`
- `tsconfig.tsbuildinfo`
- `reports/content/content-control.csv`
- `reports/content/integrity-audit.json`

### Fichiers non suivis sans rapport avec Carrefour

- `reports/revenue/articles.csv`
- `reports/revenue/cockpit.json`

Les rapports `content` et `revenue` étaient déjà présents comme fichiers non suivis
avant l'audit Carrefour ; ils ne doivent pas entrer dans son futur commit.

## Politique pour les fichiers générés versionnés

Les trois fichiers demandés sont bien suivis par Git et régulièrement inclus dans
l'historique du projet :

- `functions/data/affiliate-mapping.json` est requis par la Function `/go/[slug]`.
  Son seul changement actuel concerne le libellé iGraal du comparatif des drives :
  il appartient au lot antérieur « comparatif », pas au diff Carrefour.
- `public/rss.xml` contient désormais le comparatif remonté au 27 juillet et le
  retrait d'un article sorti du top 50 : il appartient au lot antérieur
  « comparatif/feed », pas au diff Carrefour.
- `public/articles.json` a échangé deux articles datés du même jour sans rapport
  avec Carrefour. Ce résultat révèle un ordre non déterministe en cas d'égalité ;
  il ne doit pas être inclus dans un futur commit Carrefour.

Conclusion : aucun de ces trois fichiers générés ne doit être inclus dans le futur
commit Carrefour dans leur état actuel. Ils restent préservés dans le répertoire de
travail pour ne pas écraser le lot antérieur.

## Audit des articles associés

### 1. Tondeuse Braun BT7420

Fichier : `content/carrefour-braun-bt7420-tondeuse-barbe-series-7-47-49-euros-juin-2026.mdx`

- Prix de 47,49 €, prix barré de 94,99 € et réduction de 50 % constatés le
  25 juin selon le texte, mais non vérifiés le 27 juillet.
- `expired: false` alors que le prix a plus d'un mois : **à vérifier**.
- Note 5/5, deux avis et citations clients : **à vérifier sur la fiche officielle**.
- « gamme pro », « qualité pro confirmée », « c'est rare, ça part vite » :
  formulations promotionnelles non démontrées.
- Cashback iGraal et total estimé à environ 46 € : taux et éligibilité non indiqués,
  donc **à retirer ou revérifier avant campagne**.
- Lien commercial actuel : MetaAffiliation, pas Kwanko.
- Aucune affirmation de test physique par Bons Plans Mania détectée.

### 2. Concours Carrefour Traiteur

Fichier : `content/carrefour-jeu-concours-traiteur-2026.mdx`

- Aucune date de début, de fin ni règlement archivé.
- Lots décrits sans quantité ni valeur vérifiable.
- « Ouvert à tous », « inscription gratuite », « enseigne de confiance, numéro 1
  en France » et « valeur sûre » : affirmations non sourcées.
- L'article ne peut pas être présenté comme une offre active : **validation humaine
  et règlement officiel indispensables**.
- Lien direct Carrefour, non affilié.

### 3. Trottinette UrbanGlide Ride 100 Eco

Fichier : `content/carrefour-urbanglide-ride-100-eco-trottinette-electrique-129-euros-juin-2026.mdx`

- Prix de 129,35 € constaté le 25 juin, non revérifié le 27 juillet.
- Avis 3,5/5 sur deux avis et citations : **à vérifier sur la fiche officielle**.
- « l'un des prix les plus bas », garantie deux ans Carrefour, paiement sans frais
  et autonomie réelle : comparaisons ou conditions à sourcer.
- Cashback iGraal évoqué sans taux vérifié.
- Lien commercial actuel : MetaAffiliation, pas Kwanko.
- Aucune affirmation de test physique par Bons Plans Mania détectée.

### 4. Concours Caprice des Dieux x Carrefour

Fichier : `content/concours-caprice-des-dieux-70-ans-purs-caprices-voyage-wonderbox-juin-juillet-2026.mdx`

- Date de fin renseignée : 7 juillet 2026. Le système le classe automatiquement
  comme expiré.
- Montants, nombre de gagnants, tirage, adresses email et délais doivent être
  rapprochés du règlement archivé avant réutilisation.
- « un des gros lots concours de juillet » : comparaison non sourcée.
- Lien vers Qui veut du fromage, non affilié.

### 5. Concours HE x Carrefour

Fichier : `content/concours-carrefour-he-amsterdam-fours-pizza-imprimantes-juillet-2026.mdx`

- Fin annoncée dans l'article : 12 juillet 2026, mais aucun `endDate` n'était présent.
- Correction sûre appliquée : `endDate: 2026-07-12` et `expired: true`.
- Valeur totale d'environ 13 400 €, mécanique des instants gagnants et conseil sur
  les horaires : **à vérifier dans le règlement**.
- Lien vers le site de l'opération, non affilié.

### 6. Concours masque Shark CryoGlow

Fichier : `content/concours-carrefour-masque-led-cryoglow-shark-350-euros-tirage-au-sort-juillet-2026.mdx`

- Date de fin renseignée : 19 juillet 2026. Le système le classe automatiquement
  comme expiré.
- « enseigne n° 1 », « 100 000 exemplaires en trois mois », « un des plus gros lots »
  et « Carrefour = fiable » : affirmations non sourcées.
- Valeur, nombre de gagnants, frais d'envoi et délais doivent être rapprochés du
  règlement officiel archivé.
- Lien direct Carrefour, non affilié.

### 7. Concours Le Chat Excellence multi-enseignes

Fichier : `content/concours-le-chat-excellence-1-an-lessive-henkel-labelleadresse-mai-decembre-2026.mdx`

- Article multi-enseignes, correctement associé à Carrefour.
- Période Carrefour annoncée du 14 août au 1er septembre 2026.
- Valeur d'environ 83 € HT et calcul Kantar 2025 : source absente du projet.
- Prix d'achat supposé de 8 à 10 € et « une chance sur des milliers » :
  estimations non sourcées.
- Le lien pointe vers une page générique La Belle Adresse, pas vers le règlement
  ou l'opération précise.

### 8. Concours Vico x Carrefour — juin

Fichier : `content/concours-vico-carrefour-juin-2026-170-lots-foot-videoprojecteurs.mdx`

- Concours terminé le 29 juin 2026.
- Corrections sûres appliquées : tag exact `carrefour`, `endDate: 2026-06-29` et
  `expired: true`.
- Valeurs estimées des vidéoprojecteurs, valeur totale estimée, enseignes possibles
  pour les cartes, produits éligibles, prix supposés, volumes de participation et
  chances : non vérifiables dans les données.
- « huissier judiciaire », participations multiples et délais de régularisation :
  à rapprocher du règlement.

### 9. Concours Vico x Carrefour — Tour de France

Fichier : `content/concours-vico-carrefour-tour-de-france-juillet-2026.mdx`

- Fin indiquée : 27 juillet 2026, mais aucun `endDate` dans le frontmatter :
  **à valider avant ajout**, car l'heure et la zone peuvent être déterminantes.
- Valeurs des lots et mécanique à confirmer avec le règlement.
- « 111 gagnants = de très bonnes chances » : conclusion non démontrée sans nombre
  de participations.
- Lien vers Mes Instants Vico, non affilié.

### 10. Comparatif des drives

Fichier : `content/guide-comparatif-drives-carrefour-leclerc-auchan-intermarche-2026.mdx`

- L'ancienne version contenait un panier de trente produits non reproductible ;
  la version locale en cours le signale et ne présente plus ce panier comme un test.
- Notes chiffrées 5/5, 4/5, 3/5 et 2/5 : elles ne reposent pas sur une formule
  explicitée. Les remplacer par des appréciations factuelles modifierait le verdict
  éditorial ; **correction non appliquée sans validation humaine**.
- « meilleur choix », « meilleur compromis » et « meilleur choix de produits » :
  verdicts éditoriaux à reformuler ou sourcer avant partenariat.
- La référence à des relevés nationaux et au comparateur Que Choisir doit recevoir
  un lien de source visible dans l'article.
- Le retrait Drive, le Club Carrefour et les variations locales sont cohérents avec
  les pages officielles consultées.
- Le lien iGraal est un lien de parrainage, pas un lien Carrefour/Kwanko.
- Aucune formulation ne prétend désormais que la rédaction a effectué un test réel.

## Articles contenant Carrefour mais non associés à la marque

- Les articles eBuyClub et Poulpeo mentionnent Carrefour dans des sélections de
  marchands. Ils restent associés à leur plateforme de cashback, pas à Carrefour.
- Aucun article Greenweez n'a reçu le tag Carrefour. La mention « filiale Carrefour »
  dans un ancien hub de soldes n'est pas utilisée comme taxonomie.

## Architecture éditoriale préparée

La configuration `src/lib/brand-editorial-data.ts` ajoute pour Carrefour :

- une introduction factuelle ;
- quatre services issus de pages officielles ;
- une collection d'offres volontairement vide tant qu'une offre active n'est pas
  vérifiée ;
- une FAQ factuelle ;
- la date de dernière vérification ;
- des liens internes ;
- un drapeau d'activation de partenariat, désactivé par défaut ;
- un champ facultatif `commercialUrl` pour un futur lien Kwanko validé.

Lorsque `commercialUrl` sera fourni, le lien est rendu avec
`rel="nofollow sponsored noopener"`. Aucun identifiant Kwanko ni secret fictif n'a
été créé. La mention « Collaboration commerciale avec Carrefour » est déjà prévue
dans le rendu mais reste masquée tant que `commercialPartnershipActive` vaut `false`.

Le système d'articles existant utilise `/go/<slug>` puis une redirection Cloudflare
vers l'URL du frontmatter. Ces boutons ont déjà `rel="nofollow sponsored noopener"`
et les clics `/go/` déclenchent l'événement Analytics `affiliate_click`. Un futur
lien Kwanko d'article pourra donc réutiliser ce système sans créer de second
tracking.

## Validation humaine requise

1. Fournir le lien Kwanko réel et ses règles d'attribution avant toute intégration.
2. Confirmer le périmètre exact de la campagne et la date d'activation.
3. Valider la mention commerciale avec Carrefour/Kwanko et les obligations légales.
4. Recontrôler chaque prix et offre active directement dans le magasin ou la zone
   ciblée.
5. Décider si les notes chiffrées du comparatif doivent être remplacées par des
   appréciations non chiffrées.
6. Archiver ou fournir les règlements des concours avant toute republication.
7. Décider si les deux anciens bons plans produit doivent être marqués expirés.

## Sources officielles utilisées pour l'architecture

- https://www.carrefour.fr/services
- https://www.carrefour.fr/services/drive
- https://www.carrefour.fr/services/courses-en-ligne
- https://www.carrefour.fr/conditions-generales-carte-carrefour
