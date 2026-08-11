/**
 * Textes du site en français et en arabe.
 *
 * ─── Pourquoi un dictionnaire et pas une bibliothèque ──────────────────────
 *
 * Le site tient en une poignée de pages, toutes rendues côté navigateur. Une
 * bibliothèque d'internationalisation apporterait ici surtout des fichiers de
 * configuration et des URL par langue à maintenir. Un objet typé suffit, et
 * TypeScript signale à la compilation toute clé oubliée dans l'une des deux
 * langues — ce qu'aucun fichier JSON ne fait.
 *
 * ─── Règle de traduction ───────────────────────────────────────────────────
 *
 * L'arabe utilisé ici est un arabe standard simple, lisible par un client
 * marocain. Les noms de parfums et « MAD » ne sont jamais traduits : ce sont
 * des noms propres et une unité monétaire.
 */

export const LANGS = ["fr", "ar"] as const;
export type Lang = (typeof LANGS)[number];

export const DEFAULT_LANG: Lang = "fr";

/** Nom de chaque langue, écrit dans cette langue — jamais traduit. */
export const LANG_LABELS: Record<Lang, string> = {
  fr: "FR",
  ar: "عربية",
};

/** Sens de lecture. C'est lui qui pilote l'attribut `dir` de la page. */
export const LANG_DIR: Record<Lang, "ltr" | "rtl"> = {
  fr: "ltr",
  ar: "rtl",
};

/** Ramène n'importe quelle valeur à une langue connue. */
export function normalizeLang(value: unknown): Lang {
  const v = String(value ?? "").trim().toLowerCase();
  return (LANGS as readonly string[]).includes(v) ? (v as Lang) : DEFAULT_LANG;
}

const fr = {
  nav: {
    concept: "Le Concept",
    decants: "Nos Décants",
    shop: "Boutique",
    contact: "Contact",
    order: "Commander",
    menu: "Menu",
    closeMenu: "Fermer le menu",
    home: "accueil",
    language: "Langue",
  },

  hero: {
    eyebrow: "Décants de parfums originaux",
    /** Une entrée par ligne du titre : l'animation les révèle l'une après l'autre. */
    title: ["Le parfum", "original,", "en décant."],
    text: "Nous achetons des flacons de parfum originaux et les proposons en petits formats — le même parfum, à un prix accessible.",
    cta: "Voir les décants",
    request: "Votre parfum préféré",
  },

  carousel: {
    label: "Visuels en avant",
    slide: "visuel",
    previous: "Visuel précédent",
    next: "Visuel suivant",
    goTo: "Aller au visuel",
    see: "Voir",
    thisPerfume: "ce parfum",
  },

  announcements: {
    title: "Annonces",
    /** Libellé du bouton quand l'admin n'en a pas saisi. */
    linkLabel: "En savoir plus",
  },

  authenticity: {
    title: "Authenticité & provenance",
    serial: "Numéro de série du flacon source",
    batch: "Code de lot",
    status: "Statut",
    statusText: "Décant transvasé d'un flacon original acheté par {brand}.",
    scan: "Scannez pour vérifier",
    scanText:
      "Ce code mène à la fiche de vérification de ce flacon. Vous pouvez aussi cliquer dessus.",
    checkBatch: "Vérifier le code de lot",
    officialSite: "Site officiel de la marque",
    verifySerial: "Vérifier le numéro de série",
    nonAffiliation:
      "{brand} n'est affilié à aucune des marques citées. Les liens renvoient vers les sites officiels afin que vous puissiez comparer le produit par vous-même.",
  },

  collection: {
    eyebrow: "La collection",
    title: "Nos décants",
    intro1: "Un décant, c'est du parfum ",
    introStrong: "100 % original",
    intro2:
      " transvasé du flacon de marque dans un petit format. Même parfum, même tenue — vous payez la quantité, pas le flacon.",
    packsEyebrow: "Coffrets",
    packsTitle: "Nos packs",
    packsIntro:
      "Plusieurs parfums réunis, à prix réduit. Idéal pour découvrir plusieurs signatures ou pour offrir.",
    filterLabel: "Filtrer par genre",
    all: "Tous",
    empty: "Aucun parfum publié pour le moment",
    emptyHint: "Ajoutez vos parfums depuis l'espace admin",
    emptyCategory: "Aucun décant dans cette catégorie pour le moment",
    askYours: "Demander votre parfum préféré",
    mainNotes: "Notes principales",
    availableSizes: "Formats disponibles",
    from: "À partir de",
    order: "Commander",
    soonText:
      "Ce parfum arrive bientôt. Laissez-nous vos coordonnées, nous vous prévenons dès sa mise en ligne.",
    outText:
      "Ce parfum n'est plus en stock. Laissez-nous vos coordonnées, nous vous prévenons dès son retour.",
    discover: "Découvrir",
  },

  concept: {
    eyebrow: "Le concept",
    title: ["L'art du parfum,", "accessible."],
    text: "nous sélectionnons des parfums originaux et authentiques pour vous permettre de découvrir vos fragrances préférées dans des formats accessibles.",
    stat1: "100%",
    stat1Label: "Original",
    stat2: "Dès 5 ml",
    stat2Label: "Jusqu'au flacon complet",
    stat3: "Livraison",
    stat3Label: "Partout au Maroc",
  },

  signature: {
    title: ["Une fragrance.", "Une présence.", "Une signature."],
    cta: "Découvrir la boutique",
    alt: "Univers",
  },

  contactSection: {
    eyebrow: "Contact",
    title: ["Votre parfum", "vous attend"],
    text: "Parcourez la collection, choisissez votre format et commandez directement sur le site. Paiement à la livraison, partout au Maroc.",
    seeCollection: "Voir la collection",
    request: "Votre parfum préféré",
    instagram: "Instagram",
  },

  footer: {
    tagline: "Une signature olfactive accessible.",
    navigation: "Navigation",
    commitments: "Nos engagements",
    c1: "Parfums originaux",
    c2: "De 5 ml au flacon complet",
    c3: "Livraison partout au Maroc",
    rights: "Tous droits réservés.",
    city: "Oujda, Maroc",
    admin: "Espace Admin",
  },

  stock: {
    inStock: "En stock",
    soon: "Bientôt disponible",
    out: "Épuisé",
    order: "Commander",
    notifyMe: "Me prévenir",
  },

  gender: {
    homme: "Homme",
    femme: "Femme",
    unisexe: "Unisexe",
  },

  request: {
    eyebrow: "Demande de parfum",
    title: ["Quel est votre", "parfum préféré ?"],
    textNamed: "Nous vous prévenons dès que {name} sera de nouveau disponible chez {brand}.",
    textGeneric:
      "Dites-nous le parfum que vous recherchez. Nous vous prévenons dès qu'il est disponible chez {brand}.",
    sectionPerfume: "Le parfum",
    sectionCustomer: "Vos coordonnées",
    nameLabel: "Nom du parfum *",
    namePlaceholder: "Ex : Oud Wood",
    forLabel: "Pour",
    notSpecified: "Non précisé",
    formatLabel: "Format souhaité",
    quantityLabel: "Quantité",
    addOne: "Ajouter un exemplaire",
    removeOne: "Retirer un exemplaire",
    customerLabel: "Nom complet *",
    customerPlaceholder: "Votre nom",
    phoneLabel: "Téléphone / WhatsApp *",
    addressLabel: "Adresse",
    addressPlaceholder: "Quartier, rue, n°...",
    cityLabel: "Ville",
    postalLabel: "Code postal",
    startingFrom: "À partir de",
    delivery: "Livraison",
    free: "Offerte",
    missingForFree: "Plus que {amount} MAD pour la livraison offerte.",
    estimatedTotal: "Total indicatif",
    priceNote: "Tarif du jour, à confirmer au moment de la disponibilité.",
    cityNote: " Indiquez votre ville : la livraison peut changer.",
    submit: "Envoyer ma demande",
    noCommitment:
      "Aucun engagement : nous vous contactons simplement dès que le parfum est disponible.",
    thanks: "Merci !",
    thanksText:
      "Nous avons bien reçu votre demande. Nous vous contacterons dès que votre parfum préféré sera disponible.",
    close: "Fermer",
    error: "Une erreur est survenue. Réessayez.",
    networkError: "Erreur de connexion. Réessayez.",
  },

  order: {
    back: "Retour à la collection",
    notFound: "Parfum introuvable.",
    seeCollection: "Voir la collection",
    soonTitle: "Ce parfum n'est pas encore en ligne. Il arrive bientôt.",
    outTitle: "Ce parfum n'est plus en stock pour le moment.",
    tellUs:
      "Signalez-nous votre intérêt depuis la page d'accueil : nous vous contacterons dès qu'il sera disponible.",
    thanks: "Merci !",
    confirmed:
      "Votre commande de {perfume} ({size} × {qty}) a bien été enregistrée. Nous vous contacterons au {phone} pour confirmer la livraison.",
    continue: "Continuer mes achats",
    formTitle: "Passer commande",
    sizeLabel: "Taille (ml)",
    quantityLabel: "Quantité",
    nameLabel: "Nom complet *",
    namePlaceholder: "Votre nom",
    phoneLabel: "Téléphone *",
    cityLabel: "Ville",
    cityNote: "Les frais de livraison dépendent de la ville.",
    addressLabel: "Adresse de livraison *",
    addressPlaceholder: "Quartier, rue, n°...",
    noteLabel: "Note (optionnel)",
    notePlaceholder: "Précisions...",
    subtotal: "Sous-total",
    delivery: "Livraison",
    free: "Offerte",
    missingForFree: "Plus que {amount} MAD pour la livraison offerte.",
    total: "Total (paiement à la livraison)",
    submit: "Confirmer la commande",
    mainNotes: "Notes principales",
    error: "Une erreur est survenue. Réessayez.",
    networkError: "Erreur de connexion. Réessayez.",
  },

  verify: {
    back: "Retour à la collection",
    eyebrow: "Vérification",
    title: "Flacon source",
    notFound: "Ce numéro ne correspond à aucun flacon {brand}",
    notFoundHint:
      "Vérifiez la saisie — le numéro doit être recopié exactement. S'il est correct et que ce message persiste, contactez-nous avant tout achat.",
    contact: "Nous contacter",
    mainNotes: "Notes principales",
    disclaimer:
      "Cette page est éditée par {brand}. Elle atteste que ce numéro figure bien dans notre registre de flacons — elle ne constitue pas une certification émise par la marque du parfum. Pour un contrôle indépendant, utilisez le code de lot ci-dessus.",
    seeDecant: "Voir ce décant",
  },

  common: {
    loading: "Chargement",
    close: "Fermer",
    imageToAdd: "Image à ajouter",
  },
};
/*
  Pas de `as const` ici, volontairement.
  Il figerait chaque texte français comme type littéral — `"Commander"` plutôt
  que `string` — et TypeScript exigerait alors que la version arabe contienne
  mot pour mot la chaîne française. Sans lui, la contrainte porte sur ce qui
  compte vraiment : la présence de toutes les clés dans les deux langues.
*/

/**
 * Version arabe. La structure est identique à `fr` — TypeScript refuse le
 * fichier si une clé manque, ce qui rend impossible d'oublier une phrase.
 */
const ar: typeof fr = {
  nav: {
    concept: "المفهوم",
    decants: "عطورنا",
    shop: "المتجر",
    contact: "اتصل بنا",
    order: "اطلب الآن",
    menu: "القائمة",
    closeMenu: "إغلاق القائمة",
    home: "الصفحة الرئيسية",
    language: "اللغة",
  },

  hero: {
    eyebrow: "عطور أصلية بكميات صغيرة",
    title: ["العطر الأصلي،", "بكمية", "تناسبك."],
    text: "نشتري قنينات عطور أصلية ونقدمها بكميات صغيرة — نفس العطر، بثمن في المتناول.",
    cta: "اكتشف العطور",
    request: "عطرك المفضل",
  },

  carousel: {
    label: "صور مميزة",
    slide: "صورة",
    previous: "الصورة السابقة",
    next: "الصورة التالية",
    goTo: "الانتقال إلى الصورة",
    see: "شاهد",
    thisPerfume: "هذا العطر",
  },

  announcements: {
    title: "إعلانات",
    linkLabel: "اعرف المزيد",
  },

  authenticity: {
    title: "الأصالة والمصدر",
    serial: "الرقم التسلسلي للقنينة الأصلية",
    batch: "رقم الدفعة",
    status: "الحالة",
    statusText: "كمية منقولة من قنينة أصلية اشترتها {brand}.",
    scan: "امسح للتحقق",
    scanText:
      "هذا الرمز يقودك إلى صفحة التحقق من هذه القنينة. يمكنك أيضاً الضغط عليه.",
    checkBatch: "تحقق من رقم الدفعة",
    officialSite: "الموقع الرسمي للعلامة",
    verifySerial: "التحقق من الرقم التسلسلي",
    nonAffiliation:
      "{brand} غير تابعة لأي من العلامات المذكورة. الروابط تحيل على المواقع الرسمية لتتمكن من المقارنة بنفسك.",
  },

  collection: {
    eyebrow: "المجموعة",
    title: "عطورنا",
    intro1: "الكمية الصغيرة هي عطر ",
    introStrong: "أصلي 100٪",
    intro2:
      " منقول من قنينة العلامة الأصلية إلى قارورة صغيرة. نفس العطر، نفس الثبات — تدفع ثمن الكمية، لا ثمن القنينة.",
    packsEyebrow: "علب الهدايا",
    packsTitle: "عروضنا",
    packsIntro:
      "عدة عطور مجتمعة بثمن مخفض. مثالية لاكتشاف أكثر من عطر أو لتقديمها هدية.",
    filterLabel: "تصفية حسب الفئة",
    all: "الكل",
    empty: "لا يوجد أي عطر منشور حالياً",
    emptyHint: "أضف عطورك من لوحة التحكم",
    emptyCategory: "لا يوجد أي عطر في هذه الفئة حالياً",
    askYours: "اطلب عطرك المفضل",
    mainNotes: "المكونات الأساسية",
    availableSizes: "الكميات المتوفرة",
    from: "ابتداءً من",
    order: "اطلب الآن",
    soonText:
      "هذا العطر سيصل قريباً. اترك لنا معلوماتك ونخبرك فور توفره.",
    outText:
      "هذا العطر غير متوفر حالياً. اترك لنا معلوماتك ونخبرك فور عودته.",
    discover: "اكتشف",
  },

  concept: {
    eyebrow: "المفهوم",
    title: ["فن العطور،", "في المتناول."],
    text: "نختار عطوراً أصلية وموثوقة لنمكّنك من اكتشاف عطورك المفضلة بكميات في المتناول.",
    stat1: "100٪",
    stat1Label: "أصلي",
    stat2: "من 5 مل",
    stat2Label: "إلى القنينة الكاملة",
    stat3: "التوصيل",
    stat3Label: "إلى جميع أنحاء المغرب",
  },

  signature: {
    title: ["عطر.", "حضور.", "بصمة."],
    cta: "اكتشف المتجر",
    alt: "عالم",
  },

  contactSection: {
    eyebrow: "اتصل بنا",
    title: ["عطرك", "في انتظارك"],
    text: "تصفح المجموعة، اختر الكمية واطلب مباشرة من الموقع. الدفع عند التسليم، في جميع أنحاء المغرب.",
    seeCollection: "شاهد المجموعة",
    request: "عطرك المفضل",
    instagram: "إنستغرام",
  },

  footer: {
    tagline: "بصمة عطرية في المتناول.",
    navigation: "التنقل",
    commitments: "التزاماتنا",
    c1: "عطور أصلية",
    c2: "من 5 مل إلى القنينة الكاملة",
    c3: "التوصيل إلى جميع أنحاء المغرب",
    rights: "جميع الحقوق محفوظة.",
    city: "وجدة، المغرب",
    admin: "لوحة التحكم",
  },

  stock: {
    inStock: "متوفر",
    soon: "قريباً",
    out: "نفد المخزون",
    order: "اطلب الآن",
    notifyMe: "أخبرني عند التوفر",
  },

  gender: {
    homme: "رجالي",
    femme: "نسائي",
    unisexe: "للجنسين",
  },

  request: {
    eyebrow: "طلب عطر",
    title: ["ما هو عطرك", "المفضل؟"],
    textNamed: "سنخبرك فور توفر {name} من جديد لدى {brand}.",
    textGeneric:
      "أخبرنا عن العطر الذي تبحث عنه. سنخبرك فور توفره لدى {brand}.",
    sectionPerfume: "العطر",
    sectionCustomer: "معلوماتك",
    nameLabel: "اسم العطر *",
    namePlaceholder: "مثال: Oud Wood",
    forLabel: "لـ",
    notSpecified: "غير محدد",
    formatLabel: "الكمية المطلوبة",
    quantityLabel: "العدد",
    addOne: "إضافة قارورة",
    removeOne: "حذف قارورة",
    customerLabel: "الاسم الكامل *",
    customerPlaceholder: "اسمك",
    phoneLabel: "الهاتف / واتساب *",
    addressLabel: "العنوان",
    addressPlaceholder: "الحي، الشارع، الرقم...",
    cityLabel: "المدينة",
    postalLabel: "الرمز البريدي",
    startingFrom: "ابتداءً من",
    delivery: "التوصيل",
    free: "مجاني",
    missingForFree: "يتبقى {amount} درهم للحصول على توصيل مجاني.",
    estimatedTotal: "المجموع التقريبي",
    priceNote: "ثمن اليوم، يُؤكَّد عند التوفر.",
    cityNote: " أدخل مدينتك: ثمن التوصيل قد يتغير.",
    submit: "أرسل طلبي",
    noCommitment:
      "بدون أي التزام: نتصل بك فقط فور توفر العطر.",
    thanks: "شكراً لك!",
    thanksText:
      "توصلنا بطلبك. سنتصل بك فور توفر عطرك المفضل.",
    close: "إغلاق",
    error: "وقع خطأ. حاول مرة أخرى.",
    networkError: "خطأ في الاتصال. حاول مرة أخرى.",
  },

  order: {
    back: "العودة إلى المجموعة",
    notFound: "العطر غير موجود.",
    seeCollection: "شاهد المجموعة",
    soonTitle: "هذا العطر لم يُنشر بعد. سيصل قريباً.",
    outTitle: "هذا العطر غير متوفر حالياً.",
    tellUs:
      "أخبرنا باهتمامك من الصفحة الرئيسية: سنتصل بك فور توفره.",
    thanks: "شكراً لك!",
    confirmed:
      "تم تسجيل طلبك لـ {perfume} ({size} × {qty}). سنتصل بك على {phone} لتأكيد التوصيل.",
    continue: "متابعة التسوق",
    formTitle: "إتمام الطلب",
    sizeLabel: "الكمية (مل)",
    quantityLabel: "العدد",
    nameLabel: "الاسم الكامل *",
    namePlaceholder: "اسمك",
    phoneLabel: "الهاتف *",
    cityLabel: "المدينة",
    cityNote: "ثمن التوصيل يختلف حسب المدينة.",
    addressLabel: "عنوان التوصيل *",
    addressPlaceholder: "الحي، الشارع، الرقم...",
    noteLabel: "ملاحظة (اختياري)",
    notePlaceholder: "تفاصيل إضافية...",
    subtotal: "المجموع الفرعي",
    delivery: "التوصيل",
    free: "مجاني",
    missingForFree: "يتبقى {amount} درهم للحصول على توصيل مجاني.",
    total: "المجموع (الدفع عند التسليم)",
    submit: "تأكيد الطلب",
    mainNotes: "المكونات الأساسية",
    error: "وقع خطأ. حاول مرة أخرى.",
    networkError: "خطأ في الاتصال. حاول مرة أخرى.",
  },

  verify: {
    back: "العودة إلى المجموعة",
    eyebrow: "التحقق",
    title: "القنينة الأصلية",
    notFound: "هذا الرقم لا يطابق أي قنينة لدى {brand}",
    notFoundHint:
      "تحقق من الرقم — يجب نسخه بالضبط. إذا كان صحيحاً واستمرت هذه الرسالة، اتصل بنا قبل أي شراء.",
    contact: "اتصل بنا",
    mainNotes: "المكونات الأساسية",
    disclaimer:
      "هذه الصفحة من إصدار {brand}. تشهد أن هذا الرقم مسجل في سجل قنيناتنا — وهي ليست شهادة صادرة عن العلامة التجارية للعطر. لتحقق مستقل، استعمل رقم الدفعة أعلاه.",
    seeDecant: "شاهد هذا العطر",
  },

  common: {
    loading: "جارٍ التحميل",
    close: "إغلاق",
    imageToAdd: "صورة يجب إضافتها",
  },
};

export type Dict = typeof fr;

const DICTS: Record<Lang, Dict> = { fr, ar };

/** Textes de la langue demandée. */
export function dict(lang: Lang): Dict {
  return DICTS[lang] ?? DICTS[DEFAULT_LANG];
}

/**
 * Libellés d'état de stock, traduits.
 * `availability.ts` reste la source de vérité pour la logique — savoir si le
 * client peut commander n'a rien à voir avec la langue qu'il lit.
 */
export function stockText(t: Dict, value: string | null | undefined) {
  const key = String(value ?? "").trim().toLowerCase();
  if (key === "bientot") return { badge: t.stock.soon, cta: t.stock.notifyMe };
  if (key === "rupture") return { badge: t.stock.out, cta: t.stock.notifyMe };
  return { badge: t.stock.inStock, cta: t.stock.order };
}

/** Libellé de genre traduit, ou "" si le genre n'est pas précisé. */
export function genderText(t: Dict, value: string | null | undefined) {
  const key = String(value ?? "").trim().toLowerCase();
  if (key === "homme" || key === "femme" || key === "unisexe") {
    return t.gender[key];
  }
  return "";
}

/**
 * Choisit la version arabe si elle existe, sinon le français.
 *
 * Un champ arabe vide n'est pas une erreur : remplir chaque parfum deux fois
 * prend du temps, et une description en français vaut infiniment mieux qu'un
 * espace blanc. Le repli est donc silencieux et systématique.
 */
export function pick(
  lang: Lang,
  fr: string | null | undefined,
  ar: string | null | undefined
): string {
  const base = (fr ?? "").trim();
  if (lang !== "ar") return base;
  const arabic = (ar ?? "").trim();
  return arabic || base;
}

/** Code de locale pour les dates et les nombres. */
export const LANG_LOCALE: Record<Lang, string> = {
  fr: "fr-FR",
  ar: "ar-MA",
};

/**
 * Remplace les marqueurs `{clé}` d'une phrase.
 * Les phrases traduites ne rangent pas leurs éléments dans le même ordre —
 * découper le texte autour des variables donnerait de l'arabe bancal.
 */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
    key in values ? String(values[key]) : whole
  );
}
