# Agent de préparation des offres gratuites

Ce premier agent transforme une liste de jeux-concours, tests de produits ou
échantillons en brouillons MDX contrôlés. Il ne publie jamais automatiquement.

## Utilisation

1. Copier `data/agent-offres.example.json` vers `data/agent-offres.json`.
2. Remplacer l'exemple par les offres à vérifier.
3. Lancer `npm run agent:offres`.
4. Relire les fichiers créés dans `drafts/offres`.
5. Après vérification humaine, ajouter une image autorisée et déplacer seulement
   les fiches validées vers `content` en retirant `noindex` et en passant
   `published` à `true`.

## Résultats du contrôle

- `READY` : les informations essentielles sont présentes, mais une relecture reste obligatoire.
- `REVIEW` : plusieurs points doivent être confirmés avant publication.
- `BLOCKED` : l'offre est expirée, invalide ou trop incomplète.

Le contrôle vérifie notamment la date limite, le lien HTTPS, la gratuité, la
source officielle, les conditions, les données personnelles demandées et les
doublons déjà présents dans `content`.
