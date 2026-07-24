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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/site/logo";
import { resolveImg } from "@/lib/site";
import type { Perfume, Order } from "@/lib/types";

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
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f4] px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#e2d3ae] bg-[#faf4e8] flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#a88a4e]" />
          </div>
          <h1 className="gold-text text-2xl font-serif">Accès Administrateur</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded border border-red-300 bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-neutral-600 text-sm">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@assil.ma"
              required
              className="border-neutral-300 focus:border-[#c9a96e]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-600 text-sm">Mot de passe</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="border-neutral-300 focus:border-[#c9a96e] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#a88a4e]"
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
            className="w-full bg-gradient-to-r from-[#997640] via-[#b8935a] to-[#d4b478] text-white font-semibold tracking-wider uppercase py-5"
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
            className="text-neutral-400 text-sm hover:text-[#a88a4e] inline-flex items-center gap-1"
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
  const [tab, setTab] = useState<"products" | "orders">("products");
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

  useEffect(() => {
    fetchPerfumes();
    fetchOrders();
  }, []);

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
    setSizes((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)));
  const addSize = () => setSizes((prev) => [...prev, { label: "", price: "" }]);
  const removeSize = (i: number) =>
    setSizes((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));

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
    <div className="min-h-screen bg-[#faf8f4]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <Badge className="bg-[#faf4e8] text-[#a88a4e] border-[#e2d3ae] hidden sm:inline-flex">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm text-neutral-500 hover:text-[#a88a4e] px-3 py-1.5"
            >
              Voir le site
            </Link>
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200 mb-6">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "products"
                ? "text-[#a88a4e] border-b-2 border-[#c9a96e]"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Package className="w-4 h-4" />
            Parfums
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "orders"
                ? "text-[#a88a4e] border-b-2 border-[#c9a96e]"
                : "text-neutral-400 hover:text-neutral-600"
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
        </div>

        {/* PRODUCTS */}
        {tab === "products" && (
          <>
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) resetForm();
                }}
                className="bg-[#faf4e8] border border-[#e2d3ae] text-[#a88a4e] hover:bg-[#f3e7cf]"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? "Annuler" : "Ajouter un parfum"}
              </Button>
            </div>

            {showForm && (
              <form
                onSubmit={handleSubmit}
                className="bg-white border border-neutral-200 rounded-lg p-5 space-y-4 mb-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-neutral-600 text-sm">Nom du parfum</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ex: 9PM by Afnan"
                      required
                      className="border-neutral-300 focus:border-[#c9a96e]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-neutral-600 text-sm">Image</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="/api/uploads/image.png"
                        required
                        className="border-neutral-300 focus:border-[#c9a96e] flex-1"
                      />
                      <label className="cursor-pointer px-3 py-2 border border-[#e2d3ae] text-[#a88a4e] hover:bg-[#faf4e8] transition-colors rounded-md flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        <span className="text-xs">{uploading ? "..." : "Upload"}</span>
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
                  <Label className="text-neutral-600 text-sm">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Sillage puissant, longue tenue..."
                    required
                    rows={3}
                    className="border-neutral-300 focus:border-[#c9a96e] resize-none"
                  />
                </div>

                {/* Sizes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-neutral-600 text-sm">
                      Tailles &amp; prix (ml)
                    </Label>
                    <Button
                      type="button"
                      onClick={addSize}
                      size="sm"
                      variant="ghost"
                      className="text-[#a88a4e] hover:bg-[#faf4e8] h-7"
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
                          className="border-neutral-300 focus:border-[#c9a96e] flex-1"
                        />
                        <Input
                          value={s.price}
                          onChange={(e) => updateSize(i, "price", e.target.value)}
                          placeholder="Prix MAD (ex: 120)"
                          className="border-neutral-300 focus:border-[#c9a96e] flex-1"
                        />
                        <Button
                          type="button"
                          onClick={() => removeSize(i)}
                          size="icon"
                          variant="ghost"
                          className="w-9 h-9 text-neutral-400 hover:text-red-500 shrink-0"
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
                    <Label className="text-neutral-600 text-sm">
                      {formData.published ? "Publié" : "Brouillon"}
                    </Label>
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#997640] via-[#b8935a] to-[#d4b478] text-white font-semibold tracking-wider uppercase"
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
                    className="w-32 h-32 object-cover border border-neutral-200 rounded"
                  />
                )}
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-[#c9a96e] animate-spin" />
              </div>
            ) : perfumes.length === 0 ? (
              <div className="text-center py-10">
                <Package className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-400">Aucun parfum ajouté</p>
              </div>
            ) : (
              <div className="space-y-2">
                {perfumes.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="flex items-center gap-3 p-3 bg-white border border-neutral-200 hover:border-[#dcc9a0] transition-colors rounded-lg"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveImg(perfume.image)}
                      alt={perfume.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-neutral-900 text-sm font-medium truncate">
                          {perfume.name}
                        </h4>
                        <Badge
                          className={`text-[10px] ${
                            perfume.published
                              ? "bg-[#faf4e8] text-[#a88a4e] border-[#e2d3ae]"
                              : "bg-neutral-100 text-neutral-400 border-neutral-200"
                          }`}
                        >
                          {perfume.published ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <p className="text-neutral-400 text-xs truncate">
                        {(perfume.sizes ?? [])
                          .map((s) => `${s.label}: ${s.price} MAD`)
                          .join(" · ") || "Aucune taille"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-neutral-400 hover:text-[#a88a4e]"
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
                        className="w-8 h-8 text-neutral-400 hover:text-[#a88a4e]"
                        onClick={() => handleEdit(perfume)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-neutral-400 hover:text-red-500"
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

        {/* ORDERS */}
        {tab === "orders" && (
          <>
            {ordersLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-[#c9a96e] animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10">
                <ClipboardList className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-neutral-400">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-white border border-neutral-200 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-neutral-900 text-sm font-medium">
                            {order.customerName}
                          </h4>
                          <a
                            href={`tel:${order.phone}`}
                            className="text-[#a88a4e] text-xs hover:underline"
                          >
                            {order.phone}
                          </a>
                        </div>
                        <p className="text-neutral-600 text-xs mt-1">
                          {order.perfumeName} — {order.sizeLabel} × {order.quantity}
                          {order.price ? ` · ${order.price} MAD/u` : ""}
                        </p>
                        <p className="text-neutral-400 text-xs mt-0.5">
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                        </p>
                        {order.note && (
                          <p className="text-neutral-400 text-xs mt-0.5 italic">
                            Note: {order.note}
                          </p>
                        )}
                        <p className="text-neutral-300 text-[10px] mt-1">
                          {new Date(order.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="bg-white border border-neutral-300 text-neutral-700 text-xs rounded px-2 py-1 focus:border-[#c9a96e] outline-none"
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
                          className="w-8 h-8 text-neutral-400 hover:text-red-500"
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
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f4]">
        <Loader2 className="w-8 h-8 text-[#c9a96e] animate-spin" />
      </div>
    );
  }

  return isAdmin ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <LoginView onLogin={handleLogin} />
  );
}
