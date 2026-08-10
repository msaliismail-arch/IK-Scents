import type { Metadata, Viewport } from "next";
import { Manrope, Cormorant_Garamond, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/site/language-provider";
import { BRAND } from "@/lib/site";

const manrope = Manrope({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

/**
 * Police arabe.
 *
 * Ni Manrope ni Cormorant Garamond ne contiennent de caractères arabes : sans
 * cette police, tout le texte arabe basculerait sur la police par défaut du
 * système, différente d'un téléphone à l'autre et sans rapport avec le reste
 * de la charte. Cairo garde le trait sobre et géométrique du site.
 */
const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND} — Parfums Originaux`,
  description: `${BRAND} — Parfums 100% originaux, authenticité garantie. Livraison partout au Maroc, paiement à la livraison. Commandez directement en ligne.`,
  keywords: [
    BRAND,
    "parfums originaux",
    "parfum maroc",
    "parfum authentique",
    "livraison maroc",
    "paiement à la livraison",
  ],
  authors: [{ name: BRAND }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: `${BRAND} — Parfums Originaux`,
    description:
      "Parfums 100% originaux, authenticité garantie. Livraison partout au Maroc.",
    type: "website",
  },
};

/**
 * Rendu mobile.
 *
 * `viewportFit: "cover"` étend la page sous l'encoche des iPhone ; combiné aux
 * marges `safe-area` de globals.css, le bandeau d'annonce et le pied de page
 * ne se retrouvent plus coincés derrière l'encoche ou la barre gestuelle.
 *
 * Le zoom n'est jamais bloqué (`maximumScale` laissé libre) : le désactiver
 * rendrait le site inutilisable pour un visiteur malvoyant.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f4ee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${cormorant.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
