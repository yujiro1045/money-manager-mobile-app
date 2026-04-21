export type QuickCategory = {
  label: string;
  icon: string;
  type: "income" | "expense";
};
export const ALL_CATEGORIES: QuickCategory[] = [
  { label: "Alimentación", icon: "🍔", type: "expense" },
  { label: "Transporte", icon: "🚌", type: "expense" },
  { label: "Salud", icon: "💊", type: "expense" },
  { label: "Arriendo", icon: "🏠", type: "expense" },
  { label: "Servicios", icon: "💡", type: "expense" },
  { label: "Educación", icon: "📚", type: "expense" },
  { label: "Ropa", icon: "👕", type: "expense" },
  { label: "Entretenimiento", icon: "🎬", type: "expense" },
  { label: "Restaurantes", icon: "🍽️", type: "expense" },
  { label: "Gimnasio", icon: "🏋️", type: "expense" },
  { label: "Mascotas", icon: "🐾", type: "expense" },
  { label: "Deudas", icon: "💳", type: "expense" },
  { label: "Internet", icon: "📶", type: "expense" },
  { label: "Celular", icon: "📱", type: "expense" },
  { label: "Salario", icon: "💰", type: "income" },
  { label: "Freelance", icon: "💻", type: "income" },
  { label: "Negocio", icon: "🏪", type: "income" },
  { label: "Inversión", icon: "📈", type: "income" },
  { label: "Alquiler", icon: "🏘️", type: "income" },
  { label: "Regalo", icon: "🎁", type: "income" },
];
export const iconCategory = () => {
  return {
    ALL_CATEGORIES,
  };
};
