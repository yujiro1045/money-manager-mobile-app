import { registerUser } from "@/api/auth";
import { RegisterIcon } from "@/components/ui/icons/icons";
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

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await registerUser(email, password, name);
    } catch (e: any) {
      switch (e.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado");
          break;
        case "auth/invalid-email":
          setError("Correo inválido");
          break;
        case "auth/weak-password":
          setError("Contraseña muy débil");
          break;
        default:
          setError("Error al crear la cuenta");
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
              <RegisterIcon size={24} color="white" />
            </View>

            <Text style={styles.heroTitle}>Money Manager</Text>

            <View style={styles.containerSubtititle}>
              <Text style={styles.heroSubtitle}>
                La forma mas fácil dellevar el control de tus finanzas
              </Text>

              <Text style={styles.description}>
                Tus finanzas, tu futuro. Únete a nosotros y empieza a gestionar
                tus gastos e ingresos de manera sencilla y efectiva.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <TextInput
              placeholder="Nombre completo"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            <TextInput
              placeholder="Email"
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

            <Pressable style={styles.button} onPress={handleRegister}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </Pressable>

            <Text style={styles.link}>
              ¿ya tienes una cuenta?
              <Link href="/(auth)/login">
                <Text style={styles.linkBold}> Inicia sesion</Text>
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
    flexGrow: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
    justifyContent: "center",
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
    backgroundColor: "#3bb48eff",
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
    color: "#FFFF",
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
    backgroundColor: "#3bb48eff",
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
    color: "#3bb48eff",
    fontWeight: "bold",
  },
});
