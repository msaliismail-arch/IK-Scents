/**
 * Crée ou met à jour le compte administrateur.
 *
 *   npm run set-admin
 *
 * Les identifiants sont lus dans .env (fichier jamais versionné) :
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 *
 * Le mot de passe n'est jamais stocké en clair : seul son hachage bcrypt
 * finit en base. Le script ne l'affiche jamais.
 */
import bcrypt from "bcryptjs";
import { loadEnv, connect } from "./_db.mjs";

loadEnv();

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const name = (process.env.ADMIN_NAME || "Admin ASSIL").trim();

if (!email || !email.includes("@")) {
  fail("ADMIN_EMAIL manquant ou invalide dans .env");
}
if (password.length < 12) {
  fail("ADMIN_PASSWORD doit faire au moins 12 caractères.");
}

const { db, label } = await connect();

try {
  const hash = await bcrypt.hash(password, 12);

  // On cible le compte par son email : relancer le script deux fois de suite
  // ne crée jamais de doublon.
  const existing =
    (await db.user.findUnique({ where: { email } })) ??
    (await db.user.findFirst({ where: { role: "admin" } }));

  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: { email, name, password: hash, role: "admin" },
    });
    console.log(`✓ Compte admin mis à jour : ${email}  (via ${label})`);
  } else {
    await db.user.create({
      data: { email, name, password: hash, role: "admin" },
    });
    console.log(`✓ Compte admin créé : ${email}  (via ${label})`);
  }

  const total = await db.user.count({ where: { role: "admin" } });
  if (total > 1) {
    console.warn(`
⚠ ${total} comptes admin existent en base.
  Les anciens comptes gardent leur propre mot de passe et peuvent toujours
  se connecter. Inspecte-les puis supprime les inutiles :

      npm run admins
      npm run admins -- --purge
`);
  }
} catch (error) {
  console.error("✗ Échec :", String(error?.message ?? error).split("\n")[0]);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
