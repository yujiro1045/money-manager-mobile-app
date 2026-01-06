import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  where,
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
    collection(db, "transactions"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Transaction, "id">),
  }));
};

export const createTransaction = async (transaction: Transaction) => {
  return addDoc(collection(db, "transactions"), transaction);
};

export const deleteTransaction = async (id: string) => {
  return deleteDoc(doc(db, "transactions", id));
};
