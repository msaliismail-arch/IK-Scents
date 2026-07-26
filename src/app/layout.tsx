import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: "ASSIL — Parfums Originaux",
  description:
    "ASSIL — Parfums 100% originaux, authenticité garantie. Livraison partout au Maroc, paiement à la livraison. Commandez directement en ligne.",
  keywords: [
    "ASSIL",
    "parfums originaux",
    "parfum maroc",
    "parfum authentique",
    "livraison maroc",
    "paiement à la livraison",
  ],
  authors: [{ name: "ASSIL" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ASSIL — Parfums Originaux",
    description:
      "Parfums 100% originaux, authenticité garantie. Livraison partout au Maroc.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${cormorant.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
