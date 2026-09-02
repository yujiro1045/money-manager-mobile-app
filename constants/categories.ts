import { LUCIDE_CATEGORIES } from "@/components/ui/icons/lucideCategories";

export type QuickCategory = {
  label: string;
  icon: (typeof LUCIDE_CATEGORIES)[number];
  type: "income" | "expense";
};

export const DEFAULT_CATEGORIES: QuickCategory[] = [
  { label: "Alimentación", icon: "Utensils", type: "expense" },
  { label: "Transporte", icon: "Bus", type: "expense" },
  { label: "Salud", icon: "Stethoscope", type: "expense" },
  { label: "Arriendo", icon: "House", type: "expense" },
  { label: "Servicios", icon: "Zap", type: "expense" },
  { label: "Educación", icon: "GraduationCap", type: "expense" },
  { label: "Ropa", icon: "Shirt", type: "expense" },
  { label: "Entretenimiento", icon: "Clapperboard", type: "expense" },
  { label: "Restaurantes", icon: "Pizza", type: "expense" },
  { label: "Gimnasio", icon: "Dumbbell", type: "expense" },
  { label: "Mascotas", icon: "PawPrint", type: "expense" },
  { label: "Deudas", icon: "CreditCard", type: "expense" },
  { label: "Internet", icon: "Wifi", type: "expense" },
  { label: "Celular", icon: "Smartphone", type: "expense" },
  { label: "Salario", icon: "Briefcase", type: "income" },
  { label: "Freelance", icon: "Laptop", type: "income" },
  { label: "Negocio", icon: "Store", type: "income" },
  { label: "Inversión", icon: "TrendingUp", type: "income" },
  { label: "Alquiler", icon: "Key", type: "income" },
  { label: "Regalo", icon: "Gift", type: "income" },
  { label: "Bonificación", icon: "Star", type: "income" },
  { label: "Venta", icon: "Tag", type: "income" },
  { label: "Reembolso", icon: "RefreshCw", type: "income" },
];

export const ALL_CATEGORIES = DEFAULT_CATEGORIES;
