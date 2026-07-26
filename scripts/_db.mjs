/**
 * Socle commun aux scripts d'administration :
 * chargement de .env, puis ouverture d'une connexion Prisma robuste.
 *
 * Aucune valeur sensible n'est jamais affichée.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import dns from "node:dns";
import net from "node:net";

/**
 * Node ≥ 18 essaie l'IPv6 en premier ; le moteur Rust de Prisma privilégie
 * l'IPv4. C'est une source classique d'échecs alors que le CLI fonctionne.
 */
dns.setDefaultResultOrder("ipv4first");

export function loadEnv() {
  try {
    for (const line of readFileSync(".env", "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    console.error("✗ Fichier .env introuvable à la racine du projet.");
    process.exit(1);
  }
}

/** "hôte:port" d'une chaîne de connexion, sans jamais révéler le mot de passe. */
export const describe = (url) =>
  url?.split("@")[1]?.split("/")[0] ?? "(illisible)";

/** Test TCP brut : distingue un réseau bloqué d'un refus applicatif. */
const probeTcp = (host, port) =>
  new Promise((resolve) => {
    const socket = net.connect({ host, port, timeout: 8000 });
    const done = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.on("connect", () => done("ouvert"));
    socket.on("timeout", () => done("timeout"));
    socket.on("error", (e) => done(e.code || "erreur"));
  });

const withParam = (url, param) =>
  !url ? null : url + (url.includes("?") ? "&" : "?") + param;

/**
 * Ouvre une connexion en essayant plusieurs stratégies, de la plus proche du
 * fonctionnement réel de l'application à la plus explicite.
 * Retourne { db, label }. Termine le processus si tout échoue.
 */
export async function connect() {
  const candidates = [
    ["env (comme l'app)", undefined, process.env.DATABASE_URL],
    ["DATABASE_URL", process.env.DATABASE_URL, process.env.DATABASE_URL],
    ["DIRECT_URL", process.env.DIRECT_URL, process.env.DIRECT_URL],
    [
      "DATABASE_URL + sslmode",
      withParam(process.env.DATABASE_URL, "sslmode=require"),
      process.env.DATABASE_URL,
    ],
    [
      "DIRECT_URL + sslmode",
      withParam(process.env.DIRECT_URL, "sslmode=require"),
      process.env.DIRECT_URL,
    ],
  ].filter(([, , shown]) => !!shown);

  if (candidates.length === 0) {
    console.error("✗ DATABASE_URL et DIRECT_URL sont absents de .env");
    process.exit(1);
  }

  const attempts = [];

  for (const [label, url, shown] of candidates) {
    const client = url
      ? new PrismaClient({ datasources: { db: { url } } })
      : new PrismaClient();
    try {
      await client.$connect();
      await client.$queryRaw`SELECT 1`;
      return { db: client, label };
    } catch (error) {
      attempts.push({
        label,
        url: shown,
        error: String(error?.message ?? error).split("\n")[0],
      });
      await client.$disconnect().catch(() => {});
    }
  }

  console.error("✗ Aucune connexion n'a abouti.\n");
  for (const a of attempts) {
    console.error(`  ${a.label.padEnd(22)} ${describe(a.url)}`);
    console.error(`  ${" ".repeat(22)} ${a.error}`);
  }

  console.error("\n— Test réseau brut —");
  const seen = new Set();
  for (const [, , shown] of candidates) {
    const target = describe(shown);
    if (seen.has(target)) continue;
    seen.add(target);
    const [host, port] = target.split(":");
    console.error(`  ${target} → ${await probeTcp(host, Number(port) || 5432)}`);
  }

  console.error(`
Comment lire ce résultat :

  • "ouvert" partout → le réseau passe. Réessaie : le pooler Supabase refuse
    parfois une connexion de façon passagère.
  • "timeout" / "ECONNREFUSED" → réseau bloqué, ou projet Supabase en pause
    (https://supabase.com/dashboard → bouton "Resume").
  • "ENOTFOUND" → recopie les chaînes de connexion depuis le dashboard.
`);
  process.exit(1);
}
