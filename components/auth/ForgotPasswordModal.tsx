import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  resetEmail: string;
  setResetEmail: (v: string) => void;
  resetLoading: boolean;
  resetSent: boolean;
  resetError: string;
  onSubmit: () => void;
  onClose: () => void;
};

export default function ForgotPasswordModal({
  visible,
  resetEmail,
  setResetEmail,
  resetLoading,
  resetSent,
  resetError,
  onSubmit,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {!resetSent ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Recuperar contraseña</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={22} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu
                contraseña.
              </Text>

              <TextInput
                placeholder="Correo electrónico"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={resetEmail}
                onChangeText={setResetEmail}
                style={styles.input}
              />

              {resetError ? (
                <Text style={styles.error}>{resetError}</Text>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={onSubmit}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Enviar enlace</Text>
                )}
              </Pressable>

              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={52} color="#3669C9" />
              </View>
              <Text style={[styles.title, { textAlign: "center" }]}>
                ¡Correo enviado!
              </Text>
              <Text style={[styles.subtitle, { textAlign: "center" }]}>
                Revisa tu bandeja de entrada y sigue las instrucciones para
                restablecer tu contraseña.
              </Text>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && { opacity: 0.9 },
                ]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Aceptar</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#13181F",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
  },
  error: {
    color: "#C93545",
    fontSize: 13,
  },
  button: {
    backgroundColor: "#3669C9",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: "#6B7280",
  },
  successIcon: {
    alignItems: "center",
    marginBottom: 4,
  },
});
