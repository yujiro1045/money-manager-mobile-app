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
type Transaction = {
  type: "income" | "expense";
  amount: number;
  category: string;
};

type Props = {
  onAddTransaction: (transaction: Transaction) => void;
};

type CategoryItem = {
  label: string;
  value: string;
};

export default function CardTransaction({ onAddTransaction }: Props) {
  const [isIncome, setIsIncome] = useState(true);
  const [amount, setAmount] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([
    { label: "General", value: "General" },
  ]);

  const handleCreateCategory = () => {
    if (!newCategory.trim()) return;

    const newItem: CategoryItem = {
      label: newCategory,
      value: newCategory,
    };

    setCategories((prev) => [...prev, newItem]);
    setSelectedCategory(newCategory);
    setNewCategory("");
  };

  const handleAdd = () => {
    if (!amount || isNaN(Number(amount)) || !selectedCategory) return;

    onAddTransaction({
      type: isIncome ? "income" : "expense",
      amount: Number(amount),
      category: selectedCategory,
    });

    setAmount("");
  };

  return (
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

      <View style={styles.categoryRow}>
        <TextInput
          placeholder="Nueva categoría"
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
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Selecciona categoría"
        value={selectedCategory}
        onChange={(item) => setSelectedCategory(item.value)}
      />

      <TextInput
        placeholder="Monto"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
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
  categoryRow: {
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
