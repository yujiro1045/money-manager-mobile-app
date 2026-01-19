import { loginUser } from "@/api/auth";
import { LoginIcon } from "@/components/ui/icons/icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await loginUser(email, password);
    } catch (e: any) {
      switch (e.code) {
        case "auth/invalid-email":
          setError("Correo inválido");
          break;
        case "auth/user-not-found":
          setError("El usuario no existe");
          break;
        case "auth/wrong-password":
          setError("Contraseña incorrecta");
          break;
        default:
          setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <LoginIcon size={24} color="white" />
            </View>

            <Text style={styles.heroTitle}>Bienvenido de nuevo</Text>

            <View style={styles.containerSubtititle}>
              <Text style={styles.heroSubtitle}>
                Ingresa y mantén tus finanzas bajo control
              </Text>

              <Text style={styles.description}>
                Con Money Manager podrás visualizar tus ingresos y gastos de
                forma sencilla y efectiva.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Iniciar sesión</Text>
            <Text style={styles.formSubtitle}>
              Accede a tu cuenta para continuar
            </Text>

            <TextInput
              placeholder="Correo electrónico"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: 0.9 },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              )}
            </Pressable>

            <Text style={styles.link}>
              ¿No tienes cuenta?
              <Link href="/(auth)/register">
                <Text style={styles.linkBold}> Regístrate</Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    justifyContent: "center",
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  hero: {
    backgroundColor: "#3669C9",
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: "center",
  },

  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },

  containerSubtititle: { gap: 15 },
  heroSubtitle: {
    color: "#E6EDFF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  description: {
    color: "#9cb2eaff",
    fontSize: 12,
    textAlign: "center",
  },

  form: {
    padding: 24,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#13181F",
    marginBottom: 4,
  },

  formSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },

  error: {
    color: "#C93545",
    fontSize: 13,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#3669C9",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  link: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#6B7280",
  },

  linkBold: {
    color: "#3669C9",
    fontWeight: "bold",
  },
});
