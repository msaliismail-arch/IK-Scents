"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Shield,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Package,
  ClipboardList,
  Loader2,
  ArrowLeft,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/site/logo";
import { resolveImg } from "@/lib/site";
import { DEFAULT_SETTINGS } from "@/lib/delivery";
import type { Perfume, Order, Settings, DeliveryCity } from "@/lib/types";

type SizeRow = { label: string; price: string };

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  confirmed: "Confirmé",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
};

// ---------- LOGIN ----------
function LoginView({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Identifiants incorrects");
        setLoading(false);
        return;
      }
      await signIn("credentials", { email, password, redirect: false });
      onLogin();
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-alt px-4 relative">
      <div className="relative z-10 w-full max-w-md bg-card border border-border rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-gold-soft bg-gold-soft flex items-center justify-center">
            <Shield className="w-7 h-7 text-gold" />
          </div>
          <h1 className="gold-text text-2xl font-serif">Accès Administrateur</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded border border-red-400/40 bg-red-500/10 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@assil.ma"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Mot de passe</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="btn-gold w-full font-semibold tracking-wider uppercase py-5"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Se Connecter
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-muted-foreground text-sm hover:text-gold inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}

// ---------- DASHBOARD ----------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"products" | "orders" | "delivery">(
    "products"
  );
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const emptyForm = { name: "", description: "", image: "", published: true };
  const [formData, setFormData] = useState(emptyForm);
  const [sizes, setSizes] = useState<SizeRow[]>([{ label: "", price: "" }]);

  // --- Réglages de livraison ---
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/perfumes?all=true");
      const data = await res.json();
      setPerfumes(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data && typeof data === "object") {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch {
      /* les réglages par défaut restent en place */
    }
  };

  useEffect(() => {
    fetchPerfumes();
    fetchOrders();
    fetchSettings();
  }, []);

  const updateCity = (i: number, key: keyof DeliveryCity, value: string) =>
    setSettings((prev) => ({
      ...prev,
      deliveryCities: prev.deliveryCities.map((c, idx) =>
        idx === i ? { ...c, [key]: value } : c
      ),
    }));

  const addCity = () =>
    setSettings((prev) => ({
      ...prev,
      deliveryCities: [...prev.deliveryCities, { city: "", price: "" }],
    }));

  const removeCity = (i: number) =>
    setSettings((prev) => ({
      ...prev,
      deliveryCities: prev.deliveryCities.filter((_, idx) => idx !== i),
    }));

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          deliveryCities: settings.deliveryCities.filter(
            (c) => c.city.trim() !== ""
          ),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      } else {
        alert("Échec de l'enregistrement des réglages.");
      }
    } catch {
      alert("Erreur de connexion. Réessayez.");
    } finally {
      setSavingSettings(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setSizes([{ label: "", price: "" }]);
    setEditingId(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setFormData((prev) => ({ ...prev, image: data.url }));
    } finally {
      setUploading(false);
    }
  };

  const updateSize = (i: number, key: keyof SizeRow, value: string) =>
    setSizes((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s))
    );
  const addSize = () => setSizes((prev) => [...prev, { label: "", price: "" }]);
  const removeSize = (i: number) =>
    setSizes((prev) =>
      prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSizes = sizes.filter(
      (s) => s.label.trim() !== "" && s.price.trim() !== ""
    );
    if (cleanSizes.length === 0) {
      alert("Ajoutez au moins une taille avec un prix.");
      return;
    }
    const payload = { ...formData, sizes: cleanSizes };
    if (editingId) {
      await fetch(`/api/perfumes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/perfumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    resetForm();
    setShowForm(false);
    fetchPerfumes();
  };

  const handleEdit = (perfume: Perfume) => {
    setFormData({
      name: perfume.name,
      description: perfume.description,
      image: perfume.image,
      published: perfume.published,
    });
    setSizes(
      perfume.sizes && perfume.sizes.length > 0
        ? perfume.sizes.map((s) => ({ label: s.label, price: s.price }))
        : [{ label: "", price: "" }]
    );
    setEditingId(perfume.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce parfum ?")) return;
    await fetch(`/api/perfumes/${id}`, { method: "DELETE" });
    fetchPerfumes();
  };

  const togglePublish = async (perfume: Perfume) => {
    await fetch(`/api/perfumes/${perfume.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !perfume.published }),
    });
    fetchPerfumes();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const newOrdersCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-surface-alt relative">
      <header className="bg-background border-b border-border sticky top-0 z-40 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <Badge className="bg-gold-soft text-gold border-gold-soft hidden sm:inline-flex">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-gold px-3 py-1.5"
            >
              Voir le site
            </Link>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 border-b border-border mb-6">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "products"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" />
            Parfums
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "orders"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Commandes
            {newOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-[#b8935a] text-white font-semibold">
                {newOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("delivery")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "delivery"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="w-4 h-4" />
            Livraison
          </button>
        </div>

        {tab === "delivery" && (
          <form
            onSubmit={saveSettings}
            className="bg-card border border-border rounded-lg p-5 sm:p-6 space-y-7 max-w-2xl"
          >
            <div>
              <h2 className="font-serif text-xl text-foreground">
                Frais de livraison
              </h2>
              <p className="text-muted-foreground text-sm font-light mt-1.5 leading-relaxed">
                Ce montant s’ajoute automatiquement au total sur la page de
                commande. Il est recalculé côté serveur à chaque commande.
              </p>
            </div>

            {/* Prix par défaut */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">
                Prix pour tout le Maroc (MAD)
              </Label>
              <Input
                value={settings.deliveryPrice}
                onChange={(e) =>
                  setSettings({ ...settings, deliveryPrice: e.target.value })
                }
                placeholder="Ex : 30"
                inputMode="decimal"
              />
              <p className="text-muted-foreground/70 text-xs">
                Mettez <strong>0</strong> pour offrir la livraison à tout le
                monde.
              </p>
            </div>

            {/* Seuil de gratuité */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">
                Livraison offerte à partir de (MAD) — optionnel
              </Label>
              <Input
                value={settings.freeDeliveryFrom}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeDeliveryFrom: e.target.value,
                  })
                }
                placeholder="Ex : 300 — laissez vide pour désactiver"
                inputMode="decimal"
              />
              <p className="text-muted-foreground/70 text-xs">
                Au-dessus de ce montant, la livraison passe à 0 MAD et le client
                voit combien il lui manque pour l’obtenir.
              </p>
            </div>

            {/* Exceptions par ville */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-sm">
                  Villes avec un prix différent
                </Label>
                <Button
                  type="button"
                  onClick={addCity}
                  size="sm"
                  variant="ghost"
                  className="text-gold hover:bg-gold-soft h-7"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Ajouter une ville
                </Button>
              </div>

              {settings.deliveryCities.length === 0 ? (
                <p className="text-muted-foreground/70 text-xs py-2">
                  Aucune exception : toutes les villes paient le prix ci-dessus.
                </p>
              ) : (
                <div className="space-y-2">
                  {settings.deliveryCities.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        value={c.city}
                        onChange={(e) => updateCity(i, "city", e.target.value)}
                        placeholder="Ville (ex : Oujda)"
                        className="flex-1"
                      />
                      <Input
                        value={c.price}
                        onChange={(e) => updateCity(i, "price", e.target.value)}
                        placeholder="Prix MAD (0 = gratuit)"
                        inputMode="decimal"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => removeCity(i)}
                        size="icon"
                        variant="ghost"
                        className="w-9 h-9 text-muted-foreground hover:text-red-500 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground/70 text-xs">
                Le nom saisi par le client est comparé sans tenir compte des
                majuscules ni des accents.
              </p>
            </div>

            <div className="flex items-center gap-4 border-t border-border pt-5">
              <Button
                type="submit"
                disabled={savingSettings}
                className="btn-gold font-semibold tracking-wider uppercase"
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Enregistrer"
                )}
              </Button>
              {settingsSaved && (
                <span className="text-green-700 text-sm">
                  Réglages enregistrés.
                </span>
              )}
            </div>
          </form>
        )}

        {tab === "products" && (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) resetForm();
                }}
                className="bg-gold-soft border border-gold-soft text-gold hover:opacity-90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Annuler" : "Ajouter un parfum"}
              </Button>
            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Nom du parfum
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ex: 9PM by Afnan"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="/api/uploads/image.png"
                        required
                        className="flex-1"
                      />
                      <label className="cursor-pointer px-3 py-2 border border-gold-soft text-gold hover:bg-gold-soft transition-colors rounded-md flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        <span className="text-xs">
                          {uploading ? "..." : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Description
                  </Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Sillage puissant, longue tenue..."
                    required
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-sm">
                      Tailles &amp; prix (ml)
                    </Label>
                    <Button
                      type="button"
                      onClick={addSize}
                      size="sm"
                      variant="ghost"
                      className="text-gold hover:bg-gold-soft h-7"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Ajouter une taille
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {sizes.map((s, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Input
                          value={s.label}
                          onChange={(e) => updateSize(i, "label", e.target.value)}
                          placeholder="Ex: 5ml"
                          className="flex-1"
                        />
                        <Input
                          value={s.price}
                          onChange={(e) => updateSize(i, "price", e.target.value)}
                          placeholder="Prix MAD (ex: 120)"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removeSize(i)}
                          size="icon"
                          variant="ghost"
                          className="w-9 h-9 text-muted-foreground hover:text-red-500 shrink-0"
                          disabled={sizes.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, published: checked })
                      }
                      className="data-[state=checked]:bg-[#b8935a]"
                    />
                    <Label className="text-muted-foreground text-sm">
                      {formData.published ? "Publié" : "Brouillon"}
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="btn-gold font-semibold tracking-wider uppercase"
                  >
                    {editingId ? (
                      <>
                        <Pencil className="w-4 h-4 mr-2" />
                        Modifier
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Publier
                      </>
                    )}
                  </Button>
                </div>

                {formData.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveImg(formData.image)}
                    alt="Preview"
                    className="w-32 h-32 object-cover border border-border rounded"
                  />
                )}
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : perfumes.length === 0 ? (
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun parfum ajouté</p>
              </div>
            ) : (
              <div className="space-y-2">
                {perfumes.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="flex items-center gap-3 p-3 bg-card border border-border hover:border-gold-soft transition-colors rounded-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImg(perfume.image)}
                      alt={perfume.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-foreground text-sm font-medium truncate">
                          {perfume.name}
                        </h4>
                        <Badge
                          className={`text-[10px] ${
                            perfume.published
                              ? "bg-gold-soft text-gold border-gold-soft"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {perfume.published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs truncate">
                        {(perfume.sizes ?? [])
                          .map((s) => `${s.label}: ${s.price} MAD`)
                          .join(" · ") || "Aucune taille"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-gold"
                        onClick={() => togglePublish(perfume)}
                      >
                        {perfume.published ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-gold"
                        onClick={() => handleEdit(perfume)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-red-500"
                        onClick={() => handleDelete(perfume.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "orders" && (
          <>
            {ordersLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Aucune commande pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-foreground text-sm font-medium">
                            {order.customerName}
                          </h4>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-gold text-xs hover:underline"
                          >
                            {order.phone}
                          </a>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">
                          {order.perfumeName} — {order.sizeLabel} ×{" "}
                          {order.quantity}
                          {order.price ? ` · ${order.price} MAD/u` : ""}
                        </p>
                        <p className="text-muted-foreground/80 text-xs mt-0.5">
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                        </p>
                        {(() => {
                          const unit =
                            Number.parseFloat(order.price ?? "0") || 0;
                          const sub = unit * (order.quantity || 1);
                          const ship =
                            Number.parseFloat(order.deliveryPrice ?? "0") || 0;
                          if (sub <= 0) return null;
                          return (
                            <p className="text-foreground text-xs mt-1">
                              Sous-total {sub} MAD · Livraison{" "}
                              {ship > 0 ? `${ship} MAD` : "offerte"} ·{" "}
                              <span className="font-medium">
                                Total {sub + ship} MAD
                              </span>
                            </p>
                          );
                        })()}
                        {order.note && (
                          <p className="text-muted-foreground/80 text-xs mt-0.5 italic">
                            Note: {order.note}
                          </p>
                        )}
                        <p className="text-muted-foreground/50 text-[10px] mt-1">
                          {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="bg-background border border-border text-foreground text-xs rounded px-2 py-1 outline-none"
                        >
                          {Object.keys(STATUS_LABELS).map((k) => (
                            <option key={k} value={k}>
                              {STATUS_LABELS[k]}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-red-500"
                          onClick={() => deleteOrder(order.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---------- PAGE ----------
export default function AdminPage() {
  const { data: session, status } = useSession();
  const [localAdmin, setLocalAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocalAdmin(localStorage.getItem("assil-admin") === "true");
    setReady(true);
  }, []);

  const isAdmin = !!session?.user || localAdmin;

  const handleLogin = () => {
    setLocalAdmin(true);
    localStorage.setItem("assil-admin", "true");
  };

  const handleLogout = async () => {
    setLocalAdmin(false);
    localStorage.removeItem("assil-admin");
    await signOut({ redirect: false });
  };

  if (!ready || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return isAdmin ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <LoginView onLogin={handleLogin} />
  );
}
