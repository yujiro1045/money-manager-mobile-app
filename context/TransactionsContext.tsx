import {
  createTransaction,
  deleteTransaction,
  getTransactions,
} from "@/api/transacionts";
import { useAuth } from "@/context/AuthContext";
import { createContext, useContext, useEffect, useState } from "react";

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  createdAt: number;
}

type CreateTxInput = {
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
};

type TxContextType = {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (tx: CreateTxInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
};

const TransactionsContext = createContext<TxContextType>({
  transactions: [],
  loading: true,
  addTransaction: async () => {},
  removeTransaction: async () => {},
});

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getTransactions(user.uid);
      setTransactions(data);
      setLoading(false);
    };

    fetchTransactions();
  }, [user]);

  const addTransaction = async (tx: CreateTxInput) => {
    if (!user) return;

    // 1️⃣ crear transacción local (optimista)
    const optimisticTx: Transaction = {
      id: Date.now().toString(),
      title: tx.title,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [optimisticTx, ...prev]);

    // 2️⃣ guardar en Firebase
    await createTransaction(user.uid, {
      ...tx,
      userId: user.uid,
    });
  };

  const removeTransaction = async (id: string) => {
    if (!user) return;

    // optimista
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    await deleteTransaction(user.uid, id);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
