"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Minus, Plus, X } from "lucide-react";
import { GENDERS, genderLabel } from "@/lib/pricing";
import { DEFAULT_SETTINGS, computeDelivery } from "@/lib/delivery";
import type { Settings } from "@/lib/types";

export type RequestFormat = { label: string; price: number };

/**
 * Formats proposés quand la demande ne vient pas d'un parfum précis.
 * Dès qu'elle part d'une fiche produit, ce sont les décants réels de l'admin
 * qui s'affichent à la place.
 */
const FALLBACK_FORMATS: RequestFormat[] = [
  { label: "5 ml", price: 0 },
  { label: "10 ml", price: 0 },
  { label: "20 ml", price: 0 },
  { label: "Flacon complet", price: 0 },
];

const EMPTY = {
  name: "",
  gender: "",
  format: "",
  customerName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

export type RequestPrefill = {
  name?: string;
  gender?: string;
  /** Décants réellement définis par l'admin, avec leur prix remisé */
  formats?: RequestFormat[];
};

/**
 * « Votre parfum préféré » — le client indique un parfum qu'il recherche.
 *
 * Ce n'est PAS une création de parfum ni une personnalisation : c'est une
 * demande de mise en stock. Aucun prix, aucun engagement, aucune commande.
 * Les coordonnées sont demandées pour pouvoir livrer dès l'arrivée du flacon.
 */
export function PerfumeRequestModal({
  open,
  onClose,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  prefill?: RequestPrefill;
}) {
  const [form, setForm] = useState(EMPTY);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // Le parfum est imposé quand la demande part d'une fiche produit : le client
  // ne doit pas pouvoir en changer le nom ni le genre, sinon la demande ne
  // correspond plus au flacon sur lequel il a cliqué.
  const locked = Boolean(prefill?.name);

  // Les formats viennent des décants de l'admin, pas d'une liste figée
  const formats =
    prefill?.formats && prefill.formats.length > 0
      ? prefill.formats
      : FALLBACK_FORMATS;

  // Le prix suit le format choisi. Tant que rien n'est sélectionné, on affiche
  // le plus bas — c'est ce que le client a vu sur la fiche produit.
  const prices = formats.map((f) => f.price).filter((p) => p > 0);
  const selected = formats.find((f) => f.label === form.format);
  const unitPrice =
    selected && selected.price > 0
      ? selected.price
      : prices.length > 0
        ? Math.min(...prices)
        : 0;

  // Le sous-total suit la quantité, sinon le seuil de livraison offerte serait
  // calculé sur un seul exemplaire alors que le client en demande plusieurs.
  const subtotal = unitPrice * quantity;

  // La ville saisie peut porter une exception de livraison : le total se
  // recalcule à chaque frappe, comme sur la page de commande.
  const livraison = computeDelivery(settings, subtotal, form.city);
  const villeException =
    form.city.trim() !== "" && livraison.reason === "city";

  // Fermeture au clavier + blocage du scroll de fond
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    // Ouverte depuis un parfum précis : on reprend son nom, pour que la
    // demande arrive identifiée côté admin plutôt qu'anonyme.
    if (prefill?.name) {
      setForm((f) => ({
        ...f,
        name: f.name || prefill.name || "",
        gender: f.gender || prefill.gender || "",
      }));
    }

    firstFieldRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prefill?.name, prefill?.gender]);

  // Frais de livraison, pour annoncer un prix complet dès la demande
  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d) setSettings({ ...DEFAULT_SETTINGS, ...d });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [open]);

  // Réinitialise après fermeture, une fois l'animation terminée
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setForm(EMPTY);
      setQuantity(1);
      setError("");
      setDone(false);
    }, 400);
    return () => clearTimeout(t);
  }, [open]);

  const set = (key: keyof typeof EMPTY, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Une erreur est survenue. Réessayez.");
        return;
      }
      setDone(true);
    } catch {
      setError("Erreur de connexion. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const fieldClass =
    "w-full border border-[#d8cbb8] bg-white px-4 py-3 text-[14px] text-[#171717] placeholder:text-[#a89c88] focus:outline-none focus:border-[#171717] transition-colors duration-300";
  const labelClass =
    "block text-[10px] font-semibold tracking-[0.24em] uppercase text-[#6b6255] mb-2.5";
  const legendClass =
    "block text-[10px] font-bold tracking-[0.28em] uppercase text-bordeaux mb-5";
  const choiceClass = (active: boolean) =>
    `py-3 text-[12px] tracking-[0.06em] border transition-colors duration-300 ${
      active
        ? "border-[#171717] bg-[#171717] text-white font-medium"
        : "border-[#d8cbb8] bg-white text-[#171717] hover:border-[#8a7a63]"
    }`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perfume-request-title"
    >
      <button
        className="absolute inset-0 bg-[#171717]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fermer"
        tabIndex={-1}
      />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#f7f4ee] border-t sm:border border-[#d8cbb8] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#6b6255] hover:text-[#171717] transition-colors z-10"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="px-6 sm:px-10 py-16 text-center">
            <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[#d8cbb8] bg-white flex items-center justify-center">
              <Check className="w-7 h-7 text-[#8a7a63]" />
            </div>
            <h2 className="font-serif text-2xl font-light uppercase tracking-[0.04em] text-[#171717] mb-4">
              Merci !
            </h2>
            <p className="text-[#6b6255] text-[14.5px] font-light leading-[1.85] max-w-sm mx-auto">
              Nous avons bien reçu votre demande. Nous vous contacterons dès que
              votre parfum préféré sera disponible.
            </p>
            <button
              onClick={onClose}
              className="mt-9 bg-[#171717] text-white px-8 py-4 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#3a3a3a]"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="px-6 sm:px-10 py-9 sm:py-12"
          >
            <span className="block text-[10px] font-semibold tracking-[0.34em] uppercase text-[#8a7a63] mb-4">
              Demande de parfum
            </span>
            <h2
              id="perfume-request-title"
              className="font-serif text-[1.7rem] sm:text-[2.2rem] font-light uppercase tracking-[0.02em] leading-[1.1] text-[#171717] pr-10"
            >
              Quel est votre
              <br />
              parfum préféré ?
            </h2>
            <p className="mt-5 text-[#6b6255] text-[14px] font-light leading-[1.8]">
              {prefill?.name
                ? `Nous vous prévenons dès que ${prefill.name} sera de nouveau disponible chez ASSIL.`
                : "Dites-nous le parfum que vous recherchez. Nous vous prévenons dès qu’il est disponible chez ASSIL."}
            </p>

            {error && (
              <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                {error}
              </div>
            )}

            {/* ── Le parfum ── */}
            <div className="mt-9">
              <span className={legendClass}>Le parfum</span>

              <div className="space-y-6">
                <div>
                  <label className={labelClass} htmlFor="req-name">
                    Nom du parfum *
                  </label>
                  <input
                    id="req-name"
                    ref={firstFieldRef}
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Ex : Oud Wood"
                    required
                    readOnly={locked}
                    aria-readonly={locked}
                    className={`${fieldClass} ${
                      locked
                        ? "bg-[#efe8dc] text-[#4a4236] cursor-default focus:border-[#d8cbb8]"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <span className={labelClass}>Pour</span>
                  {locked ? (
                    <p className="px-4 py-3 border border-[#d8cbb8] bg-[#efe8dc] text-[14px] text-[#4a4236]">
                      {genderLabel(form.gender) || "Non précisé"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => set("gender", g.value)}
                          aria-pressed={form.gender === g.value}
                          className={choiceClass(form.gender === g.value)}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <span className={labelClass}>Format souhaité</span>
                  <div className="grid grid-cols-2 gap-2">
                    {formats.map((f) => (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => set("format", f.label)}
                        aria-pressed={form.format === f.label}
                        className={choiceClass(form.format === f.label)}
                      >
                        <span className="uppercase">{f.label}</span>
                        {f.price > 0 && (
                          <span className="opacity-70"> · {f.price} MAD</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Combien d'exemplaires. Un client qui en veut trois le dit
                    tout de suite : c'est autant de flacons à prévoir. */}
                <div>
                  <span className={labelClass}>Quantité</span>
                  <div className="inline-flex items-center border border-[#d8cbb8] bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Retirer un exemplaire"
                      className="w-12 h-12 flex items-center justify-center text-[#171717] hover:bg-[#efe8dc] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span
                      aria-live="polite"
                      className="w-14 text-center text-[15px] font-medium text-[#171717] tabular-nums"
                    >
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      aria-label="Ajouter un exemplaire"
                      className="w-12 h-12 flex items-center justify-center text-[#171717] hover:bg-[#efe8dc] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Le client ── */}
            <div className="mt-10 pt-9 border-t border-[#d8cbb8]">
              <span className={legendClass}>Vos coordonnées</span>

              <div className="space-y-6">
                <div>
                  <label className={labelClass} htmlFor="req-customer">
                    Nom complet *
                  </label>
                  <input
                    id="req-customer"
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                    placeholder="Votre nom"
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="req-phone">
                    Téléphone / WhatsApp *
                  </label>
                  <input
                    id="req-phone"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="06 00 00 00 00"
                    inputMode="tel"
                    required
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="req-address">
                    Adresse
                  </label>
                  <input
                    id="req-address"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Quartier, rue, n°..."
                    className={fieldClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} htmlFor="req-city">
                      Ville
                    </label>
                    <input
                      id="req-city"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Oujda"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="req-postal">
                      Code postal
                    </label>
                    <input
                      id="req-postal"
                      value={form.postalCode}
                      onChange={(e) => set("postalCode", e.target.value)}
                      placeholder="60000"
                      inputMode="numeric"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {unitPrice > 0 && (
              <div className="mt-9 border border-[#d8cbb8] bg-white px-4 py-4 space-y-2 text-[13.5px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b6255]">
                    {selected ? selected.label : "À partir de"}
                    {quantity > 1 ? ` × ${quantity}` : ""}
                  </span>
                  <span className="font-semibold text-bordeaux">
                    {subtotal} MAD
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6b6255]">
                    Livraison
                    {villeException ? ` (${form.city.trim()})` : ""}
                  </span>
                  <span className="text-[#171717]">
                    {livraison.free ? "Offerte" : `${livraison.price} MAD`}
                  </span>
                </div>

                {livraison.missingForFree > 0 && (
                  <p className="text-[11.5px] text-[#6b6255] leading-relaxed">
                    Plus que {livraison.missingForFree} MAD pour la livraison
                    offerte.
                  </p>
                )}

                <div className="flex items-center justify-between border-t border-[#efe8dc] pt-2">
                  <span className="text-[#6b6255]">Total indicatif</span>
                  <span className="font-serif text-lg text-bordeaux">
                    {subtotal + livraison.price} MAD
                  </span>
                </div>

                <p className="text-[11.5px] text-[#8a7a63] font-light leading-relaxed pt-1">
                  Tarif du jour, à confirmer au moment de la disponibilité.
                  {!form.city.trim() &&
                    " Indiquez votre ville : la livraison peut changer."}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-[#171717] text-white py-5 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#3a3a3a] disabled:opacity-60 flex items-center justify-center"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Envoyer ma demande"
              )}
            </button>

            <p className="mt-4 text-[12px] text-[#8a7a63] font-light leading-relaxed text-center">
              Aucun engagement : nous vous contactons simplement dès que le
              parfum est disponible.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
