import { useTransactions } from "@/context/TransactionsContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useMemo, useState } from "react";

dayjs.locale("es");

export type DashboardPeriod = "week" | "month" | "year";

export const useDashboard = () => {
  const { transactions } = useTransactions();
  const [period, setPeriod] = useState<DashboardPeriod>("month");

  // --- Últimos 6 periodos para barras ---
  const last6 = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const unit =
        period === "week" ? "week" : period === "month" ? "month" : "year";
      const start = dayjs()
        .startOf(unit)
        .subtract(5 - i, unit);
      const end = start.endOf(unit);

      let income = 0;
      let expense = 0;

      transactions.forEach((tx) => {
        const date = dayjs(tx.createdAt?.toDate?.() ?? tx.createdAt);
        if (date.isAfter(start) && date.isBefore(end)) {
          if (tx.type === "income") income += tx.amount;
          else expense += tx.amount;
        }
      });

      const label =
        period === "week"
          ? `S${i + 1}`
          : period === "month"
            ? start.format("MMM")
            : start.format("YYYY");

      return { label, income, expense, balance: income - expense };
    });
  }, [transactions, period]);

  // --- Periodo actual ---
  const current = last6[last6.length - 1];

  // --- Distribución por categoría (periodo actual) ---
  const categoryDistribution = useMemo(() => {
    const unit =
      period === "week" ? "week" : period === "month" ? "month" : "year";
    const start = dayjs().startOf(unit);
    const end = dayjs().endOf(unit);

    const map: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.type !== "expense") return;
      const date = dayjs(tx.createdAt?.toDate?.() ?? tx.createdAt);
      if (!date.isAfter(start) || !date.isBefore(end)) return;
      map[tx.category] = (map[tx.category] ?? 0) + tx.amount;
    });

    const colors = [
      "#6B6FE0",
      "#4AE588",
      "#FF6B76",
      "#FFD93D",
      "#4ECDC4",
      "#FF8B94",
      "#A8E6CF",
      "#C7B8EA",
    ];

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({
        label,
        value,
        color: colors[i % colors.length],
        text: `${Math.round((value / (current.expense || 1)) * 100)}%`,
      }));
  }, [transactions, period, current.expense]);

  // --- Score de salud financiera ---
  const healthScore = useMemo(() => {
    if (current.income === 0)
      return { score: 0, status: "Sin datos", color: "#9CA3AF" };
    const ratio = current.expense / current.income;
    if (ratio <= 0.5)
      return { score: 100, status: "Excelente 🟢", color: "#1DB954" };
    if (ratio <= 0.7)
      return { score: 75, status: "Saludable 🟢", color: "#1DB954" };
    if (ratio <= 0.9)
      return { score: 50, status: "Precaución 🟡", color: "#FFD93D" };
    if (ratio <= 1.0)
      return { score: 25, status: "En riesgo 🔴", color: "#FF6B76" };
    return { score: 0, status: "Crítico 🔴", color: "#E53935" };
  }, [current]);

  // --- Presupuesto restante ---
  const remainingBudget = useMemo(() => {
    const avgIncome = last6.reduce((acc, m) => acc + m.income, 0) / 6;
    return avgIncome - current.expense;
  }, [last6, current]);

  // --- Línea de balance (últimos 6) ---
  const balanceLine = last6.map((m, i) => ({
    value: m.balance,
    label: m.label,
    dataPointText: "",
  }));

  return {
    period,
    setPeriod,
    last6,
    current,
    categoryDistribution,
    healthScore,
    remainingBudget,
    balanceLine,
  };
};
