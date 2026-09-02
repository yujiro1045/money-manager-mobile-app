// Fallback para iconos usando Lucide en todas las plataformas.

import { LucideIcon } from "./LucideIcon";
import { StyleProp, TextStyle } from "react-native";

type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "House",
  "paperplane.fill": "Send",
  "chevron.left.forwardslash.chevron.right": "Code",
  "chevron.right": "ChevronRight",
} as const;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  return <LucideIcon name={MAPPING[name]} size={size} color={color} />;
}
