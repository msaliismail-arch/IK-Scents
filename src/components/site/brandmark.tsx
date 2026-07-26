import { AMark } from "@/components/site/mark";
import { BRAND } from "@/lib/site";

/**
 * Signature ASSIL : le monogramme A dans un disque, suivi du nom.
 *
 * L'écart entre le disque et le nom est volontairement proportionnel au
 * diamètre (0,34×) et non fixé en centimètres : un logo n'a pas de taille
 * physique sur un écran, et un écart figé à 1,5 cm dissocierait les deux
 * éléments au lieu de les lier. Ici ils restent lus comme un seul bloc,
 * quelle que soit la taille d'affichage.
 */
export function Brandmark({
  size = 48,
  showName = true,
  variant = "light",
  className = "",
}: {
  /** diamètre du disque en px — tout le reste s'y accorde */
  size?: number;
  showName?: boolean;
  /** "light" : sur fond clair · "dark" : sur fond sombre */
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: Math.round(size * 0.34) }}
    >
      {/*
        Disque clair, lettre sombre — comme l'avatar Instagram.
        L'inverse (A blanc sur disque noir) ferme optiquement la lettre : le
        contrepoinçon devient noir et se confond avec le disque, la lettre
        paraît pleine. Sur la navbar blanche, un filet fin suffit à détacher
        le disque du fond.
      */}
      <span
        className="rounded-full flex items-center justify-center shrink-0 bg-white"
        style={{
          width: size,
          height: size,
          boxShadow: dark ? "none" : "inset 0 0 0 1px #171717",
        }}
      >
        <AMark
          className="text-[#171717]"
          style={{ width: size * 0.5, height: size * 0.5 }}
        />
      </span>

      {showName && (
        <span
          className={`font-serif font-semibold leading-none ${
            dark ? "text-[#f7f4ee]" : "text-[#171717]"
          }`}
          style={{
            fontSize: Math.round(size * 0.56),
            letterSpacing: "0.24em",
            // compense l'espacement ajouté après la dernière lettre
            marginRight: `-0.24em`,
          }}
        >
          {BRAND}
        </span>
      )}
    </span>
  );
}
