import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import GoogleSignInButton from "@/components/auth/GoogleSigInButton";
import { LoginIcon } from "@/components/ui/icons/icons";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useLogin } from "@/hooks/useLogin";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleLogin,
    showReset,
    setShowReset,
    resetEmail,
    setResetEmail,
    resetLoading,
    resetSent,
    resetError,
    handleResetPassword,
    handleCloseReset,
  } = useLogin();

  const {
    loading: googleLoading,
    error: googleError,
    handleGoogleSignIn,
    disabled,
  } = useGoogleAuth();

  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={50}
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps="handled"
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

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.inputInner}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowReset(true)}
              style={styles.forgotButton}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

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

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoogleSignInButton
              onPress={handleGoogleSignIn}
              loading={googleLoading}
              disabled={disabled}
            />

            {googleError ? (
              <Text style={styles.error}>{googleError}</Text>
            ) : null}

            <Text style={styles.link}>
              ¿No tienes cuenta?
              <Link href="/(auth)/register">
                <Text style={styles.linkBold}> Regístrate</Text>
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ForgotPasswordModal
        visible={showReset}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        resetLoading={resetLoading}
        resetSent={resetSent}
        resetError={resetError}
        onSubmit={handleResetPassword}
        onClose={handleCloseReset}
      />
    </>
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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 6,
    paddingRight: 12,
  },
  inputInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  eyeButton: {
    padding: 4,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
    marginTop: 4,
  },
  forgotText: {
    fontSize: 13,
    color: "#3669C9",
    fontWeight: "500",
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  googleButtonText: {
    color: "#13181F",
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
  resetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  resetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    gap: 12,
  },
  resetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#13181F",
  },
  resetSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  resetSuccessIcon: {
    alignItems: "center",
    marginBottom: 4,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
