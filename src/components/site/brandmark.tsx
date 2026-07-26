import { ADisc } from "@/components/site/mark";
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
  showMark = true,
  variant = "light",
  className = "",
}: {
  /** diamètre du disque en px — tout le reste s'y accorde */
  size?: number;
  showName?: boolean;
  /** false : uniquement le nom, sans le disque */
  showMark?: boolean;
  /** "light" : sur fond clair · "dark" : sur fond sombre */
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: showMark ? Math.round(size * 0.34) : 0 }}
    >
      {/*
        Le A est découpé dans le disque — un vrai trou, pas une lettre posée
        dessus. Le fond de la page se voit au travers, donc le monogramme
        reste juste quel que soit ce qu'il y a derrière.
      */}
      {showMark && (
        <ADisc
          className={`shrink-0 ${dark ? "text-[#f7f4ee]" : "text-[#171717]"}`}
          style={{ width: size, height: size }}
        />
      )}

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
