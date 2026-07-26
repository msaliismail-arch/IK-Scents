# PUB ASSIL — bibliothèque de prompts

Prompts d'images IA pour Instagram, TikTok et les publicités ASSIL.
Écrits en anglais (les modèles obéissent mieux), à copier-coller tels quels.

---

## ⚠️ La règle qui protège le business

**Ne demande JAMAIS à une IA de générer un flacon de marque connue.**
Pas de « Dior Sauvage bottle », pas de « bottle like Baccarat Rouge ».

Deux raisons :

1. **Juridique** — reproduire un flacon ou un logo déposé, c'est de la contrefaçon
   visuelle. Meta et TikTok suppriment les pubs et suspendent les comptes pour ça.
2. **Commercial** — ton positionnement, c'est « 100% original ». Une photo générée
   d'un flacon qui n'existe pas détruit exactement ce que tu vends.

### Le bon workflow

| Ce que tu montres | Comment |
|---|---|
| **Un parfum de marque que tu vends** | **Photo réelle** du vrai flacon. L'IA sert uniquement à créer/remplacer le **fond** (Photoshop Generative Fill, Gemini édition d'image). Le produit reste intact. |
| **Ingrédients, matières, ambiances** | Génération IA complète. Aucun risque. |
| **Fonds, textures, arrière-plans de pub** | Génération IA complète. Le texte s'ajoute ensuite dans Canva. |
| **Citations, typographie** | Canva. Pas d'IA — elle écrit mal le texte. |

**Règle absolue : ne laisse jamais l'IA générer le texte d'une pub.** Fond propre
en IA, typographie dans Canva. Du texte généré par IA = amateur en trois secondes.

---

## Ta direction artistique (déduite de ton feed actuel)

| | |
|---|---|
| **Fonds** | Crème `#F7F4EE`, sable `#EFE8DC` |
| **Accents** | Champagne `#D8CBB8`, brun taupe `#8A7A63` |
| **Encre** | Noir profond `#171717` |
| **Lumière** | Naturelle, latérale, douce. Jamais de flash dur. |
| **Typographie** | Serif fin (Cormorant Garamond) pour les titres, sans-serif léger (Manrope) pour le corps |
| **Signature visuelle** | Trait botanique fin en coin, jamais au centre |
| **Ce qu'on évite** | Bleu, dégradés flashy, 3D, saturation, fonds noirs sauf effet voulu |

Cette palette est **exactement** celle du site. C'est volontaire : quelqu'un qui
voit un post puis ouvre `ik-scents.vercel.app` doit sentir la même marque.

---

## Les fichiers

| Fichier | Contenu | Pilier de contenu |
|---|---|---|
| `01-produit.md` | Fonds et scènes pour tes vraies photos de flacons | Produit |
| `02-ingredients.md` | Macro d'ingrédients (vanille, ambre, jasmin, oud…) | Éducation |
| `03-typographie.md` | Posts citation / texte | Marque |
| `04-lifestyle.md` | Portraits et scènes de vie, N&B et couleur | Désir |
| `05-stories-reels.md` | Fonds verticaux 9:16 pour stories et reels | Tous |
| `06-publicites.md` | Créas publicitaires Meta / TikTok | Conversion |

---

## Outils

| Outil | À quoi il sert vraiment |
|---|---|
| **Midjourney** | Ambiances, fonds, textures. Supporte `--ar` et `--no`. |
| **Gemini / ChatGPT Images** | Édition d'une photo existante, remplacement de fond. Le `--ar` ne marche pas : écris le ratio en toutes lettres. |
| **Photoshop Generative Fill** | Étendre ou remplacer un fond derrière un vrai flacon sans toucher au produit. C'est le workflow pro. |
| **Canva** | Assemblage final : typo, mise en page, déclinaison d'un visuel en 4 formats. |

---

## Formats

| Usage | Ratio |
|---|---|
| Post Instagram (feed) | 4:5 |
| Carrousel | 4:5 |
| Story / Reel / TikTok | 9:16 |
| Photo de profil, logo | 1:1 |
| Bannière site | 16:9 |

Le 4:5 occupe plus de hauteur dans le fil que le carré : à contenu égal, plus de
temps d'écran. Publie en 4:5 par défaut.
