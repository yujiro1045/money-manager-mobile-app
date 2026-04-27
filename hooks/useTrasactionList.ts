import { db } from "@/api/firebase";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  createdAt: any;
};

export type FilterType = "all" | "income" | "expense";
export type SortOrder = "default" | "desc" | "asc";

export const TYPE_FILTERS: { label: string; value: FilterType }[] = [
  { label: "Todos", value: "all" },
  { label: "Ingresos", value: "income" },
  { label: "Gastos", value: "expense" },
];

export const useTransactionList = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [modalType, setModalType] = useState<
    "detail" | "confirm" | "success" | null
  >(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Transaction[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Transaction[];
      setTransactions(data);
    });
    return () => unsubscribe();
  }, [user]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filterType !== "all") {
      result = result.filter((tx) => tx.type === filterType);
    }

    if (sortOrder === "desc") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === "asc") {
      result.sort((a, b) => a.amount - b.amount);
    }

    return result;
  }, [transactions, filterType, sortOrder]);

  const closeAllModal = () => setModalType(null);

  const handleDeleteConfirmed = async () => {
    if (!selectedTx || !user) return;
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "transactions", selectedTx.id),
      );
      setModalType(null);
      setSelectedTx(null);
      setTimeout(() => setModalType("success"), 200);
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  const handlePressTx = (tx: Transaction) => {
    setSelectedTx(tx);
    setModalType("detail");
  };

  const toggleSortOrder = () =>
    setSortOrder((prev) => {
      if (prev === "default") return "desc";
      if (prev === "desc") return "asc";
      return "default";
    });

  return {
    filteredTransactions,
    selectedTx,
    modalType,
    filterType,
    sortOrder,
    setFilterType,
    toggleSortOrder,
    handlePressTx,
    closeAllModal,
    handleDeleteConfirmed,
    openConfirm: () => setModalType("confirm"),
    closeSuccess: () => setModalType(null),
  };
};
