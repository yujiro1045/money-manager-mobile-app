import { useTransactions } from "@/context/TransactionsContext";
import { useRef, useState } from "react";

export type CategoryItem = {
  label: string;
  value: string;
  icon?: string;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: "General", value: "General", icon: "House" },
];

type UseCardTransactionParams = {
  defaultCategory?: string;
  defaultType?: "income" | "expense";
  defaultIcon?: string;
};

export function useCardTransaction({
  defaultCategory,
  defaultType,
  defaultIcon,
}: UseCardTransactionParams) {
  const { addCategory, categories, addTransaction, deleteCategory } =
    useTransactions();

  const [isIncome, setIsIncome] = useState(
    defaultType ? defaultType === "income" : true,
  );
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    defaultCategory ?? null,
  );
  const selectedIcon = defaultIcon ?? "House";
  const [pickerIcon, setPickerIcon] = useState<string>("House");
  const [openModal, setOpenModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(
    null,
  );
  const [blockedDeleteMessage, setBlockedDeleteMessage] = useState<
    string | null
  >(null);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  // Guard contra doble-tap: useRef porque se actualiza de forma síncrona,
  // a diferencia de useState, así que bloquea el segundo tap aunque llegue
  // antes de que React vuelva a renderizar con el botón deshabilitado.
  const isSubmittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  // Mismo guard aplicado a eliminar categoría, mientras se conecta un
  // loader visual en el botón "Eliminar" del CustomModal.
  const isDeletingRef = useRef(false);
  const [deletingCategory, setDeletingCategory] = useState(false);

  const allCategoryItems: CategoryItem[] = [
    ...DEFAULT_CATEGORIES,
    ...categories
      .filter((c) => c.name !== "General")
      .map((c) => ({
        label: c.name,
        value: c.name,
        icon: c.icon || "House",
      })),
  ];

  if (defaultCategory) {
    const existingIndex = allCategoryItems.findIndex(
      (c) => c.value === defaultCategory,
    );
    if (existingIndex >= 0) {
      if (defaultIcon) allCategoryItems[existingIndex].icon = defaultIcon;
    } else {
      allCategoryItems.push({
        label: defaultCategory,
        value: defaultCategory,
        icon: defaultIcon || "House",
      });
    }
  }

  const depudedCategoryItems = Array.from(
    new Map(allCategoryItems.map((item) => [item.value, item])).values(),
  );

  const filteredCategoryItems = categorySearch.trim()
    ? depudedCategoryItems.filter((item) =>
        item.label.toLowerCase().includes(categorySearch.trim().toLowerCase()),
      )
    : depudedCategoryItems;

  const selectedCategoryData = selectedCategory
    ? depudedCategoryItems.find((c) => c.value === selectedCategory)
    : null;

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim(), pickerIcon);
    setSelectedCategory(newCategory.trim());
    setNewCategory("");
    setPickerIcon("House");
    setShowIconPicker(false);
  };

  const handleAmountChange = (text: string) => {
    const cleanedValue = text.replace(/\./g, "");

    if (!/^\d*$/.test(cleanedValue)) return;

    if (cleanedValue.length > 11) return;

    const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formatted);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    if (isDeletingRef.current) return; // bloqueo síncrono contra doble-tap

    isDeletingRef.current = true;
    setDeletingCategory(true);

    try {
      await deleteCategory(categoryToDelete.value);
      if (selectedCategory === categoryToDelete.value) {
        setSelectedCategory(null);
      }
      setShowDeletedModal(true);
    } catch (err: any) {
      setBlockedDeleteMessage(
        err?.message || "No se pudo eliminar la categoría.",
      );
    } finally {
      setCategoryToDelete(null);
      isDeletingRef.current = false;
      setDeletingCategory(false);
    }
  };

  // Toggle explícito para el botón "Editar"/"Listo" del header del sheet.
  const toggleEditMode = () => setEditMode((prev) => !prev);

  const getNumericValue = (): number => {
    return Number(amount.replace(/\./g, ""));
  };

  const handleAdd = async () => {
    if (isSubmittingRef.current) return; // bloqueo síncrono contra doble-tap

    const numericAmount = getNumericValue();
    if (
      !amount ||
      isNaN(numericAmount) ||
      numericAmount === 0 ||
      !selectedCategory
    )
      return;

    isSubmittingRef.current = true;
    setSubmitting(true);

    try {
      let categoryIcon = selectedIcon;

      if (defaultIcon && selectedCategory === defaultCategory) {
        categoryIcon = defaultIcon;
      } else {
        const categoryItem = allCategoryItems.find(
          (c) => c.value === selectedCategory,
        );
        categoryIcon = categoryItem?.icon || selectedIcon;
      }

      await addCategory(selectedCategory, categoryIcon);

      await addTransaction({
        type: isIncome ? "income" : "expense",
        amount: numericAmount,
        category: selectedCategory,
      });

      setAmount("");
      setSelectedCategory(null);
      setIsIncome(true);
      setOpenModal(true);
    } finally {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  return {
    // formulario principal
    isIncome,
    setIsIncome,
    amount,
    handleAmountChange,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryData,
    submitting,
    handleAdd,

    // crear categoría nueva
    newCategory,
    setNewCategory,
    pickerIcon,
    setPickerIcon,
    handleCreateCategory,

    // selector de ícono
    showIconPicker,
    setShowIconPicker,

    // selector de categoría (bottom sheet)
    showCategorySheet,
    setShowCategorySheet,
    categorySearch,
    setCategorySearch,
    editMode,
    setEditMode,
    toggleEditMode,
    filteredCategoryItems,

    // eliminar categoría
    categoryToDelete,
    setCategoryToDelete,
    handleConfirmDelete,
    deletingCategory,
    blockedDeleteMessage,
    setBlockedDeleteMessage,
    showDeletedModal,
    setShowDeletedModal,

    // modal de éxito
    openModal,
    setOpenModal,
  };
}
