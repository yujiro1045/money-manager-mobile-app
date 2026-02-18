import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

interface Transaction {
  id?: string;
  title: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  createdAt: number;
  userId: string;
}

export const getTransactions = async (userId: string) => {
  const q = query(
    collection(db, "users", userId, "transactions"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Transaction, "id">),
  }));
};

export const createTransaction = async (
  userId: string,
  transaction: Omit<Transaction, "id" | "createdAt">,
) => {
  return addDoc(collection(db, "users", userId, "transactions"), {
    ...transaction,
    createdAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (userId: string, id: string) => {
  return deleteDoc(doc(db, "users", userId, "transactions", id));
};
