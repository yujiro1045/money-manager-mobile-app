// Genera components/ui/icons/lucideExtraIcons.generated.ts
//
// Recorre lucide-react-native (la versión instalada en node_modules), elige N
// iconos al azar (con semilla fija, así el resultado es reproducible) y escribe
// imports EXPLÍCITOS. Mantiene el tree-shaking: solo esos N iconos entran al bundle.
//
// Uso (desde la raíz del proyecto):
//   node scripts/generate-lucide-icons.mjs                 -> 250 iconos, semilla 1
//   node scripts/generate-lucide-icons.mjs --count 300     -> otra cantidad
//   node scripts/generate-lucide-icons.mjs --seed 7        -> otra selección

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? Number(args[i + 1]) : fallback;
};
const COUNT = getArg("count", 250);
const SEED = getArg("seed", 1);

const root = process.cwd();
const pkgDir = path.join(root, "node_modules", "lucide-react-native");
const pkgJsonPath = path.join(pkgDir, "package.json");
if (!fs.existsSync(pkgJsonPath)) {
  console.error("No encuentro node_modules/lucide-react-native. Ejecuta el script desde la raíz del proyecto.");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

// Archivo de entrada ESM (el que lista todos los exports)
const candidates = [pkg.module, "dist/esm/lucide-react-native.mjs", "dist/esm/lucide-react-native.js"]
  .filter(Boolean)
  .map((p) => path.join(pkgDir, p));
const entry = candidates.find((p) => fs.existsSync(p));
if (!entry) {
  console.error("No pude encontrar el archivo de exports de lucide-react-native.");
  process.exit(1);
}

const src = fs.readFileSync(entry, "utf8");

// Cada línea: export { default as X, default as XIcon, default as LucideX } from './icons/x.mjs';
// Solo las que vienen de ./icons/ son iconos reales (excluye Icon, createLucideIcon, etc.)
const names = [];
const seen = new Set();
const re = /export\s*\{([^}]*)\}\s*from\s*['"]\.\/icons\/[^'"]+['"]/g;
for (const m of src.matchAll(re)) {
  const aliases = [...m[1].matchAll(/default\s+as\s+(\w+)/g)].map((x) => x[1]);
  const canonical = aliases.find((n) => !n.endsWith("Icon") && !n.startsWith("Lucide"));
  if (canonical && !seen.has(canonical)) {
    seen.add(canonical);
    names.push(canonical);
  }
}

// Si el formato de la librería cambió y no se encontró nada, mejor fallar que generar un archivo vacío.
if (names.length < 100) {
  console.error(`Solo encontré ${names.length} iconos; el formato de la librería puede haber cambiado.`);
  process.exit(1);
}

// PRNG determinista (mulberry32) + Fisher-Yates
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(SEED);
const pool = [...names];
for (let i = pool.length - 1; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1));
  [pool[i], pool[j]] = [pool[j], pool[i]];
}
// Orden mezclado (estable para la misma semilla): es el orden en que se muestran en el selector.
const picked = pool.slice(0, Math.min(COUNT, pool.length));
const sortedForImport = [...picked].sort();

const out = `// @generated por scripts/generate-lucide-icons.mjs -- NO editar a mano.
// lucide-react-native ${pkg.version} | ${picked.length} de ${names.length} iconos | semilla ${SEED}

import {
${sortedForImport.map((n) => `  ${n},`).join("\n")}
} from "lucide-react-native";

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export const EXTRA_ICON_MAP: Record<string, IconComponent> = {
${picked.map((n) => `  ${n},`).join("\n")}
};

export const EXTRA_ICON_NAMES: string[] = Object.keys(EXTRA_ICON_MAP);
`;

const outPath = path.join(root, "components", "ui", "icons", "lucideExtraIcons.generated.ts");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out);
console.log(`OK: ${picked.length} iconos de ${names.length} -> ${path.relative(root, outPath)}`);
