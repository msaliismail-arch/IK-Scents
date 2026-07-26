# Guide rapide — ASSIL

## 0. ⚠️ À FAIRE UNE SEULE FOIS — avant de lancer le site

La base de données a changé (frais de livraison). **Tant que ces deux commandes
ne sont pas passées, le site ne démarrera pas.**

```
npx prisma db push
npx prisma generate
npm run set-admin
```

`set-admin` crée ou met à jour ton compte administrateur à partir des
identifiants écrits dans `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
Le mot de passe n'est jamais stocké en clair — seul son hachage part en base.

Ensuite seulement, passe à l'étape 1.

---

## 1. Lancer le site

Ouvre un terminal **dans ce dossier** (`prjct 3`) et tape :

```
npm run dev
```

Attends que ça affiche `Ready`, puis ouvre dans ton navigateur :

```
http://localhost:3000
```

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

---

## 2. Regarder le site

**Sur ordinateur** — scrolle du haut en bas, tu dois voir dans l'ordre :

1. Navbar (ASSIL + menu + bouton COMMANDER)
2. Hero — grande photo à gauche, « DÉCOUVREZ L'ESSENCE D'ASSIL. » à droite
3. L'expérience personnalisée — 3 étapes avec photos
4. Nos essences — les parfums en grandes compositions
5. Storytelling — photo pleine largeur « Votre voyage olfactif commence ici. »
6. L'art du parfum, accessible — texte + photo + 100% / 48h / 7j/7
7. Notes olfactives — section noire
8. Grande image finale — « Une signature. Une émotion. ASSIL. »
9. Footer

**Sur téléphone** — appuie sur `F12` dans le navigateur, puis sur l'icône
téléphone/tablette en haut à gauche du panneau qui s'ouvre. Vérifie qu'on ne
peut **pas** glisser l'écran vers la droite (pas de scroll horizontal).

---

## 3. Les photos — rien à faire pour l'instant

Toutes les photos nécessaires sont **déjà dans `public/`** :

| Fichier | Où il apparaît |
|---|---|
| `hero-bottle.png` | Hero |
| `step-1.png` / `step-2.png` / `step-3.png` | L'expérience personnalisée |
| `collection-bg.png` | Storytelling pleine largeur |
| `concept.png` | L'art du parfum |
| `showcase.png` | Grande image finale |

**Le seul fichier optionnel : `floral.png`** (décoration botanique, fond
transparent). Tant qu'il n'existe pas, le site dessine une brindille en SVG à sa
place. Rien n'est cassé.

### Pour remplacer une photo par une meilleure

1. Mets ton nouveau fichier dans le dossier `public/`
2. Donne-lui **exactement le même nom** (ex. `hero-bottle.jpg` remplace
   `hero-bottle.png`, l'extension peut changer)
3. Rafraîchis la page

Aucune ligne de code à toucher.

### Les photos des parfums (section « Nos essences »)

Elles ne sont pas dans `public/`. Elles viennent de la base de données :
va sur `http://localhost:3000/admin` pour les modifier.

---

## 4. Frais de livraison (nouveau)

Dans l'admin (`http://localhost:3000/admin`), onglet **Livraison** :

| Champ | À quoi ça sert |
|---|---|
| **Prix pour tout le Maroc** | Le tarif par défaut. `0` = livraison offerte partout. |
| **Livraison offerte à partir de** | Optionnel. Ex. `300` → au-dessus de 300 MAD, livraison gratuite. Vide = désactivé. |
| **Villes avec un prix différent** | Les exceptions. Ex. Oujda `20`, Casablanca `40`. Une ville à `0` = gratuite. |

Le client voit le détail sur la page de commande :
**Sous-total → Livraison → Total**. Si un seuil de gratuité est actif, on lui
affiche aussi combien il lui manque pour l'obtenir.

Le montant est **recalculé sur le serveur** au moment de la commande — personne
ne peut le trafiquer depuis son navigateur. Il est ensuite enregistré avec la
commande et visible dans l'onglet **Commandes**.

---

## 5. Sécurité — ce qui a été corrigé

| Faille | Avant | Maintenant |
|---|---|---|
| **Secret de session** | Valeur codée en dur dans le code publié sur GitHub — n'importe qui pouvait fabriquer un jeton admin | `NEXTAUTH_SECRET` obligatoire, dans `.env` non versionné. L'app refuse de démarrer sans lui |
| **Données clients** | `GET /api/orders` public : noms, téléphones, adresses de tous les clients | Réservé à l'admin connecté |
| **Catalogue** | Créer / modifier / supprimer un parfum sans être connecté | Réservé à l'admin connecté |
| **Frais de livraison** | Modifiables par n'importe qui | Réservé à l'admin connecté |
| **Upload d'images** | Ouvert à tous — n'importe qui pouvait remplir ton stockage Supabase | Réservé à l'admin connecté |
| **Brouillons** | `?all=true` exposait les parfums non publiés | Réservé à l'admin connecté |
| **`/api/seed`** | Appelée publiquement à chaque visite, créait un admin avec un mot de passe par défaut connu | Désactivée, remplacée par `npm run set-admin` |
| **`/api/auth/login`** | Vérifiait les mots de passe sans limite de tentatives (bruteforce) | Désactivée, tout passe par NextAuth |
| **Journaux** | Les emails de connexion étaient écrits dans les logs | Supprimés |

### Gérer les comptes admin

```
npm run admins              # liste les comptes admin en base
npm run admins -- --purge   # supprime tous les admins sauf ADMIN_EMAIL
npm run set-admin           # crée ou met à jour le compte de .env
```

⚠️ **Un ancien compte `admin@assil.ma` existe peut-être encore.** Son mot de
passe par défaut était écrit dans le code publié : n'importe qui l'ayant lu
peut se connecter. Vérifie avec `npm run admins` et supprime-le.

### Ce qu'il te reste à faire

1. **Change le mot de passe admin.** Celui d'aujourd'hui a été écrit dans une
   conversation — considère-le comme connu. Modifie `ADMIN_PASSWORD` dans
   `.env`, puis relance `npm run set-admin`.
2. **En production**, ajoute les mêmes variables (`NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` avec l'URL réelle en https, `ADMIN_*`) dans les réglages de
   ton hébergeur. **Ne mets jamais `.env` sur GitHub** — il est déjà ignoré.
3. **Vérifie que le dépôt est privé** si les clés Supabase ont déjà été
   poussées un jour.

⚠️ Il n'y a **pas encore de limite de tentatives de connexion**. Sur un site à
faible trafic le risque est modéré, mais c'est le prochain point à traiter.

---

## 6. Si le design ne te plaît pas

Pour revenir à la version d'avant :

```
git checkout src/app/page.tsx src/app/globals.css src/components/site/
```

---

## 7. Publier en ligne

```
git add .
git commit -m "Refonte design ASSIL"
git push origin main
```
