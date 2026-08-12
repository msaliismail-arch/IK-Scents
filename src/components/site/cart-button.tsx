"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/site/cart-provider";
import { useLang } from "@/components/site/language-provider";

/**
 * Accès au panier dans la barre de navigation, avec le nombre d'articles.
 *
 * La pastille n'apparaît que lorsque le panier contient quelque chose : un
 * « 0 » permanent est du bruit, et il enlève toute valeur au chiffre quand il
 * finit par changer.
 *
 * Rien ne s'affiche tant que le panier enregistré n'a pas été relu — cela
 * évite de voir la pastille apparaître après coup à chaque chargement.
 */
export function CartButton({ className = "" }: { className?: string }) {
  const { count, loading } = useCart();
  const { t } = useLang();

  return (
    <Link
      href="/panier"
      aria-label={
        count > 0 ? `${t.cart.open} (${count})` : t.cart.open
      }
      className={`relative w-11 h-11 inline-flex items-center justify-center text-[#171717] transition-opacity duration-300 hover:opacity-60 ${className}`}
    >
      <ShoppingBag className="w-5 h-5" />
      {!loading && count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 end-0.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-[#6e2639] text-white text-[10px] font-bold tabular-nums"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
