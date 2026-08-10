/**
 * Réglages du carrousel d'accueil.
 *
 * La durée vit ici plutôt que dans le composant : l'espace admin l'affiche au
 * gérant (« chaque photo reste X secondes »), et deux valeurs écrites à deux
 * endroits finissent toujours par diverger.
 */

/** Durée d'affichage de chaque visuel, en millisecondes. */
export const SLIDE_MS = 2000;

/** La même durée en secondes, pour les textes de l'interface. */
export const SLIDE_SECONDS = Math.round(SLIDE_MS / 100) / 10;
