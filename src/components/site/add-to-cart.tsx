"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/site/cart-provider";
import { useLang } from "@/components/site/language-provider";
import type { CartLine } from "@/lib/types";

/**
 * Bouton « Ajouter au panier ».
 *
 * ─── La confirmation ───────────────────────────────────────────────────────
 *
 * Le bouton se transforme en « Ajouté au panier » avec une coche pendant deux
 * secondes, puis redevient lui-même. Pas de fenêtre surgissante, pas de
 * redirection : le visiteur qui vient d'ajouter un décant en veut souvent un
 * autre, et l'expulser vers le panier à chaque clic casse ce mouvement. Le
 * compteur de la navbar bouge en même temps — c'est la deuxième confirmation,
 * celle qui dit où est parti le produit.
 *
 * Le retour à l'état initial est annulé si le composant disparaît, sinon React
 * signalerait une mise à jour sur un composant démonté.
 */
export function AddToCart({
  line,
  className = "",
  disabled = false,
}: {
  /** La ligne à ajouter, quantité comprise. */
  line: CartLine;
  className?: string;
  disabled?: boolean;
}) {
  const { add } = useCart();
  const { t } = useLang();
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const onClick = () => {
    add(line);
    setDone(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      // `aria-live` : un lecteur d'écran annonce le passage à « Ajouté »,
      // sinon la confirmation reste purement visuelle.
      aria-live="polite"
      className={`inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-[18px] text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 disabled:opacity-50 ${
        done
          ? "bg-[#2f5d3f] text-white"
          : "bg-[#171717] text-white hover:bg-[#3a3a3a]"
      } ${className}`}
    >
      {done ? (
        <>
          <Check className="w-4 h-4 shrink-0" />
          {t.cart.added}
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4 shrink-0" />
          {t.cart.addToCart}
        </>
      )}
    </button>
  );
}
