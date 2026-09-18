import { PRIMARY } from "@/constants/theme2";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  photoURL?: string | null;
  email?: string | null;
  size?: number;
  borderRadius?: number;
};

export default function Avatar({
  photoURL,
  email,
  size = 42,
  borderRadius,
}: AvatarProps) {
  // Algunas URLs de foto de Google fallan al cargar en RN (redirecciones,
  // sin conexión, etc). Si eso pasa, caemos al fallback de la inicial en
  // vez de dejar un espacio en blanco/roto.
  const [imageFailed, setImageFailed] = useState(false);

  const radius = borderRadius ?? size / 2;
  const initial = email?.trim().charAt(0).toUpperCase() || "?";
  const showImage = !!photoURL && !imageFailed;

  if (showImage) {
    return (
      <Image
        source={{ uri: photoURL! }}
        onError={() => setImageFailed(true)}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: radius },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text style={[styles.fallbackText, { fontSize: size * 0.42 }]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#E6EEF9",
  },
  fallback: {
    backgroundColor: "#E6EEF9",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontWeight: "700",
    color: PRIMARY,
  },
});
