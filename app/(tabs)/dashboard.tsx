import { logoutUser } from "@/api/auth";
import CustomSelect from "@/components/ui/CustomSelect";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const [small, setSmall] = useState("");
  const [medium, setMedium] = useState("");
  const [large, setLarge] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola soy dashboard</Text>

      <Pressable style={styles.logoutButton}>
        <Text onPress={() => Alert.alert("hola")} style={styles.logoutText}>
          cerrar sesion
        </Text>
        <Text onPress={() => logoutUser} style={styles.logoutText}>
          cerrar sesion
        </Text>
      </Pressable>
      <CustomSelect
        size="small"
        value={small}
        placeholder="Selecciona una categoría"
      >
        <Pressable onPress={() => setSmall("Comida")}>
          <Text>Comida</Text>
        </Pressable>

        <Pressable onPress={() => setSmall("Transporte")}>
          <Text>Transporte</Text>
        </Pressable>
      </CustomSelect>
      <CustomSelect
        size="medium"
        value={medium}
        placeholder="Selecciona una categoría"
      >
        <Pressable onPress={() => setMedium("Comida")}>
          <Text>Comida</Text>
        </Pressable>

        <Pressable onPress={() => setMedium("Transporte")}>
          <Text>Transporte</Text>
        </Pressable>
      </CustomSelect>
      <CustomSelect
        size="large"
        value={large}
        placeholder="Selecciona una categoría"
      >
        <Pressable onPress={() => setLarge("Comida")}>
          <Text>Comida</Text>
        </Pressable>

        <Pressable onPress={() => setLarge("Transporte")}>
          <Text>Transporte</Text>
        </Pressable>
      </CustomSelect>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#000",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
