# Bons Plans Mania — contexte de travail permanent

Ce document permet à une nouvelle conversation Codex de reprendre le travail sans dépendre de l’historique d’un ancien chat. Le lire entièrement avant toute intervention sur Bons Plans Mania.

## Le projet

- Site : `https://bonsplansmania.fr/`
- Dépôt actif : `/Users/Yann/Documents/oracle/bpm-pending-concours`
- Dépôt distant : `https://github.com/selenevoyance14-svg/bonsplansmania.git`
- Branche de production : `main`
- Stack principale : Next.js, TypeScript et contenus MDX dans `content/`.
- La propriétaire travaille surtout sur les bons plans, jeux concours, tests produits gratuits, box beauté, calendriers de l’Avent, codes promo, guides budget et fiches beauté.
- Répondre en français, simplement et chaleureusement. Expliquer clairement ce qui a été fait sans noyer la propriétaire dans le jargon technique.

## Manière de travailler avec la propriétaire

- Elle transmet souvent plusieurs liens à la suite. Les conserver et les traiter dans le même lot jusqu’à sa demande de publication.
- Une demande contenant « push » signifie : vérifier les modifications, les intégrer au dernier `main`, puis pousser directement sur `origin/main`. Les détails obligatoires sont aussi inscrits dans `AGENTS.md`.
- Ne jamais pousser sans demande explicite contenant « push » ou une autorisation tout aussi claire.
- Ne pas inventer une offre, un prix, un contenu, une date, une dotation ou une condition manquante. Ouvrir la source officielle et vérifier les informations actuelles.
- Quand une page ou une campagne est peu claire, le dire franchement plutôt que publier quelque chose de fragile.
- Ne jamais écraser les modifications locales sans lien avec la tâche.
- Après une modification visuelle importante, vérifier l’ordinateur et le téléphone avant publication. La propriétaire aime particulièrement la version ordinateur actuelle.

## Règles éditoriales et SEO

- Chaque nouveau contenu doit partir d’un vrai mot-clé principal cohérent avec l’intention de recherche.
- Soigner systématiquement : titre éditorial, `seoTitle`, description, `seoDescription`, slug lisible, introduction, intertitres, champ lexical, catégorie, tags, texte alternatif des images et liens internes.
- Éviter les titres artificiels, le bourrage de mots-clés, les promesses exagérées et les informations non vérifiées.
- Pour les jeux concours et tests ponctuels, mettre la date de fin dans le titre lorsqu’elle est connue. Cela aide la propriétaire à repérer et nettoyer rapidement les contenus terminés.
- Renseigner `endDate` au format `YYYY-MM-DD` dès qu’une date de clôture est connue. Utiliser `evergreen: true` uniquement pour un dispositif réellement permanent.
- Distinguer clairement : sans obligation d’achat, avec obligation d’achat, candidature, pré-inscription, tirage au sort et instant gagnant.
- Faire apparaître les conditions essentielles sans recopier inutilement tout un règlement.
- Ajouter des liens internes réellement proches du sujet. Dans les blocs « À lire aussi », conserver une présentation équilibrée : idéalement 3 ou 5 liens, pas 4 disposés en trois puis un seul dessous.
- Lors d’une mise à jour demandée comme « remonte le post », actualiser le contenu et la date `updated` selon les conventions existantes, sans falsifier la date de publication initiale.
- Préserver l’URL d’un article existant autant que possible pour ne pas perdre son référencement.

## Contenus et catégories fréquentes

- Jeux concours : catégorie `concours`, avec dates, dotations, conditions et lien vers le règlement lorsqu’il existe.
- Tests produits : catégories `test-gratuit` ou `test-avis` selon qu’il s’agit d’un recrutement gratuit ou d’un avis personnel après utilisation.
- Bons plans et promotions : vérifier le prix, la réduction, la période et les exclusions.
- Box beauté et box homme : ne pas limiter les box homme aux soins ; inclure aussi gastronomie, bière, vin et cadeaux lorsque c’est pertinent.
- Calendriers de l’Avent : utiliser la catégorie dédiée et de vraies images du calendrier concerné.
- Codes promo : mettre à jour la page générale `/code-promo` et la page marque lorsqu’elle existe, en plus de l’article permanent pertinent.
- Guides budget : privilégier une aide pratique, concrète et sincère, avec l’impression que le contenu aide réellement le lecteur.
- Avis personnels : conserver la voix et le ressenti fournis par la propriétaire. Ajouter les précautions nécessaires sans transformer son avis en texte impersonnel.

## Affiliation et transparence

- Réutiliser exactement les liens affiliés transmis par la propriétaire. Ne pas les remplacer par un lien marchand direct, sauf demande explicite.
- Réseaux fréquemment utilisés : Awin, Effiliation, Affilae, Amazon Partenaires, liens Prozis et liens influenceuse YesStyle.
- Tag Amazon observé : `lebrunnathali-21`.
- Code/lien influenceuse YesStyle observé : `NATHALIE83`.
- Code Prozis permanent historiquement mis en avant : `BONSMANIA`; certaines opérations temporaires ont utilisé d’autres codes comme `IMBACK`. Toujours vérifier l’offre du moment avant publication.
- Afficher une mention de transparence lorsque le lien est affilié ou lorsqu’un produit a été reçu gratuitement.
- Si la propriétaire demande de ne pas montrer un code dans l’article afin que le visiteur clique pour le découvrir sur le site partenaire, respecter cette consigne tout en décrivant honnêtement l’avantage.
- Ne jamais affirmer qu’un lien est affilié si la plateforme ou le suivi n’a pas pu être identifié.

## Images

- Utiliser autant que possible de vraies images du produit, de la box, du calendrier ou de la campagne, provenant de la source officielle ou fournies par la propriétaire.
- Pour un avis personnel, privilégier les photos originales fournies par la propriétaire et signaler honnêtement le produit reçu gratuitement lorsque c’est le cas.
- Les images d’articles sont généralement placées dans `public/images/articles/` et référencées depuis le MDX.
- Optimiser le format et le poids sans dégrader visiblement l’image. Préférer WebP lorsque le flux existant le permet.
- Toujours écrire un `imageAlt` descriptif et naturel. Ne pas y entasser des mots-clés.
- Une image de mise en avant doit rester lisible sur ordinateur et téléphone.

## Expérience utilisateur déjà décidée

- La version ordinateur de la page d’accueil plaît beaucoup à la propriétaire : préserver son identité visuelle.
- Les carrousels mobiles sont appréciés, notamment parce qu’ils bougent et indiquent naturellement qu’il existe d’autres cartes. Ne pas les remplacer sans demande explicite.
- En août-septembre 2026, l’audience sur 28 jours était presque partagée à égalité : environ 49,29 % mobile, 48,48 % ordinateur et 1,28 % tablette. Il faut donc contrôler les deux affichages.
- La propriétaire souhaite davantage d’interaction, mais préfère des dispositifs simples : commentaires repliables, possibilité de proposer un bon plan et notification par e-mail lors d’un nouveau commentaire.
- Éviter les blocs trop envahissants sur téléphone, surtout lorsqu’une publicité ou un bouton affilié fixe occupe déjà le bas de l’écran.

## Structure technique utile

- Les articles se trouvent dans `content/*.mdx` avec un frontmatter analysé par `src/lib/articles.ts`.
- Champs courants : `title`, `description`, `date`, `updated`, `category`, `tags`, `image`, `imageAlt`, `affiliateUrl`, `affiliateLabel`, `price`, `published`, `featured`, `seoTitle`, `seoDescription`, `expired`, `evergreen` et `endDate`.
- La page d’accueil réexporte actuellement `src/app/refonte-preview/page.tsx`.
- Le site contient des pages d’archives pour les bons plans, concours et tests terminés. Utiliser le mécanisme d’expiration existant plutôt que supprimer précipitamment une URL utile au SEO.

## Vérifications avant un push

- Examiner `git status` et le diff pour ne publier que le travail demandé.
- Vérifier les fichiers MDX/frontmatter et les liens ajoutés.
- Exécuter les contrôles adaptés au changement : lint ciblé, `git diff --check`, scripts de validation disponibles et build lorsque le risque le justifie.
- Vérifier les nouvelles pages ou modifications visuelles localement, notamment en largeur mobile.
- Synchroniser avec le dernier `origin/main` avant l’envoi et résoudre les conflits sans supprimer le travail d’autres personnes.
- Après le push, communiquer le hash du commit envoyé sur `main` et préciser si le déploiement n’a pas pu être confirmé.

## Limites de ce document

- Les prix, dates, stocks, campagnes et codes promotionnels deviennent rapidement obsolètes : toujours les revérifier.
- Ce fichier conserve les méthodes et préférences durables, pas la liste de toutes les offres du moment.
- Les derniers changements réellement publiés se vérifient avec `git log` et les contenus du dépôt, jamais uniquement avec ce résumé.
