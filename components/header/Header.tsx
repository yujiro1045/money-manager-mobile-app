import { MUTED, TEXT } from "@/constants/theme2";
import { StyleSheet, Text, View } from "react-native";

export default function Header({ name = "Juan" }: { name?: string }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hola, {name}</Text>
        <Text style={styles.subtitle}>Tu resumen financiero de hoy</Text>
      </View>
      <View style={styles.profilePlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: "600", color: TEXT },
  subtitle: { marginTop: 4, color: MUTED, fontSize: 13 },
  profilePlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E6EEF9",
  },
});
