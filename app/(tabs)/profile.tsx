import { logoutUser } from "@/api/auth";
import { BACKGROUND } from "@/constants/theme2";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(true);

  const { loading, user } = useAuth();

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 🔹 Name Card */}
        <View style={styles.nameCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150" }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.optionsCard}>
          <Option label="Editar perfil" />
          <Option label="Lenguaje" value="Español" />
          <Option
            label="Tema oscuro"
            right={<Switch value={darkMode} onValueChange={setDarkMode} />}
          />

          <View style={styles.divider} />

          <TouchableOpacity onPress={logoutUser}>
            <Text style={styles.logout}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Option({
  label,
  value,
  right,
}: {
  label: string;
  value?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionText}>{label}</Text>
      {right ? right : <Text style={styles.optionValue}>{value ?? ">"}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  nameCard: {
    backgroundColor: "#F4F7FF",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  email: {
    color: "#1c1c1e",
    fontSize: 14,
    marginTop: 4,
  },
  optionsCard: {
    backgroundColor: "#F4F7FF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  optionValue: {
    color: "#000",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A30",
    marginVertical: 8,
  },
  logout: {
    color: "#bf0c0c",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
});
