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
