// hooks/useQuickCategories.ts
import { useState } from "react";

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
