import CustomModal from "@/components/ui/CustomModal";
import { BACKGROUND, CARD, MUTED, PRIMARY, TEXT } from "@/constants/theme2";
import { useTransactions } from "@/context/TransactionsContext";
import {
  Transaction,
  TYPE_FILTERS,
  useTransactionList,
} from "@/hooks/useTrasactionList";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDate = (date: any) => {
  if (!date) return "";
  const d = date.toDate();
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";

  return d.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });
};

export default function Transactions() {
  const {
    filteredTransactions,
    modalType,
    filterType,
    sortOrder,
    setFilterType,
    toggleSortOrder,
    closeAllModal,
    handleDeleteConfirmed,
    openConfirmWithTx,
    closeSuccess,
  } = useTransactionList();

  const { categories } = useTransactions();

  function getCategoryInitial(category: string): string {
    return category?.charAt(0).toUpperCase() ?? "?";
  }

  const getCategoryIcon = (categoryName: string): string => {
    const category = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase(),
    );
    return category?.icon || "";
  };

  const renderRightActions = (item: Transaction) => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={() => openConfirmWithTx(item)}
    >
      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
      <Text style={styles.deleteActionText}>Eliminar</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === "expense";
    const categoryIcon = getCategoryIcon(item.category);

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item)}
        overshootRight={false}
        friction={2}
      >
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isExpense ? "#FFE5E5" : "#E5FFE9" },
            ]}
          >
            {categoryIcon ? (
              <Ionicons
                name={categoryIcon as any}
                size={20}
                color={isExpense ? "#E53935" : "#2E7D32"}
              />
            ) : (
              <Text
                style={[
                  styles.categoryIcon,
                  { color: isExpense ? "#E53935" : "#2E7D32" },
                ]}
              >
                {getCategoryInitial(item.category)}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.txTitle}>{item.category}</Text>
            <Text style={styles.txSubtitle}>
              {isExpense ? "Gasto" : "Ingreso"}
            </Text>
            <Text style={styles.txDate}>{formatDate(item.createdAt)}</Text>
          </View>

          <Text
            style={[
              styles.amount,
              isExpense ? styles.negative : styles.positive,
            ]}
          >
            {isExpense
              ? `- $${item.amount.toLocaleString("es-CO")}`
              : `+ $${item.amount.toLocaleString("es-CO")}`}
          </Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Transacciones</Text>
            </View>

            <View style={styles.filterRow}>
              {TYPE_FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.value}
                  style={[
                    styles.filterPill,
                    filterType === f.value && styles.filterPillActive,
                  ]}
                  onPress={() => setFilterType(f.value)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      filterType === f.value && styles.filterPillTextActive,
                    ]}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.sortButton}
              onPress={toggleSortOrder}
            >
              <Ionicons
                name={
                  sortOrder === "desc"
                    ? "arrow-down"
                    : sortOrder === "asc"
                      ? "arrow-up"
                      : "time-outline"
                }
                size={14}
                color={PRIMARY}
              />
              <Text style={styles.sortButtonText}>
                {sortOrder === "desc"
                  ? "Mayor a menor"
                  : sortOrder === "asc"
                    ? "Menor a mayor"
                    : "Por fecha"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Aún no hay transacciones</Text>
        )}
        contentContainerStyle={styles.listContent}
      />

      {modalType === "confirm" && (
        <CustomModal
          visible
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta transacción?"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onCancel={closeAllModal}
          onConfirm={handleDeleteConfirmed}
        />
      )}
      {modalType === "success" && (
        <CustomModal
          visible
          title="Transacción eliminada"
          message="La transacción fue eliminada con éxito."
          confirmText="Ok"
          onConfirm={closeSuccess}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    paddingHorizontal: 4,
    paddingTop: 20,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 130,
  },
  title: {
    fontSize: 22,
    color: TEXT,
    fontWeight: "700",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  filterPillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    marginBottom: 12,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
  },
  row: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F4F7FF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIcon: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  txTitle: {
    fontSize: 15,
    color: TEXT,
    fontWeight: "600",
  },
  txSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  txDate: {
    fontSize: 11,
    color: MUTED,
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  negative: { color: "#C93545" },
  positive: { color: "#21A179" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: MUTED,
    fontSize: 14,
  },
  deleteAction: {
    backgroundColor: "#C93545",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 16,
    marginBottom: 12,
    gap: 4,
  },
  deleteActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
});
