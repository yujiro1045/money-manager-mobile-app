import { loginWithGoogle } from "@/api/auth";
import { useState } from "react";

let GoogleSignin: any = null;
let statusCodes: any = {};

try {
  const module = require("@react-native-google-signin/google-signin");
  GoogleSignin = module.GoogleSignin;
  statusCodes = module.statusCodes;

  GoogleSignin.configure({
    webClientId:
      "802622678860-ntm3oodfp9e6nvufu044v7ovs1n29ga6.apps.googleusercontent.com",
  });
} catch (e) {
  console.warn("Google Sign-In no disponible en este entorno");
}

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    if (!GoogleSignin) {
      setError("Google Sign-In no disponible");
      return;
    }
    try {
      setError("");
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;
      if (!idToken) throw new Error("No id_token");
      await loginWithGoogle(idToken);
    } catch (e: any) {
      if (e.code !== statusCodes.SIGN_IN_CANCELLED) {
        setError("Error al iniciar sesión con Google");
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleGoogleSignIn,
    disabled: !GoogleSignin,
  };
};
