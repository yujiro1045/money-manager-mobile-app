import { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LUCIDE_CATEGORIES } from "../../ui/icons/lucideCategories";
import { LucideIcon } from "../../ui/icons/LucideIcon";

const MAX_ICONS = 200;
const PAGE_SIZE = 40;

const ICONS = LUCIDE_CATEGORIES.slice(0, MAX_ICONS);

type Props = {
  visible: boolean;
  onClose: () => void;
  pickerIcon: string;
  onSelectIcon: (icon: string) => void;
};

export default function IconPickerModal({
  visible,
  onClose,
  pickerIcon,
  onSelectIcon,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Se monta solo mientras el modal está abierto: así la cantidad
          visible vuelve a 40 sin necesidad de useEffect. */}
      {visible && (
        <IconPickerContent
          onClose={onClose}
          pickerIcon={pickerIcon}
          onSelectIcon={onSelectIcon}
        />
      )}
    </Modal>
  );
}

function IconPickerContent({
  onClose,
  pickerIcon,
  onSelectIcon,
}: Omit<Props, "visible">) {
  const icons = ICONS;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const data = icons.slice(0, visibleCount);
  const hasMore = visibleCount < icons.length;

  return (
    <View style={styles.iconPickerContainer}>
      <View style={styles.iconPickerContent}>
        <View style={styles.iconPickerHeader}>
          <Text style={styles.iconPickerTitle}>Selecciona un icono</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.iconPickerClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={data}
          numColumns={5}
          keyExtractor={(item, index) => `${item}-${index}`}
          contentContainerStyle={styles.iconGrid}
          initialNumToRender={PAGE_SIZE}
          removeClippedSubviews
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={() =>
                  setVisibleCount((c) => Math.min(c + PAGE_SIZE, icons.length))
                }
                activeOpacity={0.7}
              >
                <Text style={styles.loadMoreText}>
                  Cargar más ({visibleCount}/{icons.length})
                </Text>
              </TouchableOpacity>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.iconOption,
                pickerIcon === item && styles.iconOptionSelected,
              ]}
              onPress={() => onSelectIcon(item)}
            >
              <LucideIcon
                name={item}
                size={24}
                color={pickerIcon === item ? "#3B82F6" : "#6B7280"}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconPickerContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  iconPickerContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    maxHeight: "80%",
  },
  iconPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconPickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  iconPickerClose: {
    fontSize: 24,
    color: "#999",
  },
  iconGrid: {
    gap: 12,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  iconOption: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: "18%",
  },
  loadMoreButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#EFF6FF",
  },
  loadMoreText: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },
  iconOptionSelected: {
    backgroundColor: "#E5F7FF",
    borderColor: "#3B82F6",
  },
});
