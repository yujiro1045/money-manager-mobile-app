import {
  ALL_CATEGORIES,
  DEFAULT_CATEGORIES,
  type QuickCategory,
} from "@/constants/categories";
import { useState } from "react";

export { ALL_CATEGORIES, DEFAULT_CATEGORIES };
export type { QuickCategory };

export const VISIBLE_COUNT = 7;

export const useQuickCategories = () => {
  const [selectedCat, setSelectedCat] = useState<QuickCategory | null>(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Solo mostrar las categorías por defecto, sin mezclar con Firebase
  const allCategories = DEFAULT_CATEGORIES;

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
