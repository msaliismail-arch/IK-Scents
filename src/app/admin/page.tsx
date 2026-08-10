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
  Sparkles,
  Phone,
  QrCode as QrCodeIcon,
  Copy,
  Check,
  ExternalLink,
  X,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/site/logo";
import { QrCode } from "@/components/site/qr-code";
import { verifyUrl } from "@/lib/authenticity";
import { resolveImg } from "@/lib/site";
import { DEFAULT_SETTINGS } from "@/lib/delivery";
import {
  AVAILABILITY_OPTIONS,
  DEFAULT_AVAILABILITY,
} from "@/lib/availability";
import { GENDERS } from "@/lib/pricing";
import type {
  Perfume,
  Order,
  Settings,
  DeliveryCity,
  PerfumeRequest,
  Announcement,
} from "@/lib/types";

type SizeRow = { label: string; price: string };

/**
 * `fetch` de l'espace admin.
 *
 * Toutes les routes `/api` de l'admin répondent 401 dès que la session n'est
 * plus valable. Sans traitement, ce 401 se transformait en liste vide et en
 * enregistrement qui « ne fait rien » — l'utilisateur n'avait aucun moyen de
 * comprendre qu'il devait se reconnecter.
 *
 * On coupe donc la session côté client au premier 401 : `useSession` bascule
 * et l'écran de connexion réapparaît de lui-même.
 */
async function adminFetch(input: string, init?: RequestInit) {
  const res = await fetch(input, init);
  if (res.status === 401) {
    await signOut({ redirect: false });
  }
  return res;
}

const REQUEST_STATUS_LABELS: Record<string, string> = {
  new: "Nouvelle",
  contacted: "Client contacté",
  available: "Parfum disponible",
  closed: "Clôturée",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  confirmed: "Confirmé",
  shipped: "Expédié",
  delivered: "Livré",
  cancelled: "Annulé",
};

// ---------- LOGIN ----------
function LoginView({ notAdmin = false }: { notAdmin?: boolean }) {
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
      // Authentification unique via NextAuth : c'est lui qui vérifie le mot de
      // passe et pose le cookie de session lu ensuite par les routes API.
      // `signIn` rafraîchit la session lui-même : `useSession` bascule et la
      // page affiche le tableau de bord, sans drapeau à mémoriser ici.
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res || res.error) {
        setError("Identifiants incorrects");
      }
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
          {notAdmin && !error && (
            <div className="p-3 rounded border border-gold-border bg-gold-soft text-[13px] text-foreground text-center">
              Ce compte existe mais n’a pas les droits d’administration.
            </div>
          )}
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
  const [tab, setTab] = useState<
    "products" | "orders" | "requests" | "announcements" | "delivery"
  >("products");
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const emptyForm = {
    name: "",
    description: "",
    image: "",
    brand: "",
    // Authenticité — toujours saisis à la main, flacon en main. Rien ici n'est
    // généré automatiquement : un numéro inventé vaut moins que pas de numéro.
    serialNumber: "",
    batchCode: "",
    officialUrl: "",
    family: "",
    notes: "",
    availability: DEFAULT_AVAILABILITY as string,
    gender: "",
    discount: "",
    discountUntil: "",
    isPack: false,
    published: true,
  };
  const [formData, setFormData] = useState(emptyForm);
  const [sizes, setSizes] = useState<SizeRow[]>([{ label: "", price: "" }]);
  /** Message renvoyé par l'API (série en double, URL invalide…). */
  const [formError, setFormError] = useState("");
  /** Parfum dont on affiche le QR en grand depuis le tableau. */
  const [qrPerfume, setQrPerfume] = useState<Perfume | null>(null);
  /** Confirmation visuelle après « Copier l'URL ». */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- Réglages de livraison ---
  const [requests, setRequests] = useState<PerfumeRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // --- Annonces ---
  const emptyAnnouncement = {
    title: "",
    body: "",
    url: "",
    linkLabel: "",
    active: true,
    position: 0,
  };
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annForm, setAnnForm] = useState(emptyAnnouncement);
  const [annEditingId, setAnnEditingId] = useState<string | null>(null);
  const [annShowForm, setAnnShowForm] = useState(false);
  const [annError, setAnnError] = useState("");

  const fetchAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const res = await adminFetch("/api/announcements?all=true");
      const data = await res.json();
      setAnnouncements(Array.isArray(data) ? data : []);
    } finally {
      setAnnLoading(false);
    }
  };

  const resetAnnForm = () => {
    setAnnForm(emptyAnnouncement);
    setAnnEditingId(null);
    setAnnError("");
  };

  const saveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnError("");
    const res = annEditingId
      ? await adminFetch(`/api/announcements/${annEditingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(annForm),
        })
      : await adminFetch("/api/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(annForm),
        });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setAnnError(data.error || "Enregistrement impossible.");
      return;
    }
    resetAnnForm();
    setAnnShowForm(false);
    fetchAnnouncements();
  };

  const editAnnouncement = (a: Announcement) => {
    setAnnForm({
      title: a.title,
      body: a.body ?? "",
      url: a.url ?? "",
      linkLabel: a.linkLabel ?? "",
      active: a.active,
      position: a.position ?? 0,
    });
    setAnnEditingId(a.id);
    setAnnShowForm(true);
    setAnnError("");
  };

  const toggleAnnouncement = async (a: Announcement) => {
    await adminFetch(`/api/announcements/${a.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !a.active }),
    });
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    await adminFetch(`/api/announcements/${id}`, { method: "DELETE" });
    fetchAnnouncements();
  };

  const fetchPerfumes = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/perfumes?all=true");
      const data = await res.json();
      setPerfumes(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await adminFetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await adminFetch("/api/settings");
      const data = await res.json();
      if (data && typeof data === "object") {
        setSettings({ ...DEFAULT_SETTINGS, ...data });
      }
    } catch {
      /* les réglages par défaut restent en place */
    }
  };

  const fetchRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await adminFetch("/api/requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
    fetchOrders();
    fetchRequests();
    fetchSettings();
    fetchAnnouncements();
  }, []);

  const updateRequestStatus = async (id: string, status: string) => {
    await adminFetch(`/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchRequests();
  };

  const deleteRequest = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    await adminFetch(`/api/requests/${id}`, { method: "DELETE" });
    fetchRequests();
  };

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
      const res = await adminFetch("/api/settings", {
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
    setFormError("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await adminFetch("/api/upload", { method: "POST", body: fd });
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
    setFormError("");
    const payload = { ...formData, sizes: cleanSizes };
    const res = editingId
      ? await adminFetch(`/api/perfumes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await adminFetch("/api/perfumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    // Un numéro de série en double ou une URL invalide reviennent en erreur :
    // il faut la montrer, sinon l'admin croit avoir enregistré.
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setFormError(
        data.error || "Enregistrement impossible. Vérifiez les champs."
      );
      return;
    }

    resetForm();
    setShowForm(false);
    fetchPerfumes();
  };

  /**
   * Copie l'URL de vérification d'un parfum. C'est cette adresse qui est
   * encodée dans le QR : la coller dans un navigateur donne exactement ce que
   * verra un client qui scanne.
   */
  const copyVerifyUrl = async (perfume: Perfume) => {
    if (!perfume.serialNumber) return;
    const url = verifyUrl(perfume.serialNumber, window.location.origin);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard refusé (page non sécurisée, permission) : on montre l'URL
      // pour que l'admin puisse la copier à la main plutôt que rien.
      window.prompt("Copiez l'URL de vérification :", url);
      return;
    }
    setCopiedId(perfume.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleEdit = (perfume: Perfume) => {
    setFormData({
      name: perfume.name,
      description: perfume.description,
      image: perfume.image,
      brand: perfume.brand ?? "",
      serialNumber: perfume.serialNumber ?? "",
      batchCode: perfume.batchCode ?? "",
      officialUrl: perfume.officialUrl ?? "",
      family: perfume.family ?? "",
      notes: perfume.notes ?? "",
      availability: perfume.availability ?? DEFAULT_AVAILABILITY,
      gender: perfume.gender ?? "",
      discount:
        perfume.discount && perfume.discount !== "0" ? perfume.discount : "",
      discountUntil: perfume.discountUntil
        ? String(perfume.discountUntil).slice(0, 10)
        : "",
      isPack: Boolean(perfume.isPack),
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
    await adminFetch(`/api/perfumes/${id}`, { method: "DELETE" });
    fetchPerfumes();
  };

  const togglePublish = async (perfume: Perfume) => {
    await adminFetch(`/api/perfumes/${perfume.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !perfume.published }),
    });
    fetchPerfumes();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await adminFetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Supprimer cette commande ?")) return;
    await adminFetch(`/api/orders/${id}`, { method: "DELETE" });
    fetchOrders();
  };

  const newOrdersCount = orders.filter((o) => o.status === "new").length;
  const newRequestsCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen bg-surface-alt relative">
      <header className="bg-background border-b border-border sticky top-0 z-40 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size={36} />
            <Badge className="bg-gold-soft text-gold border-gold-soft hidden sm:inline-flex">
              Admin
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-gold px-2 sm:px-3 py-1.5 whitespace-nowrap"
            >
              Voir le site
            </Link>
            {/* Sur téléphone, « Déconnexion » en toutes lettres poussait le
                logo hors de l'en-tête : l'icône seule suffit, le libellé
                reste lisible par les lecteurs d'écran. */}
            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              aria-label="Déconnexion"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 px-2 sm:px-3"
            >
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Cinq onglets font environ 620 px : sur un téléphone la moitié
            sortait de l'écran sans aucun moyen d'y accéder. La barre défile
            désormais latéralement — `-mx-4` pour que le premier et le dernier
            onglet touchent les bords, `px-4` pour garder l'alignement. */}
        <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setTab("products")}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
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
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
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
            onClick={() => setTab("requests")}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "requests"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Demandes
            {newRequestsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-[#b8935a] text-white font-semibold">
                {newRequestsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("announcements")}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "announcements"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            Annonces
            {announcements.filter((a) => a.active).length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-[#b8935a] text-white font-semibold">
                {announcements.filter((a) => a.active).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("delivery")}
            className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm tracking-wider uppercase transition-colors flex items-center gap-2 ${
              tab === "delivery"
                ? "text-gold border-b-2 border-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Truck className="w-4 h-4" />
            Livraison
          </button>
        </div>

        {tab === "requests" && (
          <div>
            <div className="mb-6 bg-card border border-border rounded-lg p-5">
              <h2 className="font-serif text-xl text-foreground">
                Parfums recherchés par les clients
              </h2>
              <p className="text-muted-foreground text-sm font-light mt-1.5 leading-relaxed">
                Envoyés depuis « Votre parfum préféré » sur la page d&apos;accueil.
                Ce ne sont pas des commandes : c&apos;est ce que vos clients
                aimeraient trouver chez vous. Le parfum qui revient le plus
                souvent est celui à mettre en stock en priorité.
              </p>
            </div>

            {requestsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-7 h-7 text-gold animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-lg">
                <Sparkles className="w-10 h-10 text-[#cfc4b0] mx-auto mb-4" />
                <p className="text-muted-foreground font-light">
                  Aucune demande pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h4 className="font-serif text-lg text-foreground">
                          {r.name}
                        </h4>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {r.gender && (
                          <span className="px-2.5 py-1 text-[11px] tracking-wider uppercase border border-gold-border bg-gold-soft text-foreground rounded-sm">
                            {r.gender}
                          </span>
                        )}
                        {r.format && (
                          <span className="px-2.5 py-1 text-[11px] tracking-wider uppercase border border-gold-border bg-gold-soft text-foreground rounded-sm">
                            {r.format}
                          </span>
                        )}
                        {(r.quantity ?? 1) > 1 && (
                          <span className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase border border-bordeaux/30 bg-bordeaux/10 text-bordeaux rounded-sm">
                            × {r.quantity}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 space-y-1 text-sm">
                        {r.customerName && (
                          <p className="text-foreground font-medium">
                            {r.customerName}
                          </p>
                        )}
                        <a
                          href={`tel:${r.phone}`}
                          className="inline-flex items-center gap-1.5 text-gold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {r.phone}
                        </a>
                        {(r.address || r.city || r.postalCode) && (
                          <p className="text-muted-foreground">
                            {[r.address, r.postalCode, r.city]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>

                      <p className="text-muted-foreground/50 text-[10px] mt-2">
                        {new Date(r.createdAt).toLocaleString("fr-FR")}
                      </p>
                    </div>

                    <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">
                      <select
                        value={r.status}
                        onChange={(e) =>
                          updateRequestStatus(r.id, e.target.value)
                        }
                        className="bg-background border border-border rounded px-2 py-1.5 text-sm text-foreground"
                      >
                        {Object.entries(REQUEST_STATUS_LABELS).map(([v, l]) => (
                          <option key={v} value={v}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={() => deleteRequest(r.id)}
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "announcements" && (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="max-w-xl">
                <h2 className="font-serif text-xl text-foreground">Annonces</h2>
                <p className="text-muted-foreground text-sm font-light mt-1.5 leading-relaxed">
                  Affichées dans une section dédiée entre le hero et la
                  collection. <strong>La première annonce active</strong> passe
                  aussi dans le bandeau en haut du site — visible dès l’arrivée,
                  sans avoir à faire défiler.
                </p>
              </div>
              <Button
                onClick={() => {
                  setAnnShowForm((v) => !v);
                  if (!annShowForm) resetAnnForm();
                }}
                className="btn-gold shrink-0"
              >
                {annShowForm ? (
                  <>
                    <X className="w-4 h-4 mr-1.5" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Nouvelle annonce
                  </>
                )}
              </Button>
            </div>

            {annShowForm && (
              <form
                onSubmit={saveAnnouncement}
                className="bg-card border border-border rounded-lg p-5 space-y-4 mb-6 max-w-2xl"
              >
                {annError && (
                  <p className="border border-destructive/40 bg-destructive/5 text-destructive text-sm rounded-md px-3 py-2.5">
                    {annError}
                  </p>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Titre *
                  </Label>
                  <Input
                    value={annForm.title}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, title: e.target.value })
                    }
                    placeholder="Ex : −20 % sur tous les décants jusqu’au 20 août"
                    maxLength={120}
                    required
                  />
                  <p className="text-muted-foreground/70 text-xs">
                    C’est ce texte seul qui passe dans le bandeau du haut.
                    Court et concret — une date de fin fait bien plus agir
                    qu’une promesse vague.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Détail — optionnel
                  </Label>
                  <Textarea
                    value={annForm.body}
                    onChange={(e) =>
                      setAnnForm({ ...annForm, body: e.target.value })
                    }
                    placeholder="Une ou deux phrases, affichées uniquement dans la section."
                    rows={3}
                    maxLength={400}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Lien — optionnel
                    </Label>
                    <Input
                      value={annForm.url}
                      onChange={(e) =>
                        setAnnForm({ ...annForm, url: e.target.value })
                      }
                      placeholder="/#collection  ou  https://..."
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      <code>/#collection</code> envoie droit à la boutique.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Texte du bouton
                    </Label>
                    <Input
                      value={annForm.linkLabel}
                      onChange={(e) =>
                        setAnnForm({ ...annForm, linkLabel: e.target.value })
                      }
                      placeholder="En savoir plus"
                      maxLength={40}
                      disabled={!annForm.url.trim()}
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      Ignoré sans lien.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Ordre d’affichage
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={999}
                      value={annForm.position}
                      onChange={(e) =>
                        setAnnForm({
                          ...annForm,
                          position: Number(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      Le plus petit nombre passe en premier — et alimente le
                      bandeau.
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4 border border-border rounded-lg px-4 py-3">
                    <Label className="text-foreground text-sm">Active</Label>
                    <Switch
                      checked={annForm.active}
                      onCheckedChange={(v) =>
                        setAnnForm({ ...annForm, active: v })
                      }
                    />
                  </div>
                </div>

                <Button type="submit" className="btn-gold w-full">
                  {annEditingId ? "Enregistrer" : "Publier l’annonce"}
                </Button>
              </form>
            )}

            {annLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-10">
                <Megaphone className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucune annonce</p>
                <p className="text-muted-foreground/60 text-sm mt-1.5">
                  Sans annonce, la section et le bandeau ne s’affichent pas.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-w-3xl">
                {announcements.map((a, i) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-foreground text-sm font-medium">
                          {a.title}
                        </h4>
                        <Badge
                          className={`text-[10px] ${
                            a.active
                              ? "bg-gold-soft text-gold border-gold-soft"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {a.active ? "Active" : "Masquée"}
                        </Badge>
                        {a.active && i === 0 && (
                          <Badge className="text-[10px] bg-bordeaux/10 text-bordeaux border-bordeaux/30">
                            Dans le bandeau
                          </Badge>
                        )}
                      </div>
                      {a.body && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                          {a.body}
                        </p>
                      )}
                      <p className="text-muted-foreground/60 text-[11px] mt-1">
                        Ordre {a.position ?? 0}
                        {a.url ? ` · ${a.url}` : " · sans lien"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={a.active ? "Masquer" : "Afficher"}
                        className="w-8 h-8 text-muted-foreground hover:text-gold"
                        onClick={() => toggleAnnouncement(a)}
                      >
                        {a.active ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Modifier"
                        className="w-8 h-8 text-muted-foreground hover:text-gold"
                        onClick={() => editAnnouncement(a)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Supprimer"
                        className="w-8 h-8 text-muted-foreground hover:text-red-500"
                        onClick={() => deleteAnnouncement(a.id)}
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
                {formError && (
                  <p className="border border-destructive/40 bg-destructive/5 text-destructive text-sm rounded-md px-3 py-2.5">
                    {formError}
                  </p>
                )}

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

                {/* ─── Authenticité & provenance ─────────────────────────
                    Ces champs sont recopiés du flacon, jamais inventés. Le
                    numéro de série identifie le FLACON SOURCE d'où sont tirés
                    les décants — il est unique en base. */}
                <fieldset className="border border-border rounded-lg p-4 space-y-4">
                  <legend className="px-2 text-[11px] font-bold tracking-[0.2em] uppercase text-bordeaux">
                    Authenticité &amp; provenance
                  </legend>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Marque
                      </Label>
                      <Input
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        placeholder="Ex : Lancôme"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Numéro de série du flacon
                      </Label>
                      <Input
                        value={formData.serialNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            serialNumber: e.target.value,
                          })
                        }
                        placeholder="Recopiez-le exactement"
                        className="font-mono"
                      />
                      <p className="text-muted-foreground/70 text-xs">
                        Relevé sur le flacon original. <strong>Jamais
                        inventé</strong> : un numéro faux se retourne contre
                        vous. Unique — deux parfums ne peuvent pas le partager.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Code de lot
                      </Label>
                      <Input
                        value={formData.batchCode}
                        onChange={(e) =>
                          setFormData({ ...formData, batchCode: e.target.value })
                        }
                        placeholder="Ex : 3F01"
                        className="font-mono"
                      />
                      <p className="text-muted-foreground/70 text-xs">
                        Le petit code sous le flacon. C&apos;est la seule chose
                        que le client peut vérifier lui-même : elle donne la
                        date de fabrication.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Page officielle de la marque
                      </Label>
                      <Input
                        type="url"
                        value={formData.officialUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            officialUrl: e.target.value,
                          })
                        }
                        placeholder="https://www.lancome.fr/..."
                      />
                      <p className="text-muted-foreground/70 text-xs">
                        Vérifiez le lien avant de l&apos;enregistrer. Vide = pas
                        de bouton « site officiel » sur la fiche.
                      </p>
                    </div>
                  </div>

                  {formData.serialNumber.trim() && (
                    <div className="flex items-start gap-4 pt-2 border-t border-border">
                      <QrCode
                        value={verifyUrl(
                          formData.serialNumber,
                          typeof window !== "undefined"
                            ? window.location.origin
                            : ""
                        )}
                        size={104}
                        title="Aperçu du QR code"
                      />
                      <p className="text-muted-foreground/70 text-xs leading-relaxed pt-1">
                        Aperçu du QR code. Il mène à la fiche de vérification de
                        ce numéro, pas au site de la marque — aucune marque ne
                        propose de vérification publique par numéro de série.
                      </p>
                    </div>
                  )}
                </fieldset>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Famille olfactive
                    </Label>
                    <Input
                      value={formData.family}
                      onChange={(e) =>
                        setFormData({ ...formData, family: e.target.value })
                      }
                      placeholder="Ex : Boisé oriental"
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      Affichée sous le nom du parfum. Laissez vide si vous ne la
                      connaissez pas — mieux vaut rien qu&apos;une approximation.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Notes principales
                    </Label>
                    <Input
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Ex : Bergamote · Rose · Ambre"
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      Séparez les notes par « · ».
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Disponibilité
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABILITY_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, availability: o.value })
                        }
                        className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                          formData.availability === o.value
                            ? "border-foreground bg-foreground text-background font-medium"
                            : "border-border text-muted-foreground hover:border-gold-soft"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-muted-foreground/70 text-xs">
                    « Bientôt disponible » et « Épuisé » désactivent le bouton
                    Commander sur le site. Le client est alors invité à laisser
                    sa demande — annoncer un stock qu&apos;on n&apos;a pas coûte
                    plus cher qu&apos;une vente manquée.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Pour qui
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              gender:
                                formData.gender === g.value ? "" : g.value,
                            })
                          }
                          className={`px-4 py-2 text-sm border rounded-sm transition-colors ${
                            formData.gender === g.value
                              ? "border-foreground bg-foreground text-background font-medium"
                              : "border-border text-muted-foreground hover:border-gold-soft"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-muted-foreground/70 text-xs">
                      Recliquez pour désélectionner. Rien de sélectionné = non
                      précisé, le badge n&apos;apparaît pas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground text-sm">
                      Réduction (%)
                    </Label>
                    <Input
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      placeholder="Ex : 20 — laissez vide pour aucune"
                      inputMode="numeric"
                    />
                    <p className="text-muted-foreground/70 text-xs">
                      Le prix barré et le prix remisé s&apos;affichent
                      automatiquement sur tous les formats. Maximum 90 %.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Fin de la promotion
                  </Label>
                  <Input
                    type="date"
                    value={formData.discountUntil}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountUntil: e.target.value,
                      })
                    }
                    className="max-w-xs"
                  />
                  <p className="text-muted-foreground/70 text-xs">
                    Passée cette date, le prix revient <strong>tout seul</strong>{" "}
                    au tarif normal — rien à refaire à la main. Laissez vide pour
                    une remise sans échéance.
                  </p>
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

                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <Switch
                    checked={formData.isPack}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isPack: checked })
                    }
                    className="data-[state=checked]:bg-[#6e2639]"
                  />
                  <div>
                    <Label className="text-muted-foreground text-sm">
                      {formData.isPack ? "C'est un pack" : "Parfum simple"}
                    </Label>
                    <p className="text-muted-foreground/70 text-xs mt-1">
                      Un pack apparaît dans la section « Nos packs ». Prix,
                      formats, stock et commande fonctionnent exactement pareil.
                    </p>
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
                        {perfume.brand && (
                          <span className="text-muted-foreground text-[11px] uppercase tracking-wider shrink-0">
                            {perfume.brand}
                          </span>
                        )}
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
                      <p className="text-muted-foreground/70 text-[11px] truncate mt-0.5">
                        {perfume.serialNumber ? (
                          <span className="font-mono">
                            N° {perfume.serialNumber}
                          </span>
                        ) : (
                          <span className="text-amber-600">
                            Aucun numéro de série
                          </span>
                        )}
                        {perfume.officialUrl && " · lien officiel ✓"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {perfume.serialNumber && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Voir le QR code"
                          className="w-8 h-8 text-muted-foreground hover:text-gold"
                          onClick={() => setQrPerfume(perfume)}
                        >
                          <QrCodeIcon className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      {perfume.serialNumber && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Copier l'URL de vérification"
                          className="w-8 h-8 text-muted-foreground hover:text-gold"
                          onClick={() => copyVerifyUrl(perfume)}
                        >
                          {copiedId === perfume.id ? (
                            <Check className="w-3.5 h-3.5 text-gold" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>
                      )}
                      {perfume.officialUrl && (
                        <a
                          href={perfume.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ouvrir le site officiel"
                          className="w-8 h-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-gold transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title={perfume.published ? "Dépublier" : "Publier"}
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
                        title="Modifier"
                        className="w-8 h-8 text-muted-foreground hover:text-gold"
                        onClick={() => handleEdit(perfume)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Supprimer"
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

                        {/* Fiche d'authenticité, une fois la commande
                            confirmée. Le numéro affiché est celui copié à la
                            commande — aucun numéro n'est créé ici. */}
                        {order.status === "confirmed" && order.serialNumber && (
                          <div className="mt-3 pt-3 border-t border-border flex items-start gap-4">
                            <QrCode
                              value={verifyUrl(
                                order.serialNumber,
                                typeof window !== "undefined"
                                  ? window.location.origin
                                  : ""
                              )}
                              size={96}
                              title="QR de vérification de la commande"
                            />
                            <div className="min-w-0 text-xs space-y-1">
                              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-bordeaux">
                                Flacon source
                              </p>
                              {order.brand && (
                                <p className="text-muted-foreground">
                                  Marque : {order.brand}
                                </p>
                              )}
                              <p className="text-muted-foreground">
                                Parfum : {order.perfumeName}
                              </p>
                              <p className="text-muted-foreground">
                                Format : {order.sizeLabel}
                              </p>
                              <p className="text-foreground font-mono break-all">
                                N° {order.serialNumber}
                              </p>
                              {order.officialUrl && (
                                <a
                                  href={order.officialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-gold hover:underline"
                                >
                                  Site officiel
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
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

      {/* Aperçu du QR en grand — pour l'imprimer ou le montrer au client. */}
      {qrPerfume?.serialNumber && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setQrPerfume(null)}
            aria-label="Fermer"
            tabIndex={-1}
          />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-sm w-full text-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 w-8 h-8 text-muted-foreground"
              onClick={() => setQrPerfume(null)}
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </Button>

            <h3 className="text-foreground text-sm font-medium pr-8 text-left">
              {qrPerfume.name}
            </h3>
            <p className="text-muted-foreground font-mono text-xs mt-1 text-left break-all">
              N° {qrPerfume.serialNumber}
            </p>

            <div className="mt-5 flex justify-center">
              <QrCode
                value={verifyUrl(
                  qrPerfume.serialNumber,
                  typeof window !== "undefined" ? window.location.origin : ""
                )}
                size={220}
                title={`QR de ${qrPerfume.name}`}
              />
            </div>

            <p className="mt-5 text-muted-foreground text-xs leading-relaxed">
              Mène à la fiche de vérification de ce numéro. Ce n&apos;est pas un
              certificat de la marque.
            </p>

            <Button
              variant="outline"
              className="mt-4 w-full text-xs"
              onClick={() => copyVerifyUrl(qrPerfume)}
            >
              {copiedId === qrPerfume.id ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  URL copiée
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copier l&apos;URL
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- PAGE ----------
/**
 * L'accès à l'espace admin repose UNIQUEMENT sur la session NextAuth.
 *
 * Une version précédente doublait ce contrôle d'un drapeau `localStorage` qui,
 * lui, n'expirait jamais. Passé la durée de vie de la session, le tableau de
 * bord continuait donc de s'afficher alors que le serveur rejetait déjà chaque
 * requête : l'écran restait vide, les enregistrements échouaient en silence, et
 * il fallait se déconnecter puis se reconnecter pour retrouver un état sain.
 * Le symptôme se voyait surtout au téléphone, où l'on revient sur le site
 * plusieurs jours après s'y être connecté.
 *
 * Un drapeau posé par le navigateur ne prouve rien de toute façon : seul le
 * cookie signé compte, et c'est lui que vérifient les routes API.
 */
export default function AdminPage() {
  const { data: session, status } = useSession();

  const role = (session?.user as { role?: string } | undefined)?.role;
  // Le rôle est vérifié ici comme il l'est côté serveur : un compte existant
  // mais sans le rôle « admin » n'ouvre pas le tableau de bord.
  const isAdmin = !!session?.user && role === "admin";
  const connectedButNotAdmin = !!session?.user && !isAdmin;

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return isAdmin ? (
    <Dashboard onLogout={handleLogout} />
  ) : (
    <LoginView notAdmin={connectedButNotAdmin} />
  );
}
