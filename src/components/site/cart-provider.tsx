"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "assill-panier";

/** Deux lignes sont le même article si c'est le même parfum ET le même format. */
const sameLine = (a: CartLine, b: { perfumeId: string; sizeLabel: string }) =>
  a.perfumeId === b.perfumeId && a.sizeLabel === b.sizeLabel;

type CartValue = {
  lines: CartLine[];
  /** Nombre total d'articles, quantités comprises — pour la pastille de la navbar. */
  count: number;
  /** Somme des lignes, hors livraison. */
  subtotal: number;
  add: (line: CartLine) => void;
  setQuantity: (perfumeId: string, sizeLabel: string, quantity: number) => void;
  remove: (perfumeId: string, sizeLabel: string) => void;
  clear: () => void;
  /** true tant que le panier enregistré n'a pas été relu. */
  loading: boolean;
};

const CartContext = createContext<CartValue | null>(null);

/**
 * Panier d'achat.
 *
 * ─── Où vivent les données ─────────────────────────────────────────────────
 *
 * Dans le navigateur, pas en base. Le site n'a pas de comptes clients : créer
 * une table de paniers imposerait d'identifier des visiteurs anonymes, de
 * gérer leur expiration et d'accumuler des paniers jamais validés. Le stockage
 * local suffit, et le panier survit à la fermeture de l'onglet.
 *
 * ─── Ce que le panier ne décide pas ────────────────────────────────────────
 *
 * Le prix qu'il retient sert UNIQUEMENT à l'affichage. Au moment de commander,
 * le serveur relit chaque prix en base : un panier vieux de trois jours ne
 * permet pas d'acheter au tarif d'avant-hier, et un panier trafiqué ne permet
 * pas d'acheter à 1 MAD.
 *
 * ─── Hydratation ───────────────────────────────────────────────────────────
 *
 * `localStorage` n'existe pas au rendu serveur. On démarre donc sur un panier
 * vide — identique côté serveur et côté client — puis on relit le contenu
 * enregistré une fois monté. `loading` permet à la navbar de ne pas afficher
 * « 0 » une fraction de seconde avant le vrai chiffre.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : [];
      if (Array.isArray(saved)) {
        // Le contenu vient du disque du visiteur : il peut être d'une version
        // précédente du site, ou avoir été bricolé. On ne garde que les lignes
        // exploitables plutôt que de faire planter la page.
        setLines(
          saved.filter(
            (l): l is CartLine =>
              l &&
              typeof l.perfumeId === "string" &&
              typeof l.sizeLabel === "string" &&
              typeof l.quantity === "number"
          )
        );
      }
    } catch {
      // Stockage refusé ou JSON corrompu : on repart d'un panier vide.
    }
    setLoading(false);
  }, []);

  // Écrit à chaque changement, mais jamais avant d'avoir lu : sans ce garde,
  // le premier rendu écraserait le panier enregistré par un tableau vide.
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Sans stockage, le panier vaut pour la visite en cours.
    }
  }, [lines, loading]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(l, line));
      // Le même parfum au même format ajouté deux fois n'ouvre pas une
      // deuxième ligne : il incrémente la première.
      if (existing) {
        return prev.map((l) =>
          sameLine(l, line)
            ? { ...l, quantity: Math.min(99, l.quantity + line.quantity) }
            : l
        );
      }
      return [...prev, { ...line, quantity: Math.min(99, line.quantity) }];
    });
  }, []);

  const setQuantity = useCallback(
    (perfumeId: string, sizeLabel: string, quantity: number) => {
      setLines((prev) =>
        // Descendre à zéro retire la ligne : c'est ce que le visiteur veut
        // dire, et laisser une ligne à 0 dans un panier n'a aucun sens.
        quantity <= 0
          ? prev.filter((l) => !sameLine(l, { perfumeId, sizeLabel }))
          : prev.map((l) =>
              sameLine(l, { perfumeId, sizeLabel })
                ? { ...l, quantity: Math.min(99, quantity) }
                : l
            )
      );
    },
    []
  );

  const remove = useCallback((perfumeId: string, sizeLabel: string) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, { perfumeId, sizeLabel })));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const { count, subtotal } = useMemo(
    () => ({
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
    }),
    [lines]
  );

  return (
    <CartContext.Provider
      value={{ lines, count, subtotal, add, setQuantity, remove, clear, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Accès au panier.
 * Hors du fournisseur, renvoie un panier vide inerte plutôt que de lever une
 * erreur : un composant d'affichage ne doit pas casser une page.
 */
export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (ctx) return ctx;
  return {
    lines: [],
    count: 0,
    subtotal: 0,
    add: () => {},
    setQuantity: () => {},
    remove: () => {},
    clear: () => {},
    loading: true,
  };
}
