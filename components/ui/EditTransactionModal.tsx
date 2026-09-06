import { Transaction } from "@/hooks/useTrasactionList";
import { LucideIcon } from "./icons/LucideIcon";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import AnimatedBottomSheet from "./AnimatedBottomSheet";
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

const formatAmount = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function EditTransactionModal({
  visible,
  transaction,
  onClose,
  onSuccess,
  onUpdate,
}: EditTransactionModalProps) {
  const [amount, setAmount] = useState(() =>
    transaction ? formatAmount(transaction.amount) : "",
  );
  const [name, setName] = useState(transaction?.category ?? "");
  const [isIncome, setIsIncome] = useState(transaction?.type === "income");
  const [prevVisible, setPrevVisible] = useState(visible);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible && transaction) {
      setAmount(formatAmount(transaction.amount));
      setName(transaction.category);
      setIsIncome(transaction.type === "income");
    }
  }

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
    if (!transaction || !amount || !name.trim()) return;

    const numericAmount = getNumericAmount();
    if (isNaN(numericAmount) || numericAmount === 0) return;

    setIsLoading(true);
    try {
      await onUpdate(transaction.id, {
        amount: numericAmount,
        category: name.trim(),
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
      <AnimatedBottomSheet visible={visible} onClose={onClose}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Transacción</Text>
            <TouchableOpacity onPress={onClose}>
              <LucideIcon name="X" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView
            bottomOffset={50}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                placeholder="Nombre de la transacción"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                style={styles.input}
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
          </KeyboardAwareScrollView>
        </View>
      </AnimatedBottomSheet>

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
