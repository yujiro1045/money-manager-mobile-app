import React, { ReactNode, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { LucideIcon } from "./icons/LucideIcon";

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
        <LucideIcon
          name={open ? "ChevronUp" : "ChevronDown"}
          size={20}
          color="#6B6FE0"
        />
      </Pressable>

      <Modal transparent visible={open} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{placeholder}</Text>
              </View>
              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                {React.Children.map(children, (child) => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                      onPress: () => {
                        (child.props as { onPress?: () => void }).onPress?.();
                        handleSelect();
                      },
                    } as any);
                  }
                  return child;
                })}
              </ScrollView>
            </View>
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
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
    shadowColor: "#6B6FE0",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  pressed: {
    opacity: 0.85,
    borderColor: "#6B6FE0",
  },

  text: {
    color: "#1F2937",
    fontWeight: "600",
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  modalHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#F9FAFB",
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  optionsList: {
    maxHeight: 300,
    flex: 0,
  },
});

const sizeStyles = StyleSheet.create({
  small: {
    paddingVertical: 10,
    width: "48%",
  },
  medium: {
    paddingVertical: 12,
    width: "60%",
  },
  large: {
    paddingVertical: 14,
    width: "75%",
  },
});

const textSizes = StyleSheet.create({
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 15,
  },
  large: {
    fontSize: 16,
  },
});
