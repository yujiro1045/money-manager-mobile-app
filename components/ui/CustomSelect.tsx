import React, { ReactNode, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type SelectSize = "small" | "medium" | "large";

interface CustomSelectProps {
  size?: SelectSize;
  value?: string;
  placeholder?: string;
  children: ReactNode;
  onSelect?: () => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  children,
  placeholder = "Seleccionar",
  size = "medium",
  value,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = () => {
    onSelect?.();
    setOpen(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.base,
          sizeStyles[size],
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.text, textSizes[size]]}>
          {value ?? placeholder}
        </Text>
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modal}>
            {React.Children.map(children, (child) => (
              <Pressable onPress={handleSelect}>{child}</Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  pressed: {
    opacity: 0.9,
  },

  text: {
    color: "#374151", // gray-700
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },

  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: "40%",
  },
  medium: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: "50%",
  },
  large: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "70%",
  },
});

const textSizes = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 18,
  },
});
