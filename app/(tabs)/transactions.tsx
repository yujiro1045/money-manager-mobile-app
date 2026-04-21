import CustomModal from "@/components/ui/CustomModal";
import { CARD, MUTED, TEXT } from "@/constants/theme2";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { db } from "@/api/firebase";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
};

export default function Transactions() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const [modalType, setModalType] = useState<
    "detail" | "confirm" | "success" | null
  >(null);

  useEffect(() => {
    console.log("useEffect user:", user?.uid);
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot docs:", snapshot.docs.length);
      const data: Transaction[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as Transaction[];

      setTransactions(data);
    });

    return () => unsubscribe();
  }, [user]);

  const closeAllModal = () => {
    setModalType(null);
  };

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

  const handleOpenConfirm = () => {
    setModalType("confirm");
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === "expense";
    return (
      <Pressable
        onPress={() => {
          setSelectedTx(item);
          setModalType("detail");
        }}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={isExpense ? "arrow-down" : "arrow-up"}
            size={20}
            color={isExpense ? "#C93545" : "#21A179"}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.txTitle}>{item.category}</Text>
          <Text style={styles.txSubtitle}>
            {isExpense ? "Gasto" : "Ingreso"}
          </Text>
        </View>

        <Text
          style={[styles.amount, isExpense ? styles.negative : styles.positive]}
        >
          {isExpense ? `- $${item.amount}` : `+ $${item.amount}`}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Todas las transacciones</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Aún no hay transacciones</Text>
        )}
        contentContainerStyle={styles.listContent}
      />

      {modalType === "detail" && (
        <CustomModal
          visible
          title={selectedTx?.category ?? ""}
          message={`Tipo: ${selectedTx?.type}\nMonto: $${selectedTx?.amount}`}
          confirmText="Eliminar"
          cancelText="Cerrar"
          onCancel={closeAllModal}
          onConfirm={handleOpenConfirm}
        />
      )}
      {modalType === "confirm" && (
        <CustomModal
          visible
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta transacción?"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          onCancel={closeAllModal}
          onConfirm={handleDeleteConfirmed}
        />
      )}
      {modalType === "success" && (
        <CustomModal
          visible
          title="Transacción eliminada"
          message="La transacción fue eliminada con éxito."
          confirmText="Ok"
          onConfirm={() => setModalType(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 130,
  },
  title: { fontSize: 18, color: TEXT, fontWeight: "700" },
  row: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F4F7FF",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txTitle: { fontSize: 15, color: TEXT, fontWeight: "600" },
  txSubtitle: { fontSize: 12, color: MUTED, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "700" },
  negative: { color: "#C93545" },
  positive: { color: "#21A179" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: MUTED,
    fontSize: 14,
  },
});
