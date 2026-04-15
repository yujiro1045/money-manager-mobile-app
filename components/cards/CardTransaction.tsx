import { useTransactions } from "@/context/TransactionsContext";
import React, { useState } from "react";
import {
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
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { label: "General", value: "General" },
];

type Props = {
  onSubmit: VoidFunction;
};

export default function CardTransaction({ onSubmit }: Props) {
  const { addCategory, categories, addTransaction } = useTransactions();

  const [isIncome, setIsIncome] = useState(true);
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const dropdownCategories: CategoryItem[] = [
    ...DEFAULT_CATEGORIES,
    ...categories
      .filter((c) => c.name !== "General")
      .map((c) => ({ label: c.name, value: c.name })),
  ];

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory.trim());
    setSelectedCategory(newCategory.trim());
    setNewCategory("");
  };

  const handleAdd = async () => {
    if (!amount || isNaN(Number(amount)) || !selectedCategory) return;
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
          style={styles.dropdown}
          data={dropdownCategories}
          labelField="label"
          valueField="value"
          placeholder="Selecciona categoría"
          value={selectedCategory}
          onChange={(item) => setSelectedCategory(item.value)}
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

      <CustomModal
        visible={openModal}
        title="¡Transacción añadida!"
        message="Tu transacción se registró correctamente."
        confirmText="Aceptar"
        onConfirm={() => setOpenModal(false)}
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
  },
  inputTextColor: {
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
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
});
