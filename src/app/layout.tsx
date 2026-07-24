import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/auth/auth-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
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
        className={`${inter.variable} ${playfair.variable} antialiased bg-[#0a0a0a] text-white`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
