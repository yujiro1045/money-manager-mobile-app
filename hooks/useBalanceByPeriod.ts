import { db } from "@/api/firebase";
import { useAuth } from "@/context/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";

dayjs.locale("es");

export type Period = "week" | "month" | "year";

interface TxData {
  amount: number;
  type: "income" | "expense";
  createdAt: any;
}

export const useBalanceByPeriod = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("month");
  const [offset, setOffset] = useState(0);
  const [transactions, setTransactions] = useState<TxData[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "transactions"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: TxData[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          amount: d.amount ?? 0,
          type: d.type,
          createdAt: d.createdAt?.toDate?.() ?? null,
        };
      });
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  const handlePeriod = (p: Period) => {
    setPeriod(p);
    setOffset(0);
  };

  const getRange = () => {
    const now = dayjs();
    if (period === "week") {
      const start = now.startOf("week").add(offset, "week");
      return { start, end: start.endOf("week") };
    }
    if (period === "month") {
      const start = now.startOf("month").add(offset, "month");
      return { start, end: start.endOf("month") };
    }
    const start = now.startOf("year").add(offset, "year");
    return { start, end: start.endOf("year") };
  };

  const getPeriodLabel = () => {
    const now = dayjs();
    if (period === "week") {
      const start = now.startOf("week").add(offset, "week");
      const end = start.endOf("week");
      return `${start.format("D MMM")} - ${end.format("D MMM YYYY")}`;
    }
    if (period === "month") {
      const label = now
        .startOf("month")
        .add(offset, "month")
        .format("MMMM YYYY");
      return label.charAt(0).toUpperCase() + label.slice(1);
    }
    return now.add(offset, "year").format("YYYY");
  };

  const { start, end } = getRange();
  let income = 0;
  let expense = 0;

  transactions.forEach(({ amount, type, createdAt }) => {
    if (!createdAt) return;
    const date = dayjs(createdAt);
    if (date.isAfter(start) && date.isBefore(end)) {
      if (type === "income") income += amount;
      else expense += amount;
    }
  });

  const statLabel =
    period === "week"
      ? "de la semana"
      : period === "month"
        ? "del mes"
        : "del año";

  return {
    period,
    offset,
    income,
    expense,
    balance: income - expense,
    periodLabel: getPeriodLabel(),
    statLabel,
    handlePeriod,
    goBack: () => setOffset((o) => o - 1),
    goForward: () => setOffset((o) => o + 1),
    isCurrentPeriod: offset === 0,
  };
};
