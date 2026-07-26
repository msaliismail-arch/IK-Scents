/**
 * Inventaire et nettoyage des comptes administrateurs.
 *
 *   npm run admins            → liste les comptes admin
 *   npm run admins -- --purge → supprime tous les admins sauf ADMIN_EMAIL
 *
 * Motivation : une ancienne version du projet créait automatiquement un
 * compte `admin@assil.ma` avec un mot de passe par défaut inscrit dans le
 * code source. Tant que ce compte existe, quiconque a lu le dépôt peut
 * se connecter. Il faut le supprimer.
 */
import { loadEnv, connect } from "./_db.mjs";

loadEnv();

const purge = process.argv.includes("--purge");
const keep = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

const { db, label } = await connect();

try {
  const admins = await db.user.findMany({
    where: { role: "admin" },
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (admins.length === 0) {
    console.log("Aucun compte admin en base. Lancez : npm run set-admin");
    process.exit(0);
  }

  console.log(`\n${admins.length} compte(s) admin — connexion via ${label}\n`);
  for (const a of admins) {
    const marker = a.email.toLowerCase() === keep ? "→ À GARDER" : "  à supprimer";
    const date = a.createdAt.toISOString().slice(0, 10);
    console.log(`  ${marker}  ${a.email.padEnd(32)} ${a.name}  (créé le ${date})`);
  }

  const extras = admins.filter((a) => a.email.toLowerCase() !== keep);

  if (extras.length === 0) {
    console.log("\n✓ Un seul compte admin, celui de .env. Rien à nettoyer.\n");
    process.exit(0);
  }

  if (!purge) {
    console.log(`
⚠ ${extras.length} compte(s) en trop. Si l'un d'eux est l'ancien
  "admin@assil.ma", son mot de passe par défaut a été publié avec le code :
  il faut le supprimer.

  Pour supprimer tous les comptes sauf ${keep || "(ADMIN_EMAIL non défini)"} :

      npm run admins -- --purge
`);
    process.exit(0);
  }

  if (!keep) {
    console.error(
      "\n✗ ADMIN_EMAIL est vide dans .env : impossible de savoir lequel garder.\n"
    );
    process.exit(1);
  }

  const { count } = await db.user.deleteMany({
    where: { role: "admin", email: { not: keep } },
  });

  console.log(`\n✓ ${count} compte(s) admin supprimé(s). Reste : ${keep}\n`);
} catch (error) {
  console.error("✗ Échec :", String(error?.message ?? error).split("\n")[0]);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
