# Affilae : connexion privée en lecture seule

Documentation officielle : https://rest.affilae.com/reference

## Activation

Créer une clé API éditeur dans Affilae (Mon compte → Clés API). Dans Cloudflare Pages, projet bonsplansmania, ajouter le secret `AFFILAE_API_TOKEN` pour la production. Ne jamais utiliser un nom `NEXT_PUBLIC_`, publier la clé ou la placer dans le Markdown.

Pour un essai local, ajouter la clé à `.env.local` (ignoré par Git), puis :

```sh
node --env-file=.env.local --import tsx scripts/affilae.ts profiles
```

Choisir l'identifiant du profil renvoyé et configurer éventuellement `AFFILAE_PROFILE_ID` dans Cloudflare et `.env.local`.

```sh
node --env-file=.env.local --import tsx scripts/affilae.ts feeds profile=IDENTIFIANT
node --env-file=.env.local --import tsx scripts/affilae.ts kpis profile=IDENTIFIANT from=2026-11-01T00:00:00Z to=2026-11-30T23:59:59Z metric=commissionsTotal
node --env-file=.env.local --import tsx scripts/affilae.ts conversions profile=IDENTIFIANT limit=100 offset=0
```

Ces commandes renvoient des données privées : ne pas enregistrer leur sortie dans `public/` ou dans Git.

## Accès serveur

Après déploiement, `/api/admin/affilae?resource=profiles` utilise la session administrateur existante. Ressources autorisées : `profiles`, `feeds`, `partnerships`, `conversions`, `vouchers`, `kpis`. Paramètres : `profile`, dates ISO `from`/`to`, `metric`, pagination `limit`/`offset` selon la ressource. Aucune écriture Affilae ni URL arbitraire n'est autorisée. Réponses privées sans cache ; aucune commission n'est exposée aux visiteurs.

`feeds` fournit les catalogues disponibles et leurs URLs `urlTracked`. Les prix et les produits dépendent des catalogues proposés par chaque marchand. Cette connexion ne modifie pas automatiquement les articles : l'import des catalogues et leur correspondance avec les produits devront être configurés selon les flux disponibles. Conserver les destinations affiliées côté serveur et les liens publics sous `/go/...`.

Le bouton « Tester Affilae » utilise `resource=profiles&check=1` et ne renvoie que `{ "connected": true }` en cas de succès, sans les données du compte. Les erreurs du service distant utilisent HTTP 424 avec un message JSON et, si disponible, `upstreamStatus`. Elles ne doivent pas utiliser HTTP 502, que Cloudflare peut remplacer par une page HTML. Une session absente reste une erreur HTTP 401 ; une clé non configurée, HTTP 503.

Les données sont renvoyées au format Affilae, sans conversion monétaire globale : les commissions et revenus des KPI sont en centimes, les compteurs ne le sont pas. Consulter le schéma de chaque champ avant affichage. Le CLI et l'endpoint ne constituent pas un tableau de bord graphique.

Vérification : `node --import tsx scripts/test-affilae.ts`. Une validation réelle de la clé et des flux nécessite le secret et un compte autorisé.
