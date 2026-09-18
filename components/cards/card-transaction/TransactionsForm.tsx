import { PRIMARY, TEXT } from "@/constants/theme2";
import { CategoryItem } from "@/hooks/useCardTransaction";
import {
  ActivityIndicator,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LucideIcon } from "../../ui/icons/LucideIcon";

type Props = {
  isIncome: boolean;
  onToggleIncome: () => void;
  selectedCategoryData: CategoryItem | null | undefined;
  onOpenCategorySheet: () => void;
  pickerIcon: string;
  onOpenIconPicker: () => void;
  newCategory: string;
  onChangeNewCategory: (text: string) => void;
  onCreateCategory: () => void;
  amount: string;
  onChangeAmount: (text: string) => void;
  submitting: boolean;
  onAdd: () => void;
};

export default function TransactionForm({
  isIncome,
  onToggleIncome,
  selectedCategoryData,
  onOpenCategorySheet,
  pickerIcon,
  onOpenIconPicker,
  newCategory,
  onChangeNewCategory,
  onCreateCategory,
  amount,
  onChangeAmount,
  submitting,
  onAdd,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Nueva Transacción</Text>

      <View style={styles.switchRow}>
        <Text style={{ color: isIncome ? "green" : "#999" }}>Ingreso</Text>
        <Switch value={!isIncome} onValueChange={onToggleIncome} />
        <Text style={{ color: !isIncome ? "red" : "#999" }}>Gasto</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.selectTrigger,
          selectedCategoryData && styles.selectTriggerActive,
        ]}
        onPress={onOpenCategorySheet}
        activeOpacity={0.7}
      >
        {selectedCategoryData ? (
          <>
            <View style={styles.selectIconBox}>
              <LucideIcon
                name={selectedCategoryData.icon}
                size={20}
                color={PRIMARY}
              />
            </View>
            <Text style={styles.selectText}>{selectedCategoryData.label}</Text>
          </>
        ) : (
          <>
            <View style={styles.selectIconBoxPlaceholder}>
              <LucideIcon name="FolderOpen" size={18} color="#94A3B8" />
            </View>
            <Text style={styles.selectPlaceholder}>Selecciona categoría</Text>
          </>
        )}
        <LucideIcon name="ChevronDown" size={18} color="#94A3B8" />
      </TouchableOpacity>

      <View style={styles.inputCategory}>
        <TouchableOpacity
          style={styles.iconPickerButton}
          onPress={onOpenIconPicker}
        >
          <LucideIcon name={pickerIcon} size={24} color={PRIMARY} />
        </TouchableOpacity>
        <TextInput
          placeholder="Nueva categoría"
          placeholderTextColor="#94A3B8"
          value={newCategory}
          onChangeText={onChangeNewCategory}
          style={styles.createInput}
        />
        <TouchableOpacity
          style={[styles.createButton, !newCategory.trim() && { opacity: 0.5 }]}
          onPress={onCreateCategory}
          disabled={!newCategory.trim()}
        >
          <Text style={styles.createButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Monto"
        placeholderTextColor="#94A3B8"
        value={amount}
        onChangeText={onChangeAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, submitting && { opacity: 0.7 }]}
        onPress={onAdd}
        disabled={submitting}
        activeOpacity={submitting ? 1 : 0.7}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Agregar</Text>
        )}
      </TouchableOpacity>
    </View>
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
});
