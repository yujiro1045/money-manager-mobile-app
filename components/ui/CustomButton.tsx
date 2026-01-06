import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type ButtonProps = {
  text: string;
  size?: "small" | "medium" | "large";
  color?: "blue" | "green" | "red" | "gray";
  type?: "button" | "submit" | "reset";
  width?: "full" | "medium" | "auto" | "half";
  onPress?: (event: GestureResponderEvent) => void;
};

export const CustomButton = ({
  text,
  color = "blue",
  onPress,
  size = "large",
  type,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[color],
        styles[size],
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  pressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.9,
  },

  text: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  small: {
    paddingVertical: 10,
    width: "50%",
  },
  medium: {
    paddingVertical: 12,
    width: "75%",
  },
  large: {
    paddingVertical: 14,
    width: "90%",
  },

  blue: {
    backgroundColor: "#2563EB",
  },
  green: {
    backgroundColor: "#059669",
  },
  red: {
    backgroundColor: "#DC2626",
  },
  gray: {
    backgroundColor: "#6B7280",
  },
});
