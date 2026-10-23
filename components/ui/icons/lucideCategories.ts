// Lista de iconos del selector de categorías.
// Se genera con `node scripts/generate-lucide-icons.mjs` (ver lucideExtraIcons.generated.ts).
// "House" siempre va primero y queda fijo; el resto conserva el orden generado.
import { EXTRA_ICON_NAMES } from "./lucideExtraIcons.generated";

const PINNED = ["House"];

export const LUCIDE_CATEGORIES: readonly string[] = [
  ...PINNED,
  ...EXTRA_ICON_NAMES.filter((name) => !PINNED.includes(name)),
];

export type LucideCategoryName = string;
