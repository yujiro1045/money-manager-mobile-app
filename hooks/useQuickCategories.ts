import { useTransactions } from "@/context/TransactionsContext";
import { useMemo, useState } from "react";

export type QuickCategory = {
  label: string;
  icon: string;
  type: "income" | "expense";
};

export const DEFAULT_CATEGORIES: QuickCategory[] = [
  { label: "Alimentación", icon: "food", type: "expense" },
  { label: "Transporte", icon: "bus", type: "expense" },
  { label: "Salud", icon: "medical-bag", type: "expense" },
  { label: "Arriendo", icon: "home", type: "expense" },
  { label: "Servicios", icon: "lightning-bolt", type: "expense" },
  { label: "Educación", icon: "school", type: "expense" },
  { label: "Ropa", icon: "tshirt-crew", type: "expense" },
  { label: "Entretenimiento", icon: "movie-open", type: "expense" },
  { label: "Restaurantes", icon: "silverware-fork-knife", type: "expense" },
  { label: "Gimnasio", icon: "dumbbell", type: "expense" },
  { label: "Mascotas", icon: "paw", type: "expense" },
  { label: "Deudas", icon: "credit-card", type: "expense" },
  { label: "Internet", icon: "wifi", type: "expense" },
  { label: "Celular", icon: "cellphone", type: "expense" },
  { label: "Salario", icon: "cash", type: "income" },
  { label: "Freelance", icon: "laptop", type: "income" },
  { label: "Negocio", icon: "store", type: "income" },
  { label: "Inversión", icon: "chart-line", type: "income" },
  { label: "Alquiler", icon: "home-city", type: "income" },
  { label: "Regalo", icon: "gift", type: "income" },
  { label: "Bonificación", icon: "star-circle", type: "income" },
  { label: "Venta", icon: "tag-multiple", type: "income" },
  { label: "Reembolso", icon: "undo", type: "income" },
];

// Exportar para compatibilidad
export const ALL_CATEGORIES = DEFAULT_CATEGORIES;

export const VISIBLE_COUNT = 7;

export const useQuickCategories = () => {
  const { categories } = useTransactions();
  const [selectedCat, setSelectedCat] = useState<QuickCategory | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Combina categorías predefinidas con las del usuario, evitando duplicados
  const allCategories = useMemo(() => {
    const merged = [...DEFAULT_CATEGORIES];

    categories.forEach((cat) => {
      const exists = merged.some(
        (m) =>
          m.label.toLowerCase() === cat.name.toLowerCase() &&
          m.icon === cat.icon,
      );
      if (!exists && cat.icon) {
        merged.push({
          label: cat.name,
          icon: cat.icon,
          type: "expense", // Por defecto se consideran gastos
        });
      }
    });

    return merged;
  }, [categories]);

  const handlePress = (cat: QuickCategory) => {
    setSelectedCat(cat);
    setShowAll(false);
    setShowSheet(true);
  };

  const handleSubmit = () => {
    setShowSheet(false);
  };

  return {
    selectedCat,
    showSheet,
    showAll,
    visibleCategories: allCategories.slice(0, VISIBLE_COUNT),
    allCategories,
    handlePress,
    handleSubmit,
    openAll: () => setShowAll(true),
    closeAll: () => setShowAll(false),
    closeSheet: () => setShowSheet(false),
  };
};
