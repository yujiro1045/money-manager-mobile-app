import { IONICONS_CATEGORIES } from "@/components/ui/icons/ioniconsCategories";

export type QuickCategory = {
  label: string;
  icon: (typeof IONICONS_CATEGORIES)[number];
  type: "income" | "expense";
};

export const DEFAULT_CATEGORIES: QuickCategory[] = [
  { label: "Alimentación", icon: "restaurant", type: "expense" },
  { label: "Transporte", icon: "bus", type: "expense" },
  { label: "Salud", icon: "medical", type: "expense" },
  { label: "Arriendo", icon: "home", type: "expense" },
  { label: "Servicios", icon: "flash", type: "expense" },
  { label: "Educación", icon: "school", type: "expense" },
  { label: "Ropa", icon: "shirt", type: "expense" },
  { label: "Entretenimiento", icon: "film", type: "expense" },
  { label: "Restaurantes", icon: "pizza", type: "expense" },
  { label: "Gimnasio", icon: "fitness", type: "expense" },
  { label: "Mascotas", icon: "paw", type: "expense" },
  { label: "Deudas", icon: "card", type: "expense" },
  { label: "Internet", icon: "wifi", type: "expense" },
  { label: "Celular", icon: "phone-portrait", type: "expense" },
  { label: "Salario", icon: "briefcase", type: "income" },
  { label: "Freelance", icon: "laptop", type: "income" },
  { label: "Negocio", icon: "storefront", type: "income" },
  { label: "Inversión", icon: "trending-up", type: "income" },
  { label: "Alquiler", icon: "key", type: "income" },
  { label: "Regalo", icon: "gift", type: "income" },
  { label: "Bonificación", icon: "star", type: "income" },
  { label: "Venta", icon: "pricetag", type: "income" },
  { label: "Reembolso", icon: "refresh", type: "income" },
];

export const ALL_CATEGORIES = DEFAULT_CATEGORIES;
