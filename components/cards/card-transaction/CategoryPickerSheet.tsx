import { TEXT } from "@/constants/theme2";
import { CategoryItem } from "@/hooks/useCardTransaction";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedBottomSheet from "../../ui/AnimatedBottomSheet";
import { LucideIcon } from "../../ui/icons/LucideIcon";
import CategoryGridItem from "./CategoryGridItem";

const SCREEN_HEIGHT = Dimensions.get("window").height;

type Props = {
  visible: boolean;
  editMode: boolean;
  onCloseEditMode: () => void;
  onClose: () => void;
  categorySearch: string;
  onChangeSearch: (text: string) => void;
  filteredCategoryItems: CategoryItem[];
  selectedCategory: string | null;
  onSelectCategory: (value: string) => void;
  onLongPressItem: () => void;
  onDeleteItem: (item: CategoryItem) => void;
};

export default function CategoryPickerSheet({
  visible,
  editMode,
  onCloseEditMode,
  onClose,
  categorySearch,
  onChangeSearch,
  filteredCategoryItems,
  selectedCategory,
  onSelectCategory,
  onLongPressItem,
  onDeleteItem,
}: Props) {
  return (
    <AnimatedBottomSheet
      visible={visible}
      onClose={() => {
        onCloseEditMode();
        onClose();
      }}
      onBackdropPress={() => {
        if (editMode) {
          onCloseEditMode();
        } else {
          onChangeSearch("");
          onClose();
        }
      }}
    >
      <View style={styles.sheetContainer}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Selecciona categoría</Text>
          <TouchableOpacity
            onPress={() => {
              onChangeSearch("");
              onClose();
            }}
            style={styles.sheetClose}
          >
            <LucideIcon name="X" size={22} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <LucideIcon name="Search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar categoría..."
            placeholderTextColor="#9CA3AF"
            value={categorySearch}
            onChangeText={onChangeSearch}
            autoCorrect={false}
            returnKeyType="search"
          />
          {categorySearch.length > 0 && (
            <TouchableOpacity
              onPress={() => onChangeSearch("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <LucideIcon name="X" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {filteredCategoryItems.length === 0 ? (
          <View style={styles.sheetEmpty}>
            <LucideIcon name="Search" size={28} color="#CBD5E1" />
            <Text style={styles.sheetEmptyText}>
              Sin resultados para “{categorySearch.trim()}”
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ maxHeight: SCREEN_HEIGHT * 0.55 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetGrid}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCategoryItems.map((item) => {
              const isSelected = selectedCategory === item.value;
              const isProtected = item.value === "General";

              return (
                <CategoryGridItem
                  key={item.value}
                  item={item}
                  isSelected={isSelected}
                  isProtected={isProtected}
                  editMode={editMode}
                  onPress={() => {
                    if (editMode) return;
                    onSelectCategory(item.value);
                  }}
                  onLongPress={onLongPressItem}
                  onDelete={() => onDeleteItem(item)}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </AnimatedBottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
  sheetClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
    marginHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT,
  },
  sheetEmpty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 36,
    gap: 10,
  },
  sheetEmptyText: {
    fontSize: 14,
    color: "#94A3B8",
  },
  sheetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
});
