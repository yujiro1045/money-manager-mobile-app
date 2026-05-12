import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/theme2";
import { Transaction, useTransactions } from "@/context/TransactionsContext";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const MAX_RECENT = 5;

function formatDate(createdAt: any): string {
  if (!createdAt) return "";
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  return date.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryInitial(category: string): string {
  return category?.charAt(0).toUpperCase() ?? "?";
}

const TransactionItem: React.FC<{ item: Transaction; categoryIcon?: string }> = ({ item, categoryIcon }) => {
  const isExpense = item.type === "expense";

  return (
    <View style={styles.item}>
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
              styles.iconText,
              { color: isExpense ? "#E53935" : "#2E7D32" },
            ]}
          >
            {getCategoryInitial(item.category)}
          </Text>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>

      <Text
        style={[styles.amount, { color: isExpense ? "#E53935" : "#2E7D32" }]}
      >
        {isExpense ? "-" : "+"} ${item.amount.toLocaleString("es-CO")}
      </Text>
    </View>
  );
};

const RecentTransactions: React.FC = () => {
  const { transactions, loading, categories } = useTransactions();
  const recent = transactions.slice(0, MAX_RECENT);

  const getCategoryIcon = (categoryName: string): string | null => {
    const category = categories.find(
      (c) => c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.icon || null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transacciones recientes</Text>

      {loading ? (
        <ActivityIndicator color={SECONDARY_COLOR} style={{ marginTop: 20 }} />
      ) : recent.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aún no hay transacciones</Text>
        </View>
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              categoryIcon={getCategoryIcon(item.category)}
            />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    backgroundColor: SECONDARY_COLOR,
    padding: 15,
    borderRadius: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    marginBottom: 12,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 18,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  category: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },

  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
  },

  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  emptyContainer: {
    paddingVertical: 30,
    alignItems: "center",
  },

  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});

export default RecentTransactions;
