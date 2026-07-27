"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

const GENDERS = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "unisexe", label: "Unisexe" },
];

const FORMATS = [
  { value: "10ml", label: "10 ml" },
  { value: "20ml", label: "20 ml" },
];

const EMPTY = {
  name: "",
  brand: "",
  gender: "",
  format: "",
  phone: "",
};

/**
 * « Votre parfum préféré » — le client indique un parfum qu'il recherche.
 *
 * Ce n'est PAS une création de parfum ni une personnalisation : c'est une
 * demande de mise en stock. Aucun prix, aucun engagement, aucune commande.
 */
export function PerfumeRequestModal({
  open,
  onClose,
  prefill,
}: {
  open: boolean;
  onClose: () => void;
  /** Pré-remplissage quand la modale est ouverte depuis une fiche produit. */
  prefill?: { name?: string; gender?: string };
}) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

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

  // Réinitialise après fermeture, une fois l'animation terminée
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setForm(EMPTY);
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
        body: JSON.stringify(form),
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

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="perfume-request-title"
    >
      {/* Voile */}
      <button
        className="absolute inset-0 bg-[#171717]/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Fermer"
        tabIndex={-1}
      />

      <div className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-[#f7f4ee] border-t sm:border border-[#d8cbb8] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#6b6255] hover:text-[#171717] transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          <div className="px-7 sm:px-10 py-16 text-center">
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
          <form onSubmit={handleSubmit} className="px-7 sm:px-10 py-10 sm:py-12">
            <span className="block text-[10px] font-semibold tracking-[0.34em] uppercase text-[#8a7a63] mb-4">
              Demande de parfum
            </span>
            <h2
              id="perfume-request-title"
              className="font-serif text-[1.9rem] sm:text-[2.2rem] font-light uppercase tracking-[0.02em] leading-[1.1] text-[#171717]"
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

            <div className="mt-8 space-y-6">
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
                  className={fieldClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="req-brand">
                  Marque
                </label>
                <input
                  id="req-brand"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="Ex : Tom Ford"
                  className={fieldClass}
                />
              </div>

              <div>
                <span className={labelClass}>Pour</span>
                <div className="grid grid-cols-3 gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => set("gender", g.value)}
                      aria-pressed={form.gender === g.value}
                      className={`py-3 text-[12px] tracking-[0.08em] border transition-colors duration-300 ${
                        form.gender === g.value
                          ? "border-[#171717] bg-[#171717] text-white font-medium"
                          : "border-[#d8cbb8] bg-white text-[#171717] hover:border-[#8a7a63]"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={labelClass}>Format souhaité</span>
                <div className="grid grid-cols-2 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => set("format", f.value)}
                      aria-pressed={form.format === f.value}
                      className={`py-3 text-[12px] tracking-[0.08em] border transition-colors duration-300 ${
                        form.format === f.value
                          ? "border-[#171717] bg-[#171717] text-white font-medium"
                          : "border-[#d8cbb8] bg-white text-[#171717] hover:border-[#8a7a63]"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
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
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-9 w-full bg-[#171717] text-white py-5 text-[12px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 hover:bg-[#3a3a3a] disabled:opacity-60 flex items-center justify-center"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Envoyer ma demande"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
