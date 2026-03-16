import { db } from "@/api/firebase";
import { PRIMARY, SUCCESS } from "@/constants/theme2";
import { useAuth } from "@/context/AuthContext";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const CardBalance = () => {
  const { user } = useAuth();
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "transactions"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let balance = 0;
      let income = 0;
      let expense = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const amount = data.amount ?? 0;
        const isIncome = data.type === "income";

        balance += isIncome ? amount : -amount;

        const createdAt = data.createdAt?.toDate?.();
        if (
          createdAt &&
          createdAt.getMonth() === currentMonth &&
          createdAt.getFullYear() === currentYear
        ) {
          if (isIncome) income += amount;
          else expense += amount;
        }
      });

      setTotalBalance(balance);
      setMonthlyIncome(income);
      setMonthlyExpense(expense);
    });

    return () => unsubscribe();
  }, [user]);

  const formatCurrency = (value: number) =>
    value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Balance Total</Text>
      <Text style={styles.balance}>{formatCurrency(totalBalance)}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.dot, { backgroundColor: SUCCESS }]} />
          <View>
            <Text style={styles.statLabel}>Ingresos del mes</Text>
            <Text style={[styles.statAmount, { color: SUCCESS }]}>
              + {formatCurrency(monthlyIncome)}
            </Text>
          </View>
        </View>

        <View style={styles.stat}>
          <View style={[styles.dot, { backgroundColor: "#C93545" }]} />
          <View>
            <Text style={styles.statLabel}>Gastos del mes</Text>
            <Text style={[styles.statAmount, { color: "#C93545" }]}>
              - {formatCurrency(monthlyExpense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardBalance;

const styles = StyleSheet.create({
  card: {
    backgroundColor: PRIMARY,
    padding: 24,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  label: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
    fontWeight: "500",
  },
  balance: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 2,
  },
  statAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
