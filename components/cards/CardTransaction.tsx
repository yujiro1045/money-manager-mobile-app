import { IONICONS_CATEGORIES } from "@/components/ui/icons/ioniconsCategories";
import { useTransactions } from "@/context/TransactionsContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomModal from "../ui/CustomModal";

type CategoryItem = {
  label: string;
  value: string;
  icon?: string;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: "General", value: "General", icon: "home" },
];

type Props = {
  onSubmit: VoidFunction;
  defaultCategory?: string;
  defaultType?: "income" | "expense";
};

export default function CardTransaction({
  defaultCategory,
  defaultType,
  onSubmit,
}: Props) {
  const { addCategory, categories, addTransaction } = useTransactions();

  const [isIncome, setIsIncome] = useState(true);
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string>("home");
  const [openModal, setOpenModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (defaultCategory) setSelectedCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (defaultType) setIsIncome(defaultType === "income");
  }, [defaultType]);

  const dropdownCategories: CategoryItem[] = [
    ...DEFAULT_CATEGORIES,
    ...categories
      .filter((c) => c.name !== "General")
      .map((c) => ({
        label: c.name,
        value: c.name,
        icon: c.icon || "home",
      })),
  ];

  if (
    defaultCategory &&
    !dropdownCategories.some((c) => c.value === defaultCategory)
  ) {
    dropdownCategories.unshift({
      label: defaultCategory,
      value: defaultCategory,
      icon: "home",
    });
  }

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim(), selectedIcon);
    setSelectedCategory(newCategory.trim());
    setNewCategory("");
    setSelectedIcon("home");
    setShowIconPicker(false);
  };

  const handleAdd = async () => {
    if (!amount || isNaN(Number(amount)) || !selectedCategory) return;

    const exists = categories.some(
      (c) =>
        c.name.toLocaleLowerCase() === selectedCategory.toLocaleLowerCase(),
    );
    if (!exists) {
      await addCategory(selectedCategory, selectedIcon);
    }

    await addTransaction({
      type: isIncome ? "income" : "expense",
      amount: Number(amount),
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

        <View style={styles.inputCategory}>
          <TouchableOpacity
            style={[styles.iconPickerButton, { backgroundColor: "#F3F4F6" }]}
            onPress={() => setShowIconPicker(true)}
          >
            <Ionicons name={selectedIcon as any} size={28} color="#3B82F6" />
          </TouchableOpacity>
          <TextInput
            placeholder="Nueva categoría"
            placeholderTextColor="#000"
            value={newCategory}
            onChangeText={setNewCategory}
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCategory}
          >
            <Text style={styles.createButtonText}>Crear</Text>
          </TouchableOpacity>
        </View>

        <Dropdown
          style={[
            styles.dropdown,
            selectedCategory && styles.dropdownSelected,
          ]}
          data={dropdownCategories}
          labelField="label"
          valueField="value"
          placeholder="Selecciona categoría"
          value={selectedCategory}
          onChange={(item) => setSelectedCategory(item.value)}
          renderItem={(item) => (
            <View
              style={[
                styles.dropdownItem,
                selectedCategory === item.value && styles.dropdownItemActive,
              ]}
            >
              <View
                style={[
                  styles.dropdownIconBox,
                  {
                    backgroundColor:
                      selectedCategory === item.value ? "#E5F7FF" : "#F3F4F6",
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={selectedCategory === item.value ? "#3B82F6" : "#6B7280"}
                />
              </View>
              <Text
                style={[
                  styles.dropdownLabel,
                  selectedCategory === item.value &&
                    styles.dropdownLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </View>
          )}
          renderLeftIcon={() =>
            selectedCategory
              ? (() => {
                  const category = dropdownCategories.find(
                    (c) => c.value === selectedCategory,
                  );
                  return (
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: "#E5F7FF",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={category?.icon as any}
                        size={20}
                        color="#3B82F6"
                      />
                    </View>
                  );
                })()
              : null
          }
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.dropdownItemText}
          activeColor="#E5F7FF"
          maxHeight={300}
        />

        <TextInput
          placeholder="Monto"
          placeholderTextColor="#000"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      {/* Icon Picker Modal */}
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
              data={IONICONS_CATEGORIES}
              numColumns={5}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={true}
              contentContainerStyle={styles.iconGrid}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.iconOption,
                    selectedIcon === item && styles.iconOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedIcon(item);
                    setShowIconPicker(false);
                  }}
                >
                  <Ionicons
                    name={item as any}
                    size={24}
                    color={selectedIcon === item ? "#3B82F6" : "#6B7280"}
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
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginVertical: 16,
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
  inputCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    color: "#000",
  },
  inputTextColor: {
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  dropdownSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: "#F0F7FF",
  },
  dropdownIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownIcon: {
    fontSize: 20,
  },
  dropdownLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  dropdownLabelActive: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#000",
  },
  createButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#1F2A5A",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  iconPickerButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  iconPickerText: {
    fontSize: 28,
  },
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
  iconOptionText: {
    fontSize: 32,
  },
});
