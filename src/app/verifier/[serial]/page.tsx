"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, SearchX, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AuthenticityBlock } from "@/components/site/authenticity-block";
import { BRAND, resolveImg } from "@/lib/site";
import { useLang } from "@/components/site/language-provider";
import { genderText, fill } from "@/lib/i18n";

type VerifiedPerfume = {
  id: string;
  name: string;
  brand: string;
  image: string;
  family: string;
  notes: string;
  gender: string;
  serialNumber: string | null;
  batchCode: string;
  officialUrl: string;
  createdAt: string;
};

/**
 * Page de vérification — la cible du QR code.
 *
 * Un client qui scanne arrive ici sans rien connaître du site. La page doit
 * donc répondre en premier à sa seule question : « ce numéro correspond-il
 * bien à quelque chose de réel chez ASSIL ? »
 *
 * Elle n'affiche aucune donnée de commande ni de client : l'API sous-jacente
 * ne renvoie que les champs du parfum.
 */
export default function VerifierPage({
  params,
}: {
  params: Promise<{ serial: string }>;
}) {
  const { t } = useLang();
  const { serial } = use(params);
  const decoded = decodeURIComponent(serial);

  const [perfume, setPerfume] = useState<VerifiedPerfume | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/verify/${encodeURIComponent(decoded)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        setPerfume(data?.found ? data.perfume : null);
      })
      .catch(() => {
        if (active) setPerfume(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [decoded]);

  const sexe = genderText(t, perfume?.gender);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />

      <main className="flex-1 pt-[100px] lg:pt-[124px] pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 pointer-coarse:min-h-[44px] text-muted-foreground hover:text-bordeaux text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            {t.verify.back}
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-4 h-4 text-bordeaux shrink-0" />
            <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-bordeaux">
              {t.verify.eyebrow}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.03em] text-foreground">
            {t.verify.title}
          </h1>
          <p className="mt-3 font-mono text-[15px] tracking-[0.08em] text-muted-foreground break-all">
            {decoded}
          </p>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-bordeaux animate-spin" />
            </div>
          ) : !perfume ? (
            <div className="mt-10 border border-dashed border-champagne bg-card px-6 py-16 text-center">
              <SearchX className="w-10 h-10 text-champagne mx-auto mb-5" />
              <p className="font-serif text-xl font-light text-foreground">
                {fill(t.verify.notFound, { brand: BRAND })}
              </p>
              <p className="mt-3 max-w-md mx-auto text-[14px] font-light leading-relaxed text-muted-foreground">
                {t.verify.notFoundHint}
              </p>
              <Link
                href="/#contact"
                className="btn-bordeaux inline-block mt-7 px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {t.verify.contact}
              </Link>
            </div>
          ) : (
            <div className="mt-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 sm:gap-8 items-start">
                <div className="bg-[#171717] p-2 max-w-[160px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImg(perfume.image)}
                    alt={perfume.name}
                    className="block w-full h-auto"
                  />
                </div>

                <div className="min-w-0">
                  {perfume.brand && (
                    <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-muted-foreground mb-2">
                      {perfume.brand}
                    </p>
                  )}
                  <h2 className="font-serif text-2xl font-light text-foreground">
                    {perfume.name}
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {sexe && (
                      <span className="chip-champagne px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-sm">
                        {sexe}
                      </span>
                    )}
                    {perfume.family && (
                      <span className="chip-bordeaux px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-sm">
                        {perfume.family}
                      </span>
                    )}
                  </div>

                  {perfume.notes && (
                    <p className="mt-4 text-[13.5px] font-light leading-relaxed text-muted-foreground">
                      <span className="block text-[10px] font-bold tracking-[0.24em] uppercase text-bordeaux mb-1.5">
                        {t.verify.mainNotes}
                      </span>
                      {perfume.notes}
                    </p>
                  )}
                </div>
              </div>

              <AuthenticityBlock perfume={perfume} variant="full" />

              <p className="text-[12.5px] font-light leading-relaxed text-muted-foreground">
                {fill(t.verify.disclaimer, { brand: BRAND })}
              </p>

              <Link
                href={`/commander/${perfume.id}`}
                className="btn-bordeaux inline-block px-7 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {t.verify.seeDecant}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
