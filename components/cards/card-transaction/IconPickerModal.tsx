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

const ICON_LIST = LUCIDE_CATEGORIES;

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
    >
      <View style={styles.iconPickerContainer}>
        <View style={styles.iconPickerContent}>
          <View style={styles.iconPickerHeader}>
            <Text style={styles.iconPickerTitle}>Selecciona un icono</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.iconPickerClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={ICON_LIST}
            numColumns={5}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            contentContainerStyle={styles.iconGrid}
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
    </Modal>
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
  iconOptionSelected: {
    backgroundColor: "#E5F7FF",
    borderColor: "#3B82F6",
  },
});
