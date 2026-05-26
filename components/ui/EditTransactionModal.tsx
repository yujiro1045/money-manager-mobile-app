import { useTransactions } from "@/context/TransactionsContext";
import { Transaction } from "@/hooks/useTrasactionList";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomModal from "./CustomModal";

type EditTransactionModalProps = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onSuccess: () => void;
  onUpdate: (
    id: string,
    data: { amount: number; category: string; type: "income" | "expense" },
  ) => Promise<void>;
};

export default function EditTransactionModal({
  visible,
  transaction,
  onClose,
  onSuccess,
  onUpdate,
}: EditTransactionModalProps) {
  const { categories } = useTransactions();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isIncome, setIsIncome] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setAmount(
        transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      );
      setSelectedCategory(transaction.category);
      setIsIncome(transaction.type === "income");
    }
  }, [transaction, visible]);

  const dropdownCategories = categories.map((c) => ({
    label: c.name,
    value: c.name,
    icon: c.icon || "home",
  }));

  const handleAmountChange = (text: string) => {
    const cleanedValue = text.replace(/\./g, "");
    if (!/^\d*$/.test(cleanedValue)) return;
    if (cleanedValue.length > 11) return;
    const formatted = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formatted);
  };

  const getNumericAmount = (): number => {
    return Number(amount.replace(/\./g, ""));
  };

  const handleSave = async () => {
    if (!transaction || !amount || !selectedCategory) return;

    const numericAmount = getNumericAmount();
    if (isNaN(numericAmount) || numericAmount === 0) return;

    setIsLoading(true);
    try {
      await onUpdate(transaction.id, {
        amount: numericAmount,
        category: selectedCategory,
        type: isIncome ? "income" : "expense",
      });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    onClose();
    onSuccess();
  };

  if (!transaction) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar Transacción</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Categoría</Text>
              <Dropdown
                style={styles.dropdown}
                data={dropdownCategories}
                labelField="label"
                valueField="value"
                placeholder="Selecciona categoría"
                value={selectedCategory}
                onChange={(item) => setSelectedCategory(item.value)}
                renderItem={(item) => (
                  <View style={styles.dropdownItem}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#6B7280"
                    />
                    <Text style={styles.dropdownLabel}>{item.label}</Text>
                  </View>
                )}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Tipo</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    !isIncome && styles.typeButtonActive,
                  ]}
                  onPress={() => setIsIncome(false)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      !isIncome && styles.typeButtonTextActive,
                    ]}
                  >
                    Gasto
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    isIncome && styles.typeButtonActive,
                  ]}
                  onPress={() => setIsIncome(true)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      isIncome && styles.typeButtonTextActive,
                    ]}
                  >
                    Ingreso
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Monto</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomModal
        visible={showSuccess}
        title="¡Transacción Editada!"
        message="Los cambios se han guardado correctamente."
        confirmText="Aceptar"
        onConfirm={handleCloseSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  dropdownLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  typeButtons: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#1F2A5A",
    borderColor: "#1F2A5A",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  typeButtonTextActive: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#F3F4F6",
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#1F2A5A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
