import CustomModal from "@/components/ui/CustomModal";
import { CARD, MUTED, TEXT } from "@/constants/theme2";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Últimas transacciones</Text>
        </View>

        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>Aún no hay transacciones</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const formattedAmount =
                item.type === "expense"
                  ? `- ${item.amount}`
                  : `+ ${item.amount}`;

              return (
                <Pressable
                  onPress={() => {
                    setSelectedTx(item);
                    setModalType("detail");
                  }}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <View style={styles.icon} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.txTitle}>{item.category}</Text>
                    <Text style={styles.txSubtitle}>
                      {item.type === "income" ? "Ingreso" : "Gasto"}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.amount,
                      item.type === "expense"
                        ? styles.negative
                        : styles.positive,
                    ]}
                  >
                    {formattedAmount}
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </View>
      {modalType === "detail" && (
        <CustomModal
          visible
          title={selectedTx?.category ?? ""}
          message={`Tipo: ${selectedTx?.type}\nMonto: ${selectedTx?.amount}`}
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
          key={modalType}
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
  container: { marginTop: 12, padding: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  title: { fontSize: 16, color: TEXT, fontWeight: "600" },
  viewAll: { color: "#3669C9", fontWeight: "600" },

  row: {
    marginTop: 12,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "red",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F4F7FF",
    marginRight: 12,
  },
  txTitle: { fontSize: 14, color: TEXT, fontWeight: "600" },
  txSubtitle: { fontSize: 12, color: MUTED, marginTop: 2 },
  amount: { fontWeight: "700" },
  negative: { color: "#C93545" },
  positive: { color: "#21A179" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: MUTED,
  },
});
