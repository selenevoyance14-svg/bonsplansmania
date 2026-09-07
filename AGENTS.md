# BonsPlansMania — consignes de livraison

## Push et mise en production

- Pour ce projet, toute demande utilisateur contenant « push » signifie : intégrer les modifications au dernier `main`, effectuer les vérifications adaptées, puis pousser directement sur `origin/main` afin de déclencher la mise en production.
- Ne jamais terminer une demande « push » en poussant uniquement une branche de travail, une branche `agent/*`, `codex/*` ou une branche de preview.
- Ne créer ou pousser une branche de preview que si l’utilisateur le demande explicitement.
- Une branche ou une copie de travail temporaire locale reste autorisée pour protéger les changements en cours. Avant la fin de la tâche, réappliquer proprement les commits sur le dernier `origin/main`, résoudre les conflits sans écraser les nouveautés, vérifier, puis pousser `main`.
- Préserver les modifications locales non liées et ne jamais les inclure automatiquement dans le commit de production.
- Dans le compte rendu final, indiquer clairement le commit envoyé sur `main`. Si le déploiement automatique n’a pas pu être confirmé, le préciser sans présenter une simple branche distante comme étant en production.
