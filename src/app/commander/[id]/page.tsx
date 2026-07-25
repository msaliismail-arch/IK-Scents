"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SideFlorals } from "@/components/site/botanical";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { resolveImg } from "@/lib/site";
import type { Perfume, Size } from "@/lib/types";

export default function CommanderPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";

  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [sizeLabel, setSizeLabel] = useState("");
  const [quantity, setQuantity] = useState(1);
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

  const sizes: Size[] = perfume?.sizes ?? [];
  const selectedSize = sizes.find((s) => s.label === sizeLabel) ?? sizes[0];
  const unitPrice = Number.parseFloat(selectedSize?.price ?? "0") || 0;
  const total = unitPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfume || !selectedSize) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          phone: form.phone,
          address: form.address,
          city: form.city,
          note: form.note,
          perfumeId: perfume.id,
          perfumeName: perfume.name,
          sizeLabel: selectedSize.label,
          price: selectedSize.price,
          quantity,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue. Réessayez.");
        setSubmitting(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col page-bg relative overflow-hidden">
      <SideFlorals />
      <Navbar />
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/#collection"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la collection
          </Link>

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : !perfume ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">Parfum introuvable.</p>
              <Link
                href="/#collection"
                className="inline-block mt-4 text-gold hover:underline"
              >
                Voir la collection
              </Link>
            </div>
          ) : done ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gold-soft border border-gold-soft flex items-center justify-center">
                <Check className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-2xl font-serif text-foreground mb-2">Merci !</h1>
              <p className="text-muted-foreground font-light leading-relaxed">
                Votre commande de <strong>{perfume.name}</strong> (
                {selectedSize?.label} × {quantity}) a bien été enregistrée. Nous
                vous contacterons au {form.phone} pour confirmer la livraison.
              </p>
              <Link
                href="/#collection"
                className="btn-gold inline-block mt-6 px-6 py-3 font-semibold tracking-wider uppercase text-sm rounded-sm"
              >
                Continuer mes achats
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="aspect-[3/4] max-w-sm rounded-lg overflow-hidden bg-muted border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveImg(perfume.image)}
                    alt={perfume.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-serif text-foreground mt-5">
                  {perfume.name}
                </h1>
                <p className="text-muted-foreground font-light mt-2 leading-relaxed">
                  {perfume.description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-serif text-foreground">
                  Passer commande
                </h2>

                {error && (
                  <div className="p-3 rounded border border-red-400/40 bg-red-500/10 text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm tracking-wider">
                    Taille (ml)
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setSizeLabel(s.label)}
                        className={`px-3 py-2 text-xs border transition-all duration-200 rounded-sm ${
                          s.label === sizeLabel
                            ? "border-gold-soft bg-gold-soft text-gold"
                            : "border-border text-muted-foreground hover:border-gold-soft"
                        }`}
                      >
                        {s.label} · {s.price} MAD
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground text-sm tracking-wider">
                    Quantité
                  </Label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded border border-border text-muted-foreground hover:border-gold-soft flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-foreground w-6 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded border border-border text-muted-foreground hover:border-gold-soft flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-5">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm tracking-wider">
                      Nom complet *
                    </Label>
                    <Input
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm tracking-wider">
                        Téléphone *
                      </Label>
                      <Input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="06 00 00 00 00"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm tracking-wider">
                        Ville
                      </Label>
                      <Input
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        placeholder="Oujda"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm tracking-wider">
                      Adresse de livraison *
                    </Label>
                    <Textarea
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Quartier, rue, n°..."
                      required
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm tracking-wider">
                      Note (optionnel)
                    </Label>
                    <Input
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      placeholder="Précisions..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gold-soft border border-gold-soft rounded-lg">
                  <span className="text-muted-foreground text-sm">
                    Total (paiement à la livraison)
                  </span>
                  <span className="text-gold font-serif text-lg">
                    {total > 0 ? `${total} MAD` : "—"}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !selectedSize}
                  className="btn-gold w-full font-semibold tracking-wider uppercase hover:shadow-lg hover:shadow-[#c9a96e]/30 transition-all duration-300 py-5"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Confirmer la commande
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
