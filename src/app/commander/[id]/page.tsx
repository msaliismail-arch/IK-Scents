"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AuthenticityBlock } from "@/components/site/authenticity-block";
import { AddToCart } from "@/components/site/add-to-cart";
import { Label } from "@/components/ui/label";
import { resolveImg } from "@/lib/site";
import { resolveAvailability } from "@/lib/availability";
import { priceOf } from "@/lib/pricing";
import { useLang } from "@/components/site/language-provider";
import { genderText, pick } from "@/lib/i18n";
import type { Perfume, Size } from "@/lib/types";

export default function CommanderPage() {
  const { t, lang } = useLang();
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [sizeLabel, setSizeLabel] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`/api/perfumes/${id}`);
        if (!res.ok) {
          if (active) setPerfume(null);
          return;
        }
        const data: Perfume = await res.json();
        if (!active) return;
        setPerfume(data);
        const preset =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("taille")
            : null;
        const first = data.sizes?.[0]?.label ?? "";
        setSizeLabel(
          preset && data.sizes?.some((s) => s.label === preset) ? preset : first
        );
      } catch {
        if (active) setPerfume(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    if (id) load();
    return () => {
      active = false;
    };
  }, [id]);

  const stock = resolveAvailability(perfume?.availability);
  const sizes: Size[] = perfume?.sizes ?? [];
  const selectedSize = sizes.find((s) => s.label === sizeLabel) ?? sizes[0];
  // Même calcul que sur la page d'accueil et que côté serveur.
  const priceView = priceOf(selectedSize ?? {});
  const unitPrice = priceView.final;
  const subtotal = unitPrice * quantity;
  const sexe = genderText(t, perfume?.gender);

  // Contenu rédigé par l'admin : version arabe si elle existe, français sinon.
  const name = pick(lang, perfume?.name, perfume?.nameAr);
  const description = pick(lang, perfume?.description, perfume?.descriptionAr);
  const notes = pick(lang, perfume?.notes, perfume?.notesAr);
  const family = pick(lang, perfume?.family, perfume?.familyAr);

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />
      {/* La navbar fixe mesure 76 px sur téléphone et 92 px à partir de
          `lg` : `pt-28` laissait 20 px de respiration sur grand écran et
          collait le titre. */}
      <main className="flex-1 pt-[100px] lg:pt-[124px] pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 pointer-coarse:min-h-[44px] text-muted-foreground hover:text-gold text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            {t.order.back}
          </Link>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : !perfume ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">{t.order.notFound}</p>
              <Link
                href="/#collection"
                className="inline-block mt-4 text-gold hover:underline"
              >
                {t.order.seeCollection}
              </Link>
            </div>
          ) : !stock.orderable ? (
            <div className="max-w-md mx-auto text-center py-16">
              <h1 className="text-2xl font-serif text-foreground mb-3">
                {name}
              </h1>
              <p className="text-muted-foreground font-light leading-relaxed">
                {stock.value === "bientot"
                  ? t.order.soonTitle
                  : t.order.outTitle}
              </p>
              <p className="text-muted-foreground font-light leading-relaxed mt-3">
                {t.order.tellUs}
              </p>
              <Link
                href="/#collection"
                className="btn-gold inline-block mt-7 px-6 py-3 font-semibold tracking-wider uppercase text-sm rounded-sm"
              >
                {t.order.seeCollection}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="aspect-[3/4] max-w-[280px] sm:max-w-sm mx-auto md:mx-0 rounded-lg overflow-hidden bg-muted border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImg(perfume.image)}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-serif text-foreground mt-5">
                  {name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {sexe && (
                    <span className="chip-champagne px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-sm">
                      {sexe}
                    </span>
                  )}
                  {family && (
                    <span className="chip-bordeaux px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-sm">
                      {family}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground font-light mt-3 leading-relaxed">
                  {description}
                </p>
                {notes && (
                  <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                    <span className="block text-[10px] font-bold tracking-[0.24em] uppercase text-bordeaux mb-1.5">
                      {t.order.mainNotes}
                    </span>
                    {notes}
                  </p>
                )}

                {/* Provenance du flacon source. Le bloc se masque tout seul
                    quand aucune information d'authenticité n'a été saisie. */}
                <AuthenticityBlock perfume={perfume} />
              </div>

              {/*
                Le passage en caisse a quitté cette page : il vit désormais sur
                /panier, où le client voit l'ensemble de sa commande. Ici il ne
                fait qu'une chose — choisir un format et l'ajouter.
              */}
              <div className="space-y-5">
                <h2 className="text-lg font-serif text-foreground">
                  {t.order.sizeLabel}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, i) => {
                    const v = priceOf(s);
                    const active = s.label === sizeLabel;
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setSizeLabel(s.label)}
                        aria-pressed={active}
                        className={`inline-flex items-center px-4 py-2.5 pointer-coarse:min-h-[44px] text-[13px] border transition-colors duration-300 rounded-sm ${
                          active
                            ? "chip-bordeaux font-semibold"
                            : "border-border bg-card text-muted-foreground hover:border-bordeaux"
                        }`}
                      >
                        {s.label} ·{" "}
                        {v.hasDiscount ? (
                          <>
                            <span className="line-through opacity-60 mx-1">
                              {v.original}
                            </span>
                            {v.final} MAD
                          </>
                        ) : (
                          <>{v.final} MAD</>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-5">
                  <Label className="text-muted-foreground text-sm tracking-wider">
                    {t.order.quantityLabel}
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label={t.cart.decrease}
                      className="w-11 h-11 rounded border border-border text-muted-foreground hover:border-gold-soft flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="text-foreground w-8 text-center tabular-nums"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label={t.cart.increase}
                      className="w-11 h-11 rounded border border-border text-muted-foreground hover:border-gold-soft flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gold-soft border border-gold-border rounded-lg flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                    {t.cart.subtotal}
                  </span>
                  <span className="text-bordeaux font-serif text-xl font-medium tabular-nums">
                    {subtotal} MAD
                  </span>
                </div>

                <AddToCart
                  className="w-full"
                  disabled={!selectedSize}
                  line={{
                    perfumeId: perfume.id,
                    perfumeName: perfume.name,
                    perfumeNameAr: perfume.nameAr,
                    image: perfume.image,
                    sizeLabel: selectedSize?.label ?? "",
                    price: unitPrice,
                    quantity,
                  }}
                />

                <Link
                  href="/panier"
                  className="block text-center text-[11px] font-semibold tracking-[0.18em] uppercase text-bordeaux hover:underline underline-offset-4 pointer-coarse:min-h-[44px] inline-flex items-center justify-center w-full"
                >
                  {t.cart.open}
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
