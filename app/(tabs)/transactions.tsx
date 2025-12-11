import { CARD, MUTED, TEXT } from "@/constants/theme2";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SAMPLE = [
  { id: "t1", title: "Almuerzo", subtitle: "Comida", amount: "-25.000" },
  { id: "t2", title: "Transporte", subtitle: "Taxi", amount: "-6.000" },
  { id: "t3", title: "Freelance", subtitle: "Proyecto X", amount: "+420.000" },
  {
    id: "t4",
    title: "Transporte",
    subtitle: "Gasolina de moto",
    amount: "-40.000",
  },
];

export default function Transactions({ data = SAMPLE }: { data?: any[] }) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Ultimas transacciones</Text>
          <Text style={styles.viewAll}>Ver todas</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.icon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txSubtitle}>{item.subtitle}</Text>
              </View>
              <Text
                style={[
                  styles.amount,
                  item.amount.startsWith("-")
                    ? styles.negative
                    : styles.positive,
                ]}
              >
                {item.amount}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12 },
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
});
