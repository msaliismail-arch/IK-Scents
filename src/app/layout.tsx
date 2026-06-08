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
  title: "IK Scents — Luxury in Every Drop",
  description:
    "Discover premium perfume decants from the world's most prestigious fragrance houses. IK Scents delivers luxury fragrances in 5ml and 10ml formats.",
  keywords: [
    "IK Scents",
    "luxury perfumes",
    "perfume decants",
    "fragrance",
    "5ml",
    "10ml",
  ],
  authors: [{ name: "IK Scents" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "IK Scents — Luxury in Every Drop",
    description:
      "Discover premium perfume decants from the world's most prestigious fragrance houses.",
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
