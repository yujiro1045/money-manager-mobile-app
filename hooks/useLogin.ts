import { loginUser } from "@/api/auth";
import { auth } from "@/api/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState("");

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
        case "auth/invalid-credential":
          setError("Contraseña incorrecta");
          break;
        default:
          setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      setResetError("Ingresa tu correo electrónico");
      return;
    }
    try {
      setResetLoading(true);
      setResetError("");
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (e: any) {
      switch (e.code) {
        case "auth/user-not-found":
          setResetError("No existe una cuenta con ese correo");
          break;
        case "auth/invalid-email":
          setResetError("Correo inválido");
          break;
        default:
          setResetError("Error al enviar el correo");
      }
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseReset = () => {
    setShowReset(false);
    setResetEmail("");
    setResetSent(false);
    setResetError("");
  };

  return {
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
  };
};
