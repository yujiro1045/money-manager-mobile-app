import { useState } from "react";

export type QuickCategory = {
  label: string;
  icon: string;
  type: "income" | "expense";
};

export const ALL_CATEGORIES: QuickCategory[] = [
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
  // Ingresos
  { label: "Salario", icon: "cash", type: "income" },
  { label: "Freelance", icon: "laptop", type: "income" },
  { label: "Negocio", icon: "store", type: "income" },
  { label: "Inversión", icon: "chart-line", type: "income" },
  { label: "Alquiler", icon: "home-city", type: "income" },
  { label: "Regalo", icon: "gift", type: "income" },
];

export const VISIBLE_COUNT = 7;

export const useQuickCategories = () => {
  const [selectedCat, setSelectedCat] = useState<QuickCategory | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePress = (cat: QuickCategory) => {
    setSelectedCat(cat);
    setShowAll(false);
    setShowSheet(true);
  };

  const handleSubmit = () => {
    setShowSheet(false);
    setTimeout(() => setShowSuccess(true), 300);
  };

  return {
    selectedCat,
    showSheet,
    showAll,
    showSuccess,
    visibleCategories: ALL_CATEGORIES.slice(0, VISIBLE_COUNT),
    allCategories: ALL_CATEGORIES,
    handlePress,
    handleSubmit,
    openAll: () => setShowAll(true),
    closeAll: () => setShowAll(false),
    closeSheet: () => setShowSheet(false),
    closeSuccess: () => setShowSuccess(false),
  };
};
