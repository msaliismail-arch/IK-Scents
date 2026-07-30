import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // `role` vient de notre provider credentials : il n'existe pas sur le
        // type User de NextAuth, d'où le passage par `unknown`. La valeur de
        // repli est volontairement vide — jamais "admin" : un rôle absent ne
        // doit pas ouvrir l'espace d'administration.
        token.role = (user as unknown as { role?: string }).role ?? "";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string;
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  /**
   * Aucun secret de repli : une valeur codée en dur et publiée sur GitHub
   * permettrait à n'importe qui de fabriquer un jeton de session admin.
   *
   * On ne lève PAS d'erreur ici : ce fichier est évalué pendant `next build`,
   * où les variables d'environnement de production ne sont pas toujours
   * disponibles — cela ferait échouer le déploiement entier.
   * NextAuth refuse déjà de signer une session sans secret en production :
   * l'espace admin devient inaccessible, mais la boutique reste en ligne.
   */
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "[auth] NEXTAUTH_SECRET est absent — la connexion admin ne fonctionnera pas. " +
      "Ajoutez-le dans .env en local, et dans les variables d'environnement de l'hébergeur en production."
  );
}
