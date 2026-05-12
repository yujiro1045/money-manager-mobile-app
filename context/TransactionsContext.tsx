import { db } from "@/api/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  createdAt: any;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  createdAt: any;
}

type CreateTxInput = {
  type: "income" | "expense";
  amount: number;
  category: string;
};

type TxContextType = {
  transactions: Transaction[];
  categories: Category[];
  loading: boolean;
  addTransaction: (tx: CreateTxInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (name: string, icon?: string) => Promise<void>;
};

const TransactionsContext = createContext<TxContextType>({
  transactions: [],
  categories: [],
  loading: true,
  addTransaction: async () => {},
  removeTransaction: async () => {},
  addCategory: async () => {},
});

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Transaction[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "categories"),
      orderBy("createdAt", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Category[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Category[];
      setCategories(data);
    });

    return () => unsubscribe();
  }, [user]);

  const addTransaction = async (tx: CreateTxInput) => {
    if (!user) return;
    await addDoc(collection(db, "users", user.uid, "transactions"), {
      ...tx,
      createdAt: serverTimestamp(),
    });
  };

  const removeTransaction = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "transactions", id));
  };

  const addCategory = async (name: string, icon?: string) => {
    if (!user) return;
    const exists = categories.some(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase(),
    );
    if (exists) return;
    await addDoc(collection(db, "users", user.uid, "categories"), {
      name: name.trim(),
      icon: icon || "🏷️",
      createdAt: serverTimestamp(),
    });
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        categories,
        loading,
        addTransaction,
        removeTransaction,
        addCategory,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
