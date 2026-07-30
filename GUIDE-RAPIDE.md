# Guide rapide — ASSIL

## 0. ⚠️ À FAIRE UNE SEULE FOIS — avant de lancer le site

La base de données a changé (frais de livraison). **Tant que ces deux commandes
ne sont pas passées, le site ne démarrera pas.**

```
npx prisma db push
npx prisma generate
npm run set-admin
```

> À relancer **à chaque fois** que le schéma change (`prisma/schema.prisma`).

### Si `prisma db push` refuse de se connecter

Le pooler Supabase coupe parfois. Dans ce cas, ouvre
**Supabase → SQL Editor → New query**, colle ce bloc et clique **Run**.
Il contient **toutes** les colonnes ajoutées depuis le début, et il est sans
risque : `IF NOT EXISTS` partout, tu peux le relancer autant de fois que tu veux.

```sql
-- Parfums
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "brand"         TEXT NOT NULL DEFAULT '';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "serialNumber"  TEXT;
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "batchCode"     TEXT NOT NULL DEFAULT '';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "officialUrl"   TEXT NOT NULL DEFAULT '';
-- Un numéro de série ne peut appartenir qu'à un seul flacon.
-- NULL est autorisé plusieurs fois : les parfums sans numéro ne se gênent pas.
CREATE UNIQUE INDEX IF NOT EXISTS "Perfume_serialNumber_key"
  ON "Perfume"("serialNumber");

ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "family"        TEXT NOT NULL DEFAULT '';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "notes"         TEXT NOT NULL DEFAULT '';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "availability"  TEXT NOT NULL DEFAULT 'disponible';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "gender"        TEXT NOT NULL DEFAULT '';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "discount"      TEXT NOT NULL DEFAULT '0';
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "discountUntil" TIMESTAMP(3);
ALTER TABLE "Perfume" ADD COLUMN IF NOT EXISTS "isPack"        BOOLEAN NOT NULL DEFAULT false;

-- Commandes
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "deliveryPrice" TEXT NOT NULL DEFAULT '0';
-- Copie figée des infos d'authenticité au moment de la commande
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "brand"        TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "serialNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "officialUrl"  TEXT NOT NULL DEFAULT '';

-- Réglages du site (livraison)
CREATE TABLE IF NOT EXISTS "Settings" (
  "id"                 TEXT NOT NULL DEFAULT 'main',
  "deliveryPrice"      TEXT NOT NULL DEFAULT '0',
  "freeDeliveryFrom"   TEXT NOT NULL DEFAULT '',
  "deliveryCitiesJson" TEXT NOT NULL DEFAULT '[]',
  "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- Demandes de parfum (« Votre parfum préféré »)
CREATE TABLE IF NOT EXISTS "PerfumeRequest" (
  "id"        TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "brand"     TEXT NOT NULL DEFAULT '',
  "gender"    TEXT NOT NULL DEFAULT '',
  "format"    TEXT NOT NULL DEFAULT '',
  "phone"     TEXT NOT NULL,
  "status"    TEXT NOT NULL DEFAULT 'new',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PerfumeRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "PerfumeRequest_status_idx" ON "PerfumeRequest"("status");

-- Annonces
CREATE TABLE IF NOT EXISTS "Announcement" (
  "id"        TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT NOT NULL DEFAULT '',
  "url"       TEXT NOT NULL DEFAULT '',
  "linkLabel" TEXT NOT NULL DEFAULT '',
  "active"    BOOLEAN NOT NULL DEFAULT true,
  "position"  INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Announcement_active_position_idx"
  ON "Announcement"("active", "position");

ALTER TABLE "PerfumeRequest" ADD COLUMN IF NOT EXISTS "quantity"     INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "PerfumeRequest" ADD COLUMN IF NOT EXISTS "customerName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "PerfumeRequest" ADD COLUMN IF NOT EXISTS "address"      TEXT NOT NULL DEFAULT '';
ALTER TABLE "PerfumeRequest" ADD COLUMN IF NOT EXISTS "city"         TEXT NOT NULL DEFAULT '';
ALTER TABLE "PerfumeRequest" ADD COLUMN IF NOT EXISTS "postalCode"   TEXT NOT NULL DEFAULT '';
```

Ensuite `npx prisma generate` (celui-ci n'a pas besoin de la base).

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

## 4 bis. « Votre parfum préféré »

Le bouton du Hero ouvre un formulaire où le client indique le parfum qu'il
**recherche** — ce n'est ni une commande ni une création de parfum.

Les demandes arrivent dans l'admin, onglet **Demandes** : nom du parfum, marque,
homme/femme/unisexe, format 10 ou 20 ml, téléphone.

**C'est ta meilleure source d'information pour le stock.** Le parfum qui revient
le plus souvent est celui à acheter en premier — tu sais qu'il est déjà demandé
avant de sortir un dirham.

### Numéro WhatsApp

Le lien WhatsApp du footer n'apparaît que si tu renseignes le numéro dans
`src/lib/site.ts` :

```ts
export const WHATSAPP_NUMBER = "2126XXXXXXXX"; // sans + ni espaces
```

---

## 4 ter. Authenticité — numéro de série et QR code

### Ce que le système fait, et ce qu'il ne fait pas

**Aucune marque de parfum (Dior, Lancôme, Prada…) ne propose de service public
permettant de vérifier un numéro de série.** Ça n'existe pas. Un QR code qui
ouvrirait `dior.com` ne prouverait donc rien du tout — n'importe qui peut créer
un lien vers Dior.

Le système installé fait autre chose, et de plus utile :

```
Flacon original  →  tu relèves son numéro  →  QR code
                                               ↓
                              assilparfums.store/verifier/LE-NUMERO
                                               ↓
                    photo du flacon · code de lot · deux vérifications
                    indépendantes que le client fait LUI-MÊME
```

### Les champs, dans l'admin

| Champ | Ce que tu y mets |
|---|---|
| **Marque** | Ex. `Lancôme` |
| **Numéro de série du flacon** | Recopié **exactement** du flacon original. Unique : deux parfums ne peuvent pas le partager. |
| **Code de lot** | Le petit code sous le flacon (ex. `3F01`) |
| **Page officielle de la marque** | L'URL du produit chez la marque. Vérifie-la avant d'enregistrer. |

⚠️ **N'invente jamais un numéro.** Un numéro faux est pire que pas de numéro :
le jour où un client le vérifie, tu perds tout — et c'est exactement le
reproche que tu fais aux vendeurs de contrefaçon. Pas de numéro sous la main ?
Laisse vide, le bloc se masque tout seul.

### Le code de lot, c'est lui qui compte

C'est la **seule** vérification réellement indépendante. Le client clique
« Vérifier le code de lot » et arrive sur CheckFresh, qui lui donne la date de
fabrication du flacon. Un code qui ne se décode pas est un signal fort de
contrefaçon — c'est aussi **ton** outil au moment d'acheter chez un fournisseur.

### Où ça s'affiche

- **Fiche produit** — bloc « Authenticité & provenance » sous les notes
- **Page `/verifier/[numéro]`** — la cible du QR, publique
- **Admin → Produits** — numéro sous chaque ligne + boutons : voir le QR,
  copier l'URL, ouvrir le site officiel
- **Admin → Commandes** — dès qu'une commande passe à **Confirmé**, sa fiche
  d'authenticité apparaît (marque, format, numéro, QR, lien officiel)

Le numéro d'une commande est une **copie** faite au moment de la commande :
rien n'est généré à la confirmation, et modifier le parfum plus tard ne
réécrit pas l'historique.

---

## 4 quater. Annonces

Onglet **Annonces** dans l'admin. Chaque annonce a un titre, un détail
facultatif, un lien facultatif, un interrupteur et un ordre.

**Deux emplacements, une seule saisie :**

| Où | Ce qui s'affiche |
|---|---|
| Section « Annonces » de l'accueil, **entre le hero et la collection** | Toutes les annonces actives, en cartes |
| Bandeau bordeaux en haut du site | **Le titre de la première annonce active** (le plus petit `Ordre`) |

Le bandeau assure la visibilité dès l'arrivée ; la section donne le détail au
moment où le visiteur décide s'il descend. Écrire l'annonce une fois suffit.

Aucune annonce active = ni bandeau ni section. Rien ne reste vide à l'écran.

Le visiteur peut fermer le bandeau : on s'en souvient, mais la mémoire est liée
au **titre**. Change le titre et le bandeau réapparaît chez tout le monde.

### Une variable à ajouter

Pour que le QR encode la bonne adresse dès le rendu serveur, ajoute dans
`.env` **et** dans les variables Vercel :

```
NEXT_PUBLIC_SITE_URL="https://assilparfums.vercel.app"
```

Sans elle, le QR se génère quand même — juste une fraction de seconde plus
tard, une fois la page chargée.

### La formulation, et pourquoi elle est prudente

Le site écrit « Décant transvasé d'un flacon original acheté par ASSIL » et
non « Produit certifié authentique ». Trois raisons :

1. Le numéro appartient au **flacon source**, pas au décant reçu. Deux clients
   du même parfum verront le même numéro : si le texte ne l'explique pas, ça
   ressemble à une fraude.
2. Une affirmation d'authenticité produite automatiquement par ton propre site
   t'engage seul. Si un fournisseur te refile un faux, c'est **ton** site qui
   aura écrit « original » (loi 31-08 sur la protection du consommateur).
3. La mention de non-affiliation est affichée partout où une marque est citée.
   C'est ce qui sépare « voici d'où vient ce décant » de « cette marque
   garantit ce produit ».

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
