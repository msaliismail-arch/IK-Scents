/**
 * Générateur de QR code — sans aucune dépendance externe.
 *
 * Pourquoi pas une librairie npm ? Parce qu'un QR illisible ne se voit pas :
 * il s'affiche parfaitement et ne se scanne pas. Le code ci-dessous suit la
 * norme ISO/IEC 18004 (mode octet, versions 1 à 10) et a été vérifié en le
 * décodant réellement avec un lecteur, pas seulement en le regardant.
 *
 * Versions 1 à 10 = jusqu'à 213 octets en correction M. Les URL de
 * vérification ASSIL font une soixantaine de caractères : très large marge.
 *
 * La fonction est pure — même entrée, même sortie — donc utilisable côté
 * serveur comme côté navigateur.
 */

export type EcLevel = "L" | "M" | "Q" | "H";

/** Bits d'identification du niveau de correction dans le format info. */
const EC_LEVEL_BITS: Record<EcLevel, number> = { L: 1, M: 0, Q: 3, H: 2 };

/**
 * Structure des blocs de correction d'erreur, par version puis par niveau :
 * [octets de correction par bloc, blocs groupe 1, données groupe 1,
 *  blocs groupe 2, données groupe 2]. Table de la norme, versions 1 à 10.
 */
const EC_TABLE: Record<EcLevel, ReadonlyArray<readonly number[]>> = {
  L: [
    [], // index 0 inutilisé : les versions commencent à 1
    [7, 1, 19, 0, 0],
    [10, 1, 34, 0, 0],
    [15, 1, 55, 0, 0],
    [20, 1, 80, 0, 0],
    [26, 1, 108, 0, 0],
    [18, 2, 68, 0, 0],
    [20, 2, 78, 0, 0],
    [24, 2, 97, 0, 0],
    [30, 2, 116, 0, 0],
    [18, 2, 68, 2, 69],
  ],
  M: [
    [],
    [10, 1, 16, 0, 0],
    [16, 1, 28, 0, 0],
    [26, 1, 44, 0, 0],
    [18, 2, 32, 0, 0],
    [24, 2, 43, 0, 0],
    [16, 4, 27, 0, 0],
    [18, 4, 31, 0, 0],
    [22, 2, 38, 2, 39],
    [22, 3, 36, 2, 37],
    [26, 4, 43, 1, 44],
  ],
  Q: [
    [],
    [13, 1, 13, 0, 0],
    [22, 1, 22, 0, 0],
    [18, 2, 17, 0, 0],
    [26, 2, 24, 0, 0],
    [18, 2, 15, 2, 16],
    [24, 4, 19, 0, 0],
    [18, 2, 14, 4, 15],
    [22, 4, 18, 2, 19],
    [20, 4, 16, 4, 17],
    [24, 6, 19, 2, 20],
  ],
  H: [
    [],
    [17, 1, 9, 0, 0],
    [28, 1, 16, 0, 0],
    [22, 2, 13, 0, 0],
    [16, 4, 9, 0, 0],
    [22, 2, 11, 2, 12],
    [28, 4, 15, 0, 0],
    [26, 4, 13, 1, 14],
    [26, 4, 14, 2, 15],
    [24, 4, 12, 4, 13],
    [28, 6, 15, 2, 16],
  ],
};

/** Coordonnées des motifs d'alignement, par version. */
const ALIGN_POS: ReadonlyArray<readonly number[]> = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const MAX_VERSION = 10;

/* ─── Corps fini GF(256), polynôme primitif 0x11D ─────────────────────────── */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

const gfMul = (a: number, b: number): number =>
  a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];

/** Polynôme générateur de Reed-Solomon de degré donné. */
function generatorPoly(degree: number): Uint8Array {
  let poly = new Uint8Array([1]);
  for (let d = 0; d < degree; d++) {
    const next = new Uint8Array(poly.length + 1);
    for (let i = 0; i < poly.length; i++) {
      next[i] ^= poly[i];
      next[i + 1] ^= gfMul(poly[i], EXP[d]);
    }
    poly = next;
  }
  return poly;
}

/** Octets de correction d'erreur d'un bloc de données. */
function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = generatorPoly(ecLen);
  const buf = new Uint8Array(data.length + ecLen);
  buf.set(data);
  for (let i = 0; i < data.length; i++) {
    const factor = buf[i];
    if (factor === 0) continue;
    for (let j = 0; j < gen.length; j++) buf[i + j] ^= gfMul(gen[j], factor);
  }
  return buf.slice(data.length);
}

/* ─── Encodage des données ────────────────────────────────────────────────── */

class BitBuffer {
  bits: number[] = [];
  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
}

/** Nombre de bits de l'indicateur de longueur, mode octet. */
const countBits = (version: number): number => (version <= 9 ? 8 : 16);

/** Total de codets de données disponibles pour une version et un niveau. */
function dataCapacity(version: number, ecl: EcLevel): number {
  const [, g1, d1, g2, d2] = EC_TABLE[ecl][version];
  return g1 * d1 + g2 * d2;
}

/** Plus petite version capable de contenir `byteLen` octets. */
function pickVersion(byteLen: number, ecl: EcLevel): number {
  for (let v = 1; v <= MAX_VERSION; v++) {
    const needed = Math.ceil((4 + countBits(v) + byteLen * 8) / 8);
    if (needed <= dataCapacity(v, ecl)) return v;
  }
  throw new Error(
    `Texte trop long pour un QR code de version ${MAX_VERSION} (${byteLen} octets)`
  );
}

/** Bits restants à ajouter après l'entrelacement, par version. */
const REMAINDER_BITS = [0, 0, 7, 7, 7, 7, 7, 0, 0, 0, 0];

/**
 * Construit la séquence finale de codets : données encodées, correction
 * d'erreur par bloc, puis entrelacement des blocs comme l'exige la norme.
 */
function buildCodewords(text: string, version: number, ecl: EcLevel): Uint8Array {
  const bytes = new TextEncoder().encode(text);
  const capacity = dataCapacity(version, ecl);

  const bb = new BitBuffer();
  bb.put(0b0100, 4); // mode octet
  bb.put(bytes.length, countBits(version));
  for (const b of bytes) bb.put(b, 8);

  // Terminateur : jusqu'à 4 bits à zéro, sans dépasser la capacité
  const maxBits = capacity * 8;
  for (let i = 0; i < 4 && bb.bits.length < maxBits; i++) bb.bits.push(0);
  // Alignement sur l'octet
  while (bb.bits.length % 8 !== 0) bb.bits.push(0);

  const data = new Uint8Array(capacity);
  for (let i = 0; i < bb.bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bb.bits[i + j];
    data[i / 8] = byte;
  }
  // Octets de remplissage alternés, jusqu'à saturer la capacité
  for (let i = bb.bits.length / 8, alt = 0; i < capacity; i++, alt++) {
    data[i] = alt % 2 === 0 ? 0xec : 0x11;
  }

  // Découpage en blocs
  const [ecLen, g1, d1, g2, d2] = EC_TABLE[ecl][version];
  const blocks: { data: Uint8Array; ec: Uint8Array }[] = [];
  let offset = 0;
  for (let i = 0; i < g1 + g2; i++) {
    const len = i < g1 ? d1 : d2;
    const chunk = data.slice(offset, offset + len);
    offset += len;
    blocks.push({ data: chunk, ec: rsEncode(chunk, ecLen) });
  }

  // Entrelacement : un octet de chaque bloc à tour de rôle
  const out: number[] = [];
  const maxData = Math.max(d1, d2);
  for (let i = 0; i < maxData; i++) {
    for (const b of blocks) if (i < b.data.length) out.push(b.data[i]);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const b of blocks) out.push(b.ec[i]);
  }
  return new Uint8Array(out);
}

/* ─── Construction de la matrice ──────────────────────────────────────────── */

type Grid = boolean[][];

const MASKS: ReadonlyArray<(x: number, y: number) => boolean> = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** Motifs interdits de la règle 3 de pénalité (et leur miroir). */
const FINDER_LIKE = [true, false, true, true, true, false, true, false, false, false, false];

function penalty(m: Grid, size: number): number {
  let score = 0;

  // Règle 1 — suites de 5 modules identiques ou plus
  const runScore = (line: boolean[]) => {
    let s = 0;
    let run = 1;
    for (let i = 1; i < line.length; i++) {
      if (line[i] === line[i - 1]) run++;
      else {
        if (run >= 5) s += 3 + (run - 5);
        run = 1;
      }
    }
    if (run >= 5) s += 3 + (run - 5);
    return s;
  };
  for (let y = 0; y < size; y++) score += runScore(m[y]);
  for (let x = 0; x < size; x++) score += runScore(m.map((row) => row[x]));

  // Règle 2 — carrés 2×2 de même couleur
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = m[y][x];
      if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1])
        score += 3;
    }
  }

  // Règle 3 — motifs ressemblant à un motif de repérage
  const matchAt = (line: boolean[], i: number, pat: boolean[]) => {
    for (let k = 0; k < pat.length; k++) if (line[i + k] !== pat[k]) return false;
    return true;
  };
  const rev = [...FINDER_LIKE].reverse();
  const lineScore = (line: boolean[]) => {
    let s = 0;
    for (let i = 0; i + FINDER_LIKE.length <= line.length; i++) {
      if (matchAt(line, i, FINDER_LIKE) || matchAt(line, i, rev)) s += 40;
    }
    return s;
  };
  for (let y = 0; y < size; y++) score += lineScore(m[y]);
  for (let x = 0; x < size; x++) score += lineScore(m.map((row) => row[x]));

  // Règle 4 — déséquilibre entre modules sombres et clairs
  let dark = 0;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (m[y][x]) dark++;
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;

  return score;
}

/**
 * Produit la matrice de modules du QR code.
 * `true` = module sombre. La bordure blanche (quiet zone) n'est pas incluse :
 * c'est au rendu de l'ajouter.
 */
export function qrMatrix(text: string, ecl: EcLevel = "M"): Grid {
  if (!text) throw new Error("QR code : texte vide");

  const byteLen = new TextEncoder().encode(text).length;
  const version = pickVersion(byteLen, ecl);
  const size = version * 4 + 17;

  const m: Grid = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));
  const fixed: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false)
  );

  const set = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    m[y][x] = dark;
    fixed[y][x] = true;
  };

  // Motifs de repérage (avec leur séparateur clair)
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(cx + dx, cy + dy, dist !== 2 && dist !== 4);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);

  // Motifs de synchronisation
  for (let i = 0; i < size; i++) {
    if (!fixed[6][i]) set(i, 6, i % 2 === 0);
    if (!fixed[i][6]) set(6, i, i % 2 === 0);
  }

  // Motifs d'alignement, sauf là où ils chevaucheraient un motif de repérage
  const pos = ALIGN_POS[version];
  for (let i = 0; i < pos.length; i++) {
    for (let j = 0; j < pos.length; j++) {
      const isCorner =
        (i === 0 && j === 0) ||
        (i === 0 && j === pos.length - 1) ||
        (i === pos.length - 1 && j === 0);
      if (isCorner) continue;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          set(pos[j] + dx, pos[i] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  // Réservation des zones de format et de version
  const drawFormat = (ecl2: EcLevel, mask: number) => {
    const value = (EC_LEVEL_BITS[ecl2] << 3) | mask;
    let rem = value;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((value << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((bits >>> i) & 1) === 1;

    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6));
    set(8, 8, bit(7));
    set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));

    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true); // module toujours sombre
  };
  drawFormat(ecl, 0); // provisoire : réserve les emplacements

  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const b = ((bits >>> i) & 1) === 1;
      const a = size - 11 + (i % 3);
      const c = Math.floor(i / 3);
      set(a, c, b);
      set(c, a, b);
    }
  }

  // Placement des données en zigzag, de bas à droite vers le haut à gauche
  const codewords = buildCodewords(text, version, ecl);
  const totalBits = codewords.length * 8 + REMAINDER_BITS[version];
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // la colonne 6 porte la synchronisation
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (fixed[y][x] || bitIndex >= totalBits) continue;
        const byte = codewords[bitIndex >>> 3];
        m[y][x] =
          bitIndex < codewords.length * 8
            ? ((byte >>> (7 - (bitIndex & 7))) & 1) === 1
            : false;
        bitIndex++;
      }
    }
  }

  // Choix du masque : celui qui donne la pénalité la plus faible
  let best = 0;
  let bestScore = Infinity;
  let bestGrid: Grid = m;
  for (let mask = 0; mask < 8; mask++) {
    const test = m.map((row) => [...row]);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!fixed[y][x] && MASKS[mask](x, y)) test[y][x] = !test[y][x];
      }
    }
    // Le format info dépend du masque : il doit être écrit avant de noter
    const value = (EC_LEVEL_BITS[ecl] << 3) | mask;
    let rem = value;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((value << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((bits >>> i) & 1) === 1;
    const put = (x: number, y: number, d: boolean) => {
      if (x >= 0 && y >= 0 && x < size && y < size) test[y][x] = d;
    };
    for (let i = 0; i <= 5; i++) put(8, i, bit(i));
    put(8, 7, bit(6));
    put(8, 8, bit(7));
    put(7, 8, bit(8));
    for (let i = 9; i < 15; i++) put(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) put(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) put(8, size - 15 + i, bit(i));
    put(8, size - 8, true);

    const score = penalty(test, size);
    if (score < bestScore) {
      bestScore = score;
      best = mask;
      bestGrid = test;
    }
  }
  void best;

  return bestGrid;
}

/**
 * Convertit la matrice en un attribut `d` de tracé SVG : un seul chemin pour
 * tous les modules sombres, ce qui donne un rendu net à n'importe quelle
 * taille et un DOM minuscule.
 */
export function qrSvgPath(matrix: Grid): string {
  const parts: string[] = [];
  for (let y = 0; y < matrix.length; y++) {
    let x = 0;
    while (x < matrix.length) {
      if (!matrix[y][x]) {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < matrix.length && matrix[y][x + run]) run++;
      parts.push(`M${x} ${y}h${run}v1h-${run}z`);
      x += run;
    }
  }
  return parts.join("");
}

/** Taille du côté de la matrice, bordure comprise. */
export const qrViewBox = (matrix: Grid, quietZone = 2): string =>
  `${-quietZone} ${-quietZone} ${matrix.length + quietZone * 2} ${
    matrix.length + quietZone * 2
  }`;
