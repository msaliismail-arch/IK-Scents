"use client";

import { useState } from "react";
import { useInView } from "@/components/site/reveal";

const EXTS = ["png", "jpg", "jpeg", "webp"];

/**
 * Slot image éditorial. `name` = nom de fichier sans extension (ex. "hero-bottle"),
 * le fichier vit dans /public. Les extensions png / jpg / jpeg / webp sont testées
 * dans l'ordre — déposer une nouvelle photo avec le même nom suffit à la remplacer,
 * quelle que soit son extension.
 *
 * L'image reste invisible tant qu'elle n'a pas chargé : sans cela, le navigateur
 * affiche brièvement une icône « image cassée » à chaque extension testée avant
 * la bonne. Le repère « Image à ajouter » disparaît dès qu'une image charge.
 *
 * La photo d'origine n'est jamais altérée : seuls `fit`, `position` et le ratio
 * du cadre changent le cadrage.
 */
export function Img({
  name,
  alt,
  className = "",
  ratio = "aspect-[4/5]",
  fit = "cover",
  position = "center",
  reveal = true,
  zoomOnHover = false,
  priority = false,
}: {
  name: string;
  alt: string;
  className?: string;
  ratio?: string;
  fit?: "cover" | "contain";
  /** valeur CSS object-position, ex. "center 30%" */
  position?: string;
  reveal?: boolean;
  zoomOnHover?: boolean;
  priority?: boolean;
}) {
  const [i, setI] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  const exhausted = i >= EXTS.length;

  const anim = reveal ? `img-reveal ${inView ? "is-in" : ""}` : "";
  const zoom = zoomOnHover ? "zoom-hover" : "";

  return (
    <div
      ref={ref}
      className={`${ratio} ${className} ${anim} ${zoom} relative w-full overflow-hidden bg-[#efe8dc]`}
    >
      {/* Repère affiché seulement tant qu'aucun fichier n'a chargé */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center border border-dashed border-champagne">
          <span className="text-[10px] tracking-[0.22em] uppercase text-[#8a7a63]">
            Image à ajouter
          </span>
          <code className="text-[11px] text-[#5c5344] font-mono break-all">
            public/{name}.png
          </code>
        </div>
      )}

      {!exhausted && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          // Change de clé à chaque extension : React remonte l'élément au lieu
          // de réutiliser un nœud déjà marqué en erreur par le navigateur.
          key={EXTS[i]}
          src={`/${name}.${EXTS[i]}`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoaded(true)}
          onError={() => setI((v) => v + 1)}
          style={{ objectPosition: position }}
          className={`relative w-full h-full transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${fit === "contain" ? "object-contain" : "object-cover"}`}
        />
      )}
    </div>
  );
}
