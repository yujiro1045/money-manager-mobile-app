import { logoutUser } from "@/api/auth";
import { BACKGROUND } from "@/constants/theme2";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const gotToEditProfile = () => {
    router.push("/profile/Edit");
  };
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <Option
            label="Editar perfil"
            onPress={() => router.push("/profile/Edit")}
          />
          <Option label="Lenguaje" value="Español" />
          <Option
            label="Tema oscuro"
            right={<Switch value={darkMode} onValueChange={setDarkMode} />}
          />
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          <Option label="Centro de ayuda" />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logoutUser}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Option({
  label,
  value,
  right,
  onPress,
}: {
  label: string;
  value?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.optionText}>{label}</Text>

      {right ? (
        right
      ) : (
        <View style={styles.optionRight}>
          {value && <Text style={styles.optionValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={18} color="#6B7280" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  header: {
    height: 120,
    backgroundColor: "#1F2A5A",
    justifyContent: "center",
    padding: 20,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  container: {
    padding: 16,
    gap: 16,
    marginTop: -40,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 120,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },

  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  optionText: {
    fontSize: 16,
    color: "#111827",
  },

  optionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  optionValue: {
    fontSize: 14,
    color: "#6B7280",
  },

  logoutButton: {
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
  },

  logoutText: {
    color: "#DC2626",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
