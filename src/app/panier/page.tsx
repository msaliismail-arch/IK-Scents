"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/site/cart-provider";
import { useLang } from "@/components/site/language-provider";
import { fill, pick } from "@/lib/i18n";
import { resolveImg } from "@/lib/site";
import { DEFAULT_SETTINGS, computeDelivery } from "@/lib/delivery";
import { cartTotals, type Offer } from "@/lib/offers";
import type { Settings } from "@/lib/types";

/**
 * Panier et passage de commande, sur une seule page.
 *
 * ─── Pourquoi une seule page ───────────────────────────────────────────────
 *
 * Découper en « panier » puis « livraison » puis « confirmation » fait perdre
 * du monde à chaque étape. Ici le visiteur voit ce qu'il achète, ce que ça
 * coûte et où ça sera livré au même endroit. Il n'y a pas de paiement en
 * ligne à sécuriser — c'est du paiement à la livraison — donc rien n'oblige
 * à séparer.
 *
 * ─── Les prix affichés ne font pas foi ─────────────────────────────────────
 *
 * Ceux du panier viennent du navigateur : ils servent à informer. Au moment
 * d'envoyer, le serveur relit chaque prix et recalcule la livraison. Si un
 * tarif a changé depuis l'ajout au panier, c'est le prix du serveur qui
 * s'applique.
 */
export default function PanierPage() {
  const { t, lang } = useLang();
  const { lines, subtotal, setQuantity, remove, clear, loading } = useCart();

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    city: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data) setSettings({ ...DEFAULT_SETTINGS, ...data });
      })
      .catch(() => {});

    // Les offres actives, pour montrer au client ce qu'il gagne avant même de
    // commander. Le serveur les réappliquera de son côté : ici c'est de
    // l'information, pas une décision.
    fetch("/api/offers")
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => {
        if (active && Array.isArray(list)) setOffers(list);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const delivery = computeDelivery(settings, subtotal, form.city);
  const totals = cartTotals(offers, lines, delivery);
  const total = totals.total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          // Seuls le quoi et le combien partent : les prix sont relus en base.
          items: lines.map((l) => ({
            perfumeId: l.perfumeId,
            sizeLabel: l.sizeLabel,
            quantity: l.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || t.order.error);
        return;
      }

      // Le panier n'est vidé qu'une fois la commande réellement acceptée.
      clear();
      setDone(true);
    } catch {
      setError(t.order.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />

      <main className="flex-1 pt-[100px] lg:pt-[124px] pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 pointer-coarse:min-h-[44px] text-muted-foreground hover:text-bordeaux text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
            {t.cart.continue}
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-[0.03em] text-foreground mb-8">
            {t.cart.title}
          </h1>

          {done ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gold-soft border border-gold-soft flex items-center justify-center">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-2xl font-serif text-foreground mb-2">
                {t.cart.orderPlaced}
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                {fill(t.cart.orderPlacedText, { phone: form.phone })}
              </p>
              <Link
                href="/#collection"
                className="btn-gold inline-block mt-7 px-6 py-3 font-semibold tracking-wider uppercase text-sm rounded-sm"
              >
                {t.cart.continue}
              </Link>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : lines.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-champagne">
              <ShoppingBag className="w-10 h-10 text-champagne mx-auto mb-5" />
              <p className="font-serif text-xl font-light text-foreground">
                {t.cart.empty}
              </p>
              <p className="mt-2 text-[14px] text-muted-foreground font-light">
                {t.cart.emptyHint}
              </p>
              <Link
                href="/#collection"
                className="btn-gold inline-block mt-7 px-6 py-3 font-semibold tracking-wider uppercase text-sm rounded-sm"
              >
                {t.cart.continue}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* ── Les articles ── */}
              <div className="lg:col-span-3 space-y-3">
                {lines.map((l) => (
                  <article
                    key={`${l.perfumeId}-${l.sizeLabel}`}
                    className="flex gap-4 bg-card border border-champagne p-3 sm:p-4"
                  >
                    <Link
                      href={`/commander/${l.perfumeId}`}
                      className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#171717] overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolveImg(l.image)}
                        alt={pick(lang, l.perfumeName, l.perfumeNameAr)}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-lg sm:text-xl font-medium text-foreground leading-snug break-words">
                        <Link href={`/commander/${l.perfumeId}`}>
                          {pick(lang, l.perfumeName, l.perfumeNameAr)}
                        </Link>
                      </h2>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {l.sizeLabel} · {l.price} MAD {t.cart.each}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {/* 44 px de côté : ces boutons sont les plus
                            manipulés de la page, au doigt comme à la souris. */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(l.perfumeId, l.sizeLabel, l.quantity - 1)
                            }
                            aria-label={t.cart.decrease}
                            className="w-11 h-11 border border-champagne text-[#171717] flex items-center justify-center hover:border-[#171717] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span
                            aria-live="polite"
                            className="w-8 text-center text-[15px] font-medium tabular-nums"
                          >
                            {l.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(l.perfumeId, l.sizeLabel, l.quantity + 1)
                            }
                            aria-label={t.cart.increase}
                            className="w-11 h-11 border border-champagne text-[#171717] flex items-center justify-center hover:border-[#171717] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif text-xl text-bordeaux font-medium tabular-nums">
                            {l.price * l.quantity} MAD
                          </span>
                          <button
                            type="button"
                            onClick={() => remove(l.perfumeId, l.sizeLabel)}
                            aria-label={t.cart.remove}
                            className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Récapitulatif et coordonnées ── */}
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-2 space-y-5 lg:sticky lg:top-[124px] lg:self-start"
              >
                <div className="bg-gold-soft border border-gold-border p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t.cart.subtotal}
                    </span>
                    <span className="text-foreground tabular-nums">
                      {subtotal} MAD
                    </span>
                  </div>

                  {/* L'offre retenue, nommée. Un total plus bas que la somme
                      des lignes sans explication ressemble à un bug. */}
                  {totals.offer && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-bordeaux font-medium">
                        🎁 {pick(lang, totals.offer.label, totals.offer.labelAr)}
                      </span>
                      {totals.discount > 0 && (
                        <span className="text-bordeaux font-medium tabular-nums">
                          −{totals.discount} MAD
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t.cart.delivery}
                      {delivery.reason === "city" && form.city
                        ? ` (${form.city.trim()})`
                        : ""}
                    </span>
                    <span
                      className={
                        totals.delivery <= 0
                          ? "text-green-700"
                          : "text-foreground"
                      }
                    >
                      {totals.delivery <= 0
                        ? t.cart.free
                        : `${totals.delivery} MAD`}
                    </span>
                  </div>

                  {delivery.missingForFree > 0 && (
                    <p className="text-[12px] text-muted-foreground leading-relaxed">
                      {fill(t.cart.missingForFree, {
                        amount: delivery.missingForFree,
                      })}
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-gold-border pt-2.5">
                    <span className="text-muted-foreground text-sm">
                      {t.cart.total}
                    </span>
                    <span className="text-bordeaux font-serif text-xl font-medium tabular-nums">
                      {total} MAD
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-serif text-foreground pt-1">
                  {t.cart.yourDetails}
                </h2>

                {error && (
                  <div className="p-3 rounded border border-red-400/40 bg-red-500/10 text-red-600 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    {t.order.nameLabel}
                  </Label>
                  <Input
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    placeholder={t.order.namePlaceholder}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    {t.order.phoneLabel}
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="06 00 00 00 00"
                    inputMode="tel"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    {t.order.cityLabel}
                  </Label>
                  <Input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Oujda"
                  />
                  <p className="text-muted-foreground/70 text-[11px]">
                    {t.cart.deliveryHint}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    {t.order.addressLabel}
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    placeholder={t.order.addressPlaceholder}
                    required
                    rows={2}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    {t.order.noteLabel}
                  </Label>
                  <Input
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder={t.order.notePlaceholder}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full font-semibold tracking-wider uppercase py-5"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 me-2" />
                      {t.cart.checkout}
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
