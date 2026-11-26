# Audit de découverte des rubriques — 26 novembre 2026

Périmètre : routes publiques de `src/app`, catégories des fichiers MDX, liens du Header et du pied de page. Graphe de liens complémentaires analysé sur l'export `out` de la précédente publication ; les menus déroulants rendus côté client ne sont pas entièrement représentés dans ce graphe. Les nombres ci-dessous comptent les fichiers locaux, archives incluses, et ne sont pas des nombres d'offres actives.

## Accès permanents ajoutés

- `/categorie/bon-plan` : lien « Tous les bons plans » déjà préparé dans le footer.
- `/bons-plans-amazon` : existait et était lié depuis certaines pages, mais absent du menu et du footer.
- `/marques` : annuaire éditorial distinct de la page « Marques partenaires ».
- `/categorie/code-promo` : 104 articles, distincts de la page de codes `/code-promo`.
- `/tenir-son-budget` : calculateur et méthode budget ; auparavant accessible par des liens contextuels.
- `/tests-produits-gratuits-2026` : ajout au menu Tests Produits ; guide distinct de la liste complète des articles.
- `/categorie/guide` : nouvelle route générée pour les 5 articles déjà classés `guide`, avec lien footer.

## Catégories sans route corrigées

- 3 articles `bon-plan-beaute` reclassés `bon-plan` : SVR Sebiaclear, KIKO Lookfantastic et Nanolash Lookfantastic.
- Concours Omlet reclassé de `jeu-concours` vers `concours`.
- Aucun prix, statut, date ou indicateur de remontée modifié.

## Pages déjà accessibles ou laissées hors navigation permanente

- `/categorie/selection` : aucun article dans cette catégorie ; ne pas ajouter un lien vide.
- `/categorie/calendrier` : doublon avec canonical vers `/categorie/calendrier-avent` ; conserver l'accès canonique existant.
- `/categorie/test-produit` : agrège Tests gratuits et Tests & avis, tous deux déjà présents au menu.
- `/blog` : liste ancienne volontairement désindexée ; éviter de la promouvoir comme autre sommaire général.
- `/fete-des-peres` : aucun lien entrant dans l'export et page noindex, hors saison.
- `/ete`, `/guide-solaires-2026` : liens contextuels, accès plus profond ; hors saison en novembre.
- `/noel`, `/calendriers-de-l-avent-concours-2026`, `/calendriers-de-l-avent-lego-2026` : pages liées dans le site, à utiliser dans les sélections saisonnières.
- `/proposer-un-bon-plan` : formulaire sans lien entrant dans l'export ; ce n'est pas une rubrique d'articles oubliés.
- Pages admin, erreurs et previews exclues de l'inventaire éditorial.

Les modifications sont locales et doivent être publiées lors du prochain push demandé. Cet audit de navigation ne vérifie pas les prix de tous les articles.

## Correction demandée après audit

Tous les nouveaux liens de navigation ont été retirés (footer et guide des campagnes au menu). Les adresses sont transmises à Nathalie pour tri avant toute décision d’archivage. Aucune archive effectuée. La nouvelle route guide reste préparée localement, non publiée.

## Décision suivante de Nathalie

Rubrique Guides pratiques validée : seul ce nouveau lien est ajouté au footer. Article `bon-plan-12-applis-payer-moins-cher-courses-2026` classé guide, sans changement de date, updated ou remount. Les autres nouveaux liens restent retirés.

## État retenu pour la publication demandée

- Nouveaux liens footer validés : Guides pratiques, Articles codes promo, Tests produits gratuits et Fête des pères. Aucun ajout pour l’ancien annuaire, Amazon, Budget ou Tous les bons plans.
- 51 marques supplémentaires avec articles rejoignent les 77 partenaires : 128 entrées. Les entrées éditoriales sans destination commerciale connue pointent vers leur page marque ; aucun partenariat inventé. Les 77 boutiques existantes passent par des alias `/go/annuaire-partenaire-*`.
- `/marques` devient une redirection permanente vers `/marques-partenaires` et sort du sitemap. Les articles ne sont pas supprimés.
- Guide des solaires accessible depuis le menu Beauté et la catégorie Beauté.
- Page été : sélection par usages explicites, sans inclusion automatique sur un simple tag été/vacances ni mention publicitaire dans la description. Cas de régression vérifiés : box Camping Care, jouet camping-car et promotion Carte Noire exclus.
- Guide des applications courses : contenu et modalités revus, 10 redirections dédiées, updated au 26 novembre sans remontée.
- Publication groupée incluant les 8 nouveaux articles préparés précédemment. Les fichiers locaux sans rapport (tsconfig.tsbuildinfo, .playwright-mcp, audit-liens-2026-11-23) sont exclus du commit.
