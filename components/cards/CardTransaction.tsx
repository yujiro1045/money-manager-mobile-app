import { useTransactions } from "@/context/TransactionsContext";
import { PRIMARY, TEXT } from "@/constants/theme2";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomModal from "../ui/CustomModal";
import { IONICONS_CATEGORIES } from "../ui/icons/ioniconsCategories";

type CategoryItem = {
  label: string;
  value: string;
  icon?: string;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: "General", value: "General", icon: "home" },
];

const ICON_LIST = IONICONS_CATEGORIES;

type Props = {
  onSubmit: VoidFunction;
  defaultCategory?: string;
  defaultType?: "income" | "expense";
  defaultIcon?: string;
};

export default function CardTransaction({
  defaultCategory,
  defaultType,
  defaultIcon,
  onSubmit,
}: Props) {
  const { addCategory, categories, addTransaction } = useTransactions();

  const [isIncome, setIsIncome] = useState(true);
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string>("home");
  const [pickerIcon, setPickerIcon] = useState<string>("home");
  const [openModal, setOpenModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);

  useEffect(() => {
    if (defaultCategory) setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (defaultType) setIsIncome(defaultType === "income");
  }, [defaultType]);

  useEffect(() => {
    if (defaultIcon) setSelectedIcon(defaultIcon);
  }, [defaultIcon]);

  const allCategoryItems: CategoryItem[] = [
    ...DEFAULT_CATEGORIES,
    ...categories
      .filter((c) => c.name !== "General")
      .map((c) => ({
        label: c.name,
        value: c.name,
        icon: c.icon || "home",
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
        icon: defaultIcon || "home",
      });
    }
  }

  const selectedCategoryData = selectedCategory
    ? allCategoryItems.find((c) => c.value === selectedCategory)
    : null;

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim(), pickerIcon);
    setSelectedCategory(newCategory.trim());
    setNewCategory("");
    setPickerIcon("home");
    setShowIconPicker(false);
  };

  const handleAmountChange = (text: string) => {
    const cleanedValue = text.replace(/\./g, "");

    if (!/^\d*$/.test(cleanedValue)) return;

    if (cleanedValue.length > 11) return;

    const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formatted);
  };

  const getNumericValue = (): number => {
    return Number(amount.replace(/\./g, ""));
  };

  const handleAdd = async () => {
    const numericAmount = getNumericValue();
    if (
      !amount ||
      isNaN(numericAmount) ||
      numericAmount === 0 ||
      !selectedCategory
    )
      return;

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
  };

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.title}>Nueva Transacción</Text>

        <View style={styles.switchRow}>
          <Text style={{ color: isIncome ? "green" : "#999" }}>Ingreso</Text>
          <Switch
            value={!isIncome}
            onValueChange={() => setIsIncome(!isIncome)}
          />
          <Text style={{ color: !isIncome ? "red" : "#999" }}>Gasto</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.selectTrigger,
            selectedCategory && styles.selectTriggerActive,
          ]}
          onPress={() => setShowCategorySheet(true)}
          activeOpacity={0.7}
        >
          {selectedCategoryData ? (
            <>
              <View style={styles.selectIconBox}>
                <Ionicons
                  name={selectedCategoryData.icon as any}
                  size={20}
                  color={PRIMARY}
                />
              </View>
              <Text style={styles.selectText}>
                {selectedCategoryData.label}
              </Text>
            </>
          ) : (
            <>
              <View style={styles.selectIconBoxPlaceholder}>
                <Ionicons name="folder-open-outline" size={18} color="#94A3B8" />
              </View>
              <Text style={styles.selectPlaceholder}>
                Selecciona categoría
              </Text>
            </>
          )}
          <Ionicons name="chevron-down" size={18} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.inputCategory}>
          <TouchableOpacity
            style={styles.iconPickerButton}
            onPress={() => setShowIconPicker(true)}
          >
            <Ionicons name={pickerIcon as any} size={24} color={PRIMARY} />
          </TouchableOpacity>
          <TextInput
            placeholder="Nueva categoría"
            placeholderTextColor="#94A3B8"
            value={newCategory}
            onChangeText={setNewCategory}
            style={styles.createInput}
          />
          <TouchableOpacity
            style={[
              styles.createButton,
              !newCategory.trim() && { opacity: 0.5 },
            ]}
            onPress={handleCreateCategory}
            disabled={!newCategory.trim()}
          >
            <Text style={styles.createButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder="Monto"
          placeholderTextColor="#94A3B8"
          value={amount}
          onChangeText={handleAmountChange}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategorySheet}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setShowCategorySheet(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdrop}
            activeOpacity={1}
            onPress={() => setShowCategorySheet(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Selecciona categoría</Text>
              <TouchableOpacity onPress={() => setShowCategorySheet(false)}>
                <Ionicons name="close" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetGrid}
            >
              {allCategoryItems.map((item, index) => {
                const isSelected = selectedCategory === item.value;
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.sheetItem,
                      isSelected && styles.sheetItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(item.value);
                      setShowCategorySheet(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.sheetItemIconBox,
                        isSelected && styles.sheetItemIconBoxSelected,
                      ]}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={isSelected ? PRIMARY : "#64748B"}
                      />
                    </View>
                    {isSelected ? (
                      <View style={styles.sheetCheckBadge}>
                        <Ionicons name="checkmark" size={12} color="#fff" />
                      </View>
                    ) : null}
                    <Text
                      style={[
                        styles.sheetItemLabel,
                        isSelected && styles.sheetItemLabelSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showIconPicker}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.iconPickerContainer}>
          <View style={styles.iconPickerContent}>
            <View style={styles.iconPickerHeader}>
              <Text style={styles.iconPickerTitle}>Selecciona un icono</Text>
              <TouchableOpacity onPress={() => setShowIconPicker(false)}>
                <Text style={styles.iconPickerClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={ICON_LIST}
              numColumns={5}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              contentContainerStyle={styles.iconGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    pickerIcon === item && styles.iconOptionSelected,
                  ]}
                  onPress={() => {
                    setPickerIcon(item);
                    setShowIconPicker(false);
                  }}
                >
                  <Ionicons
                    name={item as any}
                    size={24}
                    color={pickerIcon === item ? "#3B82F6" : "#6B7280"}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <CustomModal
        visible={openModal}
        title="¡Transacción añadida!"
        message="Tu transacción se registró correctamente."
        confirmText="Aceptar"
        onConfirm={() => {
          setOpenModal(false);
          onSubmit();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 28,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginVertical: 20,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },

  // --- Select trigger ---
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
    marginBottom: 12,
  },
  selectTriggerActive: {
    borderColor: PRIMARY,
    backgroundColor: "#FFFFFF",
  },
  selectIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectIconBoxPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: TEXT,
    fontWeight: "500",
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: "#94A3B8",
  },

  // --- Create category ---
  inputCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  iconPickerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  createInput: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    fontSize: 15,
    color: TEXT,
  },
  createButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // --- Amount ---
  input: {
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    fontSize: 15,
    color: TEXT,
  },

  // --- Add button ---
  button: {
    backgroundColor: "#1F2A5A",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  // --- Category bottom sheet ---
  sheetOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: "80%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
  sheetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  sheetItem: {
    width: "30%",
    flexGrow: 1,
    flexBasis: "30%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    maxWidth: "31%",
  },
  sheetItemSelected: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: PRIMARY,
    paddingVertical: 12.5,
    paddingHorizontal: 2.5,
  },
  sheetItemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetItemIconBoxSelected: {
    backgroundColor: "#DBEAFE",
  },
  sheetCheckBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetItemLabel: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
    textAlign: "center",
  },
  sheetItemLabelSelected: {
    color: PRIMARY,
    fontWeight: "600",
  },

  // --- Icon picker ---
  iconPickerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  iconPickerContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: "80%",
  },
  iconPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconPickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  iconPickerClose: {
    fontSize: 24,
    color: "#999",
  },
  iconGrid: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  iconOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: "18%",
  },
  iconOptionSelected: {
    backgroundColor: "#E5F7FF",
    borderColor: "#3B82F6",
  },
});
