import { logoutUser } from "@/api/auth";
import { BACKGROUND, CARD, MUTED, PRIMARY, PRIMARY_COLOR, TEXT } from "@/constants/theme2";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

const MenuItem = ({ icon, label, value, onPress, danger }: MenuItemProps) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.6}
  >
    <View style={[styles.menuIconBox, danger && { backgroundColor: "#FEE2E2" }]}>
      <Ionicons
        name={icon}
        size={20}
        color={danger ? "#DC2626" : PRIMARY}
      />
    </View>
    <Text style={[styles.menuLabel, danger && { color: "#DC2626" }]}>
      {label}
    </Text>
    <View style={styles.menuRight}>
      {value ? <Text style={styles.menuValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
    </View>
  </TouchableOpacity>
);

export default function Profile() {
  const { loading, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Cerrar sesión", style: "destructive", onPress: logoutUser },
      ],
    );
  };

  if (loading || !user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = getInitials(user.displayName);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Perfil</Text>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.name}>{user.displayName ?? "Usuario"}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Configuración</Text>
            <MenuItem
              icon="person-outline"
              label="Editar perfil"
              onPress={() => router.push("/profile/Edit")}
            />
            <View style={styles.divider} />
            <MenuItem icon="language-outline" label="Lenguaje" value="Español" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Soporte</Text>
            <MenuItem icon="help-circle-outline" label="Centro de ayuda" />
          </View>

          <MenuItem
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleLogout}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: MUTED,
    fontSize: 15,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: PRIMARY,
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileSection: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  body: {
    paddingHorizontal: 16,
    marginTop: -20,
    gap: 14,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 14,
  },
  menuIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: TEXT,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuValue: {
    fontSize: 13,
    color: MUTED,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 2,
  },
});
