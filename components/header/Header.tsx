import { Colors } from "@/constants/theme";
import { MUTED, TEXT } from "@/constants/theme2";
import { useAuth } from "@/context/AuthContext";
import { StyleSheet, Text, View } from "react-native";

export default function Header() {
  const { user } = useAuth();
  return (
    <View style={styles.header}>
      <View style={styles.profilePlaceholder} />
      <View>
        <Text style={styles.greeting}>Bienvenido {user?.displayName}</Text>
        <Text style={styles.subtitle}>Tu resumen financiero de hoy</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 20,
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
