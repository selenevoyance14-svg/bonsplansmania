# BonsPlansMania — consignes de livraison

## Push et mise en production

- Pour ce projet, toute demande utilisateur contenant « push », « pousse », « push tout » ou « mise en ligne » signifie : intégrer les modifications au dernier `main`, effectuer les vérifications adaptées, puis pousser directement sur `origin/main` afin de déclencher la mise en production.
- Ne jamais terminer une demande « push » en poussant uniquement une branche de travail, une branche `agent/*`, `codex/*` ou une branche de preview.
- Ne créer ou pousser une branche de preview que si l’utilisateur le demande explicitement.
- Une branche ou une copie de travail temporaire locale reste autorisée pour protéger les changements en cours. Avant la fin de la tâche, réappliquer proprement les commits sur le dernier `origin/main`, résoudre les conflits sans écraser les nouveautés, vérifier, puis pousser `main`.
- Préserver les modifications locales non liées et ne jamais les inclure automatiquement dans le commit de production.
- Après chaque publication, vérifier avec `git ls-remote --heads origin main` que `origin/main` pointe bien sur le commit attendu.
- Dans le compte rendu final, indiquer clairement le commit envoyé sur `main`. Si le déploiement automatique n’a pas pu être confirmé, le préciser sans présenter une simple branche distante comme étant en production.

## Contenus et visuels

- Ne jamais utiliser une image SVG comme visuel d’article. Utiliser une vraie image raster pertinente au format JPG, PNG ou WebP.
- Quand l’utilisateur demande un prix Amazon, vérifier et reprendre le prix Amazon actuellement affiché pour la variante concernée.
- Respecter strictement « remonte » et « ne remonte pas » : ne modifier la date de publication ou l’ordre d’affichage que si l’utilisateur le demande.
- Ne pas générer de preview éditoriale avant publication lorsque l’utilisateur demande un push direct.

## Liens affiliés et redirections

- Le lien affilié réel doit rester dans le frontmatter `affiliateUrl` afin d’alimenter le mapping serveur, mais il ne doit jamais être recopié tel quel dans le corps public d’un article.
- Dans le contenu Markdown, tous les boutons et liens commerciaux doivent utiliser `/go/<affiliateAlias-ou-slug>`.
- Les composants, tableaux, comparatifs et recommandations doivent également exposer une URL `/go/...`, jamais une URL de tracking brute.
- Les redirections commerciales passent par la Cloudflare Function `/go/[slug]`, répondent en 302 et les liens rendus conservent `rel="nofollow sponsored noopener"`.
- Lorsqu’un article contient plusieurs destinations commerciales différentes, créer un alias dédié pour chaque destination dans le mapping manuel au lieu d’insérer les URL affiliées dans le HTML.
- Le rendu des articles remplace automatiquement toute occurrence du `affiliateUrl` principal encore présente dans le Markdown par sa redirection `/go/...` ; cette sécurité ne dispense pas d'écrire directement l'alias propre dans les nouveaux contenus.

## Règles de rédaction des futurs articles

### Objectif éditorial

- Rédiger des articles utiles, chaleureux, naturels, faciles à lire et optimisés pour le référencement, sans promettre de résultat SEO ni exagérer les offres.
- Respecter les composants, les champs de frontmatter et les conventions déjà utilisés par le site.

### Titre principal H1

- Utiliser un seul H1 contenant le produit, la marque et le prix promotionnel principal lorsque ce prix a été vérifié.
- Pour une offre ponctuelle, ajouter le mois et l'année lorsque cela aide réellement à situer l'offre.
- Pour un guide permanent ou un test produit, privilégier un titre durable.
- Ne jamais actualiser une date uniquement pour donner une impression de fraîcheur : vérifier et actualiser réellement le contenu avant de modifier sa date.
- Si le titre de l'article génère déjà le H1, ne jamais ajouter un deuxième H1 dans le corps du contenu.
- Exemple de structure : « Ninja Foodi MAX à 179 € : le bon plan d'octobre 2026 ».

### Introduction

- Rédiger un court paragraphe de trois à quatre phrases, avec un ton humain, chaleureux et naturel.
- Présenter rapidement le produit, le marchand et le prix promotionnel.
- Ajouter le prix de référence et le pourcentage d'économie uniquement lorsque ces informations sont vérifiées.
- Préciser la nature du prix de référence : prix conseillé, ancien prix affiché ou autre référence connue.
- Mentionner une date de fin ou une disponibilité limitée uniquement si la source le confirme.
- Ne jamais inventer une vente flash, un stock presque épuisé, une urgence ou une durée limitée.

### Images

- Réutiliser le système d'images et les formats compatibles avec le projet ; ne pas convertir systématiquement les images existantes.
- Ajouter aux images informatives un texte alternatif précis décrivant uniquement ce qui est réellement visible, sans accumulation de mots-clés.
- Utiliser un attribut `alt` vide pour une image purement décorative.
- Ne jamais inventer une photo, une caractéristique visible ou un fichier absent.

### Tableau récapitulatif

- Pour chaque article consacré à une offre produit, placer après l'introduction un tableau compact comprenant, selon les informations disponibles : produit, prix promotionnel, prix de référence et nature de cette référence, économie en euros et en pourcentage, marchand, code promotionnel et conditions nécessaires.
- Calculer l'économie uniquement à partir de prix vérifiés.
- Si une information manque, écrire « Non communiqué » ou retirer le champ concerné au lieu de l'inventer.
- Adapter la présentation à la nature de l'article : les tests produits, guides, concours et offres gratuites ne nécessitent pas systématiquement un tableau de prix.
- Les expressions données par l'utilisateur comme consignes de travail, par exemple « prix avant/après », ne doivent jamais être recopiées telles quelles dans le titre, la description ou le texte public. Employer un vocabulaire éditorial naturel tel que « prix habituel », « prix conseillé » ou « prix promotionnel ».

### Liens affiliés, alias et boutons

- Ne jamais afficher de longue URL d'affiliation dans le corps public de l'article.
- Utiliser un alias interne existant de la forme `/go/<alias>`, par exemple `/go/amazon-ninja-flex`.
- Avant d'ajouter un nouvel alias, vérifier le mécanisme de redirection du projet et configurer sa destination réelle selon la convention existante, avec une redirection 302 lorsque c'est le fonctionnement prévu.
- Ne jamais insérer un alias inexistant et ne jamais inventer un lien d'affiliation.
- Appliquer `rel="sponsored nofollow"` au lien affilié effectivement rendu dans la page, y compris lorsqu'il passe par un alias interne. Conserver également `noopener` lorsque le composant ou la convention du site le prévoit.
- Utiliser un libellé explicite, par exemple « Voir l'offre chez Amazon ».
- Afficher une mention claire : « Lien affilié : Bons Plans Mania peut percevoir une commission sur les achats effectués via ce lien. »

### Utilité et fiabilité

- Expliquer à qui le produit convient, ses caractéristiques réellement utiles et les limites à connaître.
- Mentionner les frais de livraison et les conditions qui modifient le prix final lorsqu'ils sont connus.
- Ne jamais écrire « meilleur prix », « prix le plus bas » ou une affirmation équivalente sans comparaison vérifiée.
- Ne jamais présenter un produit comme testé personnellement si l'utilisateur n'a pas fourni son expérience.
- Si une donnée essentielle manque, la signaler clairement avant de préparer une version destinée à la publication.

### Contrôle avant livraison

- Avant de terminer un article, contrôler les prix, les calculs, les conditions, les dates, les images, les redirections et la présence de la mention d'affiliation.
- Vérifier que le titre public, le titre SEO, la description, le tableau et le corps de l'article ne se contredisent pas.
- Ne publier aucune donnée essentielle non vérifiée et ne présenter aucune supposition comme un fait.
