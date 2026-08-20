"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, ShieldCheck, TriangleAlert } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BRAND } from "@/lib/site";
import { useLang } from "@/components/site/language-provider";

/**
 * Page /verif — cible du QR code imprimé sur le bon de livraison.
 *
 * ─── Ce que cette page fait, et ce qu'elle ne fait pas ──────────────────────
 *
 * Le QR d'un bon encode un numéro de bon (ASL-XXXXXX-JJMM) et sa date. Ces
 * numéros sont créés par le logiciel de gestion de stock, hors du site : la
 * base du site ne les connaît pas. La page ne peut donc PAS affirmer « cette
 * commande existe » — elle ne le sait pas, et le prétendre serait mentir au
 * client qui scanne.
 *
 * Ce qu'elle vérifie réellement : que le numéro a bien la forme d'un bon
 * ASSILL, et que le mois et le jour inscrits dans le numéro correspondent à la
 * date du bon. Un numéro tapé au hasard ou recopié de travers échoue ici.
 *
 * Pour l'authenticité d'un flacon, c'est /verifier/[serial] qui répond : cette
 * route-là interroge la base des parfums. Le lien est donné plus bas.
 */

const SERIAL_RE = /^ASL-[A-Z0-9]{6}-(\d{2})(\d{2})$/;

type Check =
  | { state: "empty" }
  | { state: "bad" }
  | { state: "ok"; serial: string; date: Date | null };

function inspect(serial: string | null, dateStr: string | null): Check {
  const s = (serial || "").trim().toUpperCase();
  if (!s) return { state: "empty" };

  const m = SERIAL_RE.exec(s);
  if (!m) return { state: "bad" };

  const day = Number(m[1]);
  const month = Number(m[2]);
  if (day < 1 || day > 31 || month < 1 || month > 12) return { state: "bad" };

  /* La date passée en paramètre doit confirmer le jour et le mois du numéro. */
  let date: Date | null = null;
  if (dateStr) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return { state: "bad" };
    if (d.getDate() !== day || d.getMonth() + 1 !== month) return { state: "bad" };
    date = d;
  }

  return { state: "ok", serial: s, date };
}

function VerifContent() {
  const { lang } = useLang();
  const params = useSearchParams();
  const ar = lang === "ar";

  const res = inspect(params.get("s"), params.get("d"));

  const txt = ar
    ? {
        eyebrow: "بون التسليم",
        okTitle: "بون صحيح",
        okBody: `شكراً على ثقتك ف ${BRAND}. هاد الرقم هو رقم البون ديالك — احتافظ بيه إلا بغيتي تسول علا الطلبية ديالك.`,
        badTitle: "هاد الرقم ماشي ديال بون ASSILL",
        badBody:
          "تأكد من الرقم كيفما هو مكتوب فالورقة، ولا عاود سكانّي الـ QR. إلا بقا نفس الشي، تواصل معانا.",
        emptyTitle: "ما كاين حتى رقم",
        emptyBody: "سكانّي الـ QR لي فوق البون ديالك باش توصل مباشرة لهاد الصفحة.",
        no: "رقم البون",
        on: "التاريخ",
        authTitle: "بغيتي تتأكد من أصالة العطر؟",
        authBody:
          "رقم البون كيخص الطلبية. باش تتأكد من الفلاكون بوحدو، استعمل رقم السيري ديال العطر.",
        authLink: "تأكد من عطر",
        back: "رجع للموقع",
        contact: "تواصل معانا",
      }
    : {
        eyebrow: "Bon de livraison",
        okTitle: "Bon valide",
        okBody: `Merci de votre confiance en ${BRAND}. Ce numéro est la référence de votre bon — gardez-le si vous devez nous parler de votre commande.`,
        badTitle: "Ce numéro n'est pas un bon ASSILL",
        badBody:
          "Vérifiez le numéro tel qu'il est imprimé sur le bon, ou scannez à nouveau le QR. Si le problème persiste, contactez-nous.",
        emptyTitle: "Aucun numéro fourni",
        emptyBody:
          "Scannez le QR code imprimé sur votre bon de livraison pour arriver directement sur cette page.",
        no: "Numéro du bon",
        on: "Date",
        authTitle: "Vérifier l'authenticité d'un parfum ?",
        authBody:
          "Le numéro de bon concerne la commande. Pour contrôler le flacon lui-même, utilisez le numéro de série du parfum.",
        authLink: "Vérifier un parfum",
        back: "Retour au site",
        contact: "Nous contacter",
      };

  const good = res.state === "ok";

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />

      <main className="flex-1 pt-[100px] lg:pt-[124px] pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 pointer-coarse:min-h-[44px] text-muted-foreground hover:text-bordeaux text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            {txt.back}
          </Link>

          <div className="flex items-center gap-2.5 mb-3">
            <ShieldCheck className="w-4 h-4 text-bordeaux shrink-0" />
            <span className="text-[10px] font-bold tracking-[0.28em] uppercase text-bordeaux">
              {txt.eyebrow}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.03em] text-foreground">
            {good
              ? txt.okTitle
              : res.state === "empty"
                ? txt.emptyTitle
                : txt.badTitle}
          </h1>

          {good ? (
            <div className="mt-10 space-y-8">
              <div className="border border-champagne bg-card px-6 py-10 text-center">
                <BadgeCheck className="w-10 h-10 text-bordeaux mx-auto mb-5" />

                <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-muted-foreground">
                  {txt.no}
                </p>
                <p className="mt-2 font-mono text-[19px] tracking-[0.12em] text-foreground break-all">
                  {res.serial}
                </p>

                {res.date && (
                  <>
                    <p className="mt-6 text-[10px] font-bold tracking-[0.24em] uppercase text-muted-foreground">
                      {txt.on}
                    </p>
                    <p className="mt-2 font-mono text-[15px] tracking-[0.08em] text-foreground">
                      {res.date.toLocaleDateString(ar ? "ar-MA" : "fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </>
                )}
              </div>

              <p className="text-[14px] font-light leading-relaxed text-muted-foreground">
                {txt.okBody}
              </p>

              <div className="border-t border-champagne pt-8">
                <h2 className="font-serif text-xl font-light text-foreground">
                  {txt.authTitle}
                </h2>
                <p className="mt-3 text-[13.5px] font-light leading-relaxed text-muted-foreground">
                  {txt.authBody}
                </p>
                <Link
                  href="/#collection"
                  className="btn-bordeaux inline-block mt-6 px-7 py-3.5 text-[11px] font-semibold tracking-[0.18em] uppercase"
                >
                  {txt.authLink}
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 border border-dashed border-champagne bg-card px-6 py-16 text-center">
              <TriangleAlert className="w-10 h-10 text-champagne mx-auto mb-5" />
              <p className="max-w-md mx-auto text-[14px] font-light leading-relaxed text-muted-foreground">
                {res.state === "empty" ? txt.emptyBody : txt.badBody}
              </p>
              <Link
                href="/#contact"
                className="btn-bordeaux inline-block mt-7 px-6 py-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {txt.contact}
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* useSearchParams impose une frontière Suspense au moment du build. */
export default function VerifPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <VerifContent />
    </Suspense>
  );
}
