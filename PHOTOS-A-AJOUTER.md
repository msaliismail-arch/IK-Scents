# Photos à ajouter — ASSIL

**Où les déposer :** `prjct 3/public/`
Le nom doit être **exactement** celui indiqué. L'extension peut être `.png`, `.jpg`, `.jpeg` ou `.webp` — le site les teste automatiquement.
Tant qu'une image manque, le site affiche un cadre pointillé avec le nom du fichier attendu.

### ✅ Déjà en place — et où chaque photo est utilisée

| Fichier | Section du site |
|---|---|
| `step-1` / `step-2` / `step-3` | 03 — L'expérience personnalisée (3 étapes) |
| `collection-bg` | 05 — Storytelling pleine largeur |
| `concept` | 06 — L'art du parfum, accessible |
| `showcase` | 08 — Grande image finale « Une signature » |

Les photos des parfums de la section **04 — Nos essences** viennent de la base
de données (espace admin), pas de `public/`.

**Pour remplacer une photo :** déposez le nouveau fichier dans `public/` avec
exactement le même nom (l'extension peut changer). Aucune modification de code
n'est nécessaire.

### ⏳ Optionnel
- `floral` — décoration botanique des coins (**fond transparent obligatoire**).
  En son absence, le site affiche une brindille dessinée au trait, générée en
  SVG. Rien n'est cassé tant que le fichier n'existe pas.

---

## 0. `floral.png` — décoration botanique des coins
**Format :** carré 1:1, **fond transparent (PNG)**, min. 800 × 800 px
**Prompt Gemini :**
> Elegant minimal botanical line art illustration. A delicate branch with fine leaves, small dried flowers and slender stems, drawn in thin single-weight lines, muted taupe brown color (#8a7a63), refined and airy, luxury editorial style, arranged as a corner ornament flowing from the top-left. Transparent background, PNG, no text, no frame, no background color. Square 1:1, high resolution.

*La même image sert pour les deux coins (elle est retournée automatiquement).*

---

## 1. ~~`hero-bottle`~~ — retirée du site

Le hero n'affiche plus de photo : titre, texte et boutons occupaient tout
l'écran d'un téléphone avant même que l'image ne soit chargée. Il est
désormais purement typographique.

Le fichier `public/hero-bottle.png` peut être supprimé — plus rien ne le
lit.

---

## 2. `step-1` — Parfums originaux
**Format :** paysage 4:3, min. 1200 × 900 px
**Prompt Gemini :**
> Minimalist editorial still life, horizontal. Two sealed original designer perfume bottles in their cellophane-wrapped boxes on a soft cream linen surface, warm beige plaster wall behind. Soft natural window light, gentle shadows, muted neutral tones, premium authentic feel, no visible brand names, lots of negative space. Horizontal 4:3, high resolution.

---

## 3. `step-2` — Décantage soigné
**Format :** paysage 4:3, min. 1200 × 900 px
**Prompt Gemini :**
> Minimalist editorial still life, horizontal. Small empty glass decant vials of 5ml and 10ml lined up on a cream marble surface next to a glass pipette and a larger perfume bottle, amber liquid being transferred. Clean, precise, soft natural light, warm neutral palette, luxury apothecary aesthetic. Horizontal 4:3, high resolution.

---

## 4. `step-3` — Livraison chez vous
**Format :** paysage 4:3, min. 1200 × 900 px
**Prompt Gemini :**
> Minimalist editorial still life, horizontal. A small cream kraft parcel box tied with a thin beige ribbon, a 10ml glass decant vial resting beside it, and a folded card, on a soft linen surface. Warm natural light, elegant packaging aesthetic, cream and taupe palette, no text. Horizontal 4:3, high resolution.

---

## 5. `concept.jpg` — grande photo section "Le Concept"
**Format :** portrait/vertical, min. 1200 × 1500 px
**Prompt Gemini :**
> Editorial lifestyle photograph, vertical. A calm perfume atelier corner: a cream linen table with two glass perfume bottles, dried botanicals in a ceramic vase, and soft shadows from a nearby window on a warm beige wall. Natural daylight, minimalist luxury aesthetic, cream and taupe palette, no text. Vertical 4:5.

---

## 6. `showcase.jpg` — bandeau large (coffret)
**Format :** panoramique 16:9 ou plus large, min. 1920 × 800 px
**Prompt Gemini :**
> Luxury flat-lay product photograph on a white marble surface, wide horizontal. On the left a clear glass perfume bottle with black cap and a small white label reading "ASSIL". In the middle a matte black square gift box with a gold letter "A" monogram. On the right a folded white card with elegant serif text "VOTRE VOYAGE OLFACTIF". Soft natural light, subtle shadows, premium editorial packaging photography, cream and black palette. Wide 16:9, high resolution.

---

## Rappel
Après avoir déposé les fichiers dans `public/` :

```
git add .
git commit -m "Ajout des photos ASSIL"
git push origin main
```
