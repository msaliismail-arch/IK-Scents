"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, ScanLine } from "lucide-react";
import { QrCode } from "@/components/site/qr-code";
import {
  authenticityOf,
  NON_AFFILIATION,
  verifyUrl,
} from "@/lib/authenticity";
import { BRAND } from "@/lib/site";

/**
 * Bloc « Authenticité & provenance ».
 *
 * ─── Pourquoi ces mots-là ──────────────────────────────────────────────────
 *
 * ASSIL vend des décants : le numéro de série est celui du FLACON SOURCE, pas
 * du petit flacon livré. Le texte le dit explicitement, sinon un client qui
 * compare deux commandes du même parfum verrait le même numéro et croirait à
 * une fraude.
 *
 * Aucune marque ne propose de vérification publique par numéro de série. Le QR
 * ne prétend donc rien certifier : il mène à la fiche de vérification ASSIL,
 * qui renvoie vers deux contrôles indépendants que le client fait lui-même.
 * La mention de non-affiliation est affichée systématiquement.
 */
export function AuthenticityBlock({
  perfume,
  variant = "product",
}: {
  perfume: {
    serialNumber?: string | null;
    batchCode?: string | null;
    officialUrl?: string | null;
  };
  /** "product" = encart sur la fiche ; "full" = page de vérification */
  variant?: "product" | "full";
}) {
  // L'origine doit être identique côté serveur et côté navigateur, sinon
  // l'hydratation diverge. Sans variable publique configurée, on attend le
  // montage pour lire l'origine réelle plutôt que d'en deviner une.
  const [origin, setOrigin] = useState(
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "")
  );
  useEffect(() => {
    if (!origin) setOrigin(window.location.origin);
  }, [origin]);

  const auth = authenticityOf(perfume, origin);
  if (!auth.has) return null;

  const qrTarget = auth.serial && origin ? verifyUrl(auth.serial, origin) : "";
  const internalHref = auth.serial
    ? `/verifier/${encodeURIComponent(auth.serial)}`
    : "";

  return (
    <section
      className={
        variant === "full"
          ? "border border-champagne bg-card p-6 sm:p-9"
          : "mt-8 border border-champagne bg-card p-5 sm:p-6"
      }
      aria-labelledby="authenticite-titre"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <ShieldCheck className="w-4 h-4 text-bordeaux shrink-0" />
        <h2
          id="authenticite-titre"
          className="text-[10px] font-bold tracking-[0.28em] uppercase text-bordeaux"
        >
          Authenticité &amp; provenance
        </h2>
      </div>

      <dl className="space-y-5">
        {auth.serial && (
          <div>
            <dt className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
              Numéro de série du flacon source
            </dt>
            <dd className="font-mono text-[15px] sm:text-base tracking-[0.08em] text-foreground break-all">
              {auth.serial}
            </dd>
          </div>
        )}

        {auth.batchCode && (
          <div>
            <dt className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
              Code de lot
            </dt>
            <dd className="font-mono text-[15px] tracking-[0.08em] text-foreground">
              {auth.batchCode}
            </dd>
          </div>
        )}

        <div>
          <dt className="text-[10px] font-semibold tracking-[0.22em] uppercase text-muted-foreground mb-1.5">
            Statut
          </dt>
          <dd className="text-[14.5px] font-light leading-relaxed text-foreground">
            Décant transvasé d&apos;un flacon original acheté par {BRAND}.
          </dd>
        </div>
      </dl>

      {qrTarget && (
        <div className="mt-8 pt-7 border-t border-champagne flex flex-col sm:flex-row sm:items-center gap-6">
          <QrCode
            value={qrTarget}
            href={internalHref}
            size={variant === "full" ? 168 : 136}
            title={`Vérifier le numéro de série ${auth.serial}`}
          />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-foreground">
              <ScanLine className="w-3.5 h-3.5 text-bordeaux shrink-0" />
              Scannez pour vérifier
            </p>
            <p className="mt-2.5 text-[13.5px] font-light leading-relaxed text-muted-foreground">
              Ce code mène à la fiche de vérification de ce flacon. Vous pouvez
              aussi cliquer dessus.
            </p>
          </div>
        </div>
      )}

      {(auth.officialUrl || auth.batchUrl) && (
        <div className="mt-7 pt-6 border-t border-champagne flex flex-wrap gap-3">
          {auth.batchUrl && (
            <a
              href={auth.batchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-foreground hover:border-bordeaux transition-colors duration-500"
            >
              Vérifier le code de lot
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          )}
          {auth.officialUrl && (
            <a
              href={auth.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-foreground hover:border-bordeaux transition-colors duration-500"
            >
              Site officiel de la marque
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          )}
        </div>
      )}

      <p className="mt-6 text-[11.5px] font-light leading-relaxed text-muted-foreground/80">
        {NON_AFFILIATION}
      </p>
    </section>
  );
}
