import CardTransaction from "@/components/cards/CardTransaction";
import Header from "@/components/header/Header";
import { BACKGROUND } from "@/constants/theme2";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Transaction = {
  type: "income" | "expense";
  amount: number;
  description: string;
};

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };
  return (
    <SafeAreaView style={[styles.safe]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />

        <CardTransaction onAddTransaction={handleAddTransaction} />
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
