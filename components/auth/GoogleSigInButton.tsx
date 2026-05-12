import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
};

export default function GoogleSignInButton({
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.9 },
          disabled && { opacity: 0.5 },
        ]}
        onPress={onPress}
        disabled={loading || disabled}
      >
        {loading ? (
          <ActivityIndicator color="#13181F" />
        ) : (
          <>
            <Image
              source={require("@/assets/google/google.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>Continuar con Google</Text>
          </>
        )}
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
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
  button: {
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
  icon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  text: {
    color: "#13181F",
    fontSize: 16,
    fontWeight: "600",
  },
});
