import { ALL_CATEGORIES, useQuickCategories } from "@/hooks/useQuickCategories";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CardTransaction from "../cards/CardTransaction";

const QuickCategories = () => {
  const {
    closeAll,
    closeSheet,
    handlePress,
    handleSubmit,
    openAll,
    selectedCat,
    showAll,
    showSheet,
    visibleCategories,
  } = useQuickCategories();

  const renderCategory = (cat: (typeof ALL_CATEGORIES)[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={() => handlePress(cat)}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: cat.type === "expense" ? "#FFF0F0" : "#F0FFF4" },
        ]}
      >
        <MaterialCommunityIcons
          name={cat.icon as any}
          size={26}
          color={cat.type === "expense" ? "#E53935" : "#2E7D32"}
        />
      </View>
      <Text style={styles.itemLabel} numberOfLines={1}>
        {cat.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          {visibleCategories
            .slice(0, 4)
            .map((cat, i) => renderCategory(cat, i))}
        </View>

        <View style={styles.row}>
          {visibleCategories
            .slice(4, 7)
            .map((cat, i) => renderCategory(cat, i + 4))}
          <TouchableOpacity style={styles.item} onPress={openAll}>
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={26}
                color="#6B7280"
              />
            </View>
            <Text style={styles.itemLabel}>Ver todo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showAll}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={closeAll} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Todas las categorías</Text>
            <FlatList
              data={ALL_CATEGORIES}
              keyExtractor={(item, i) => `${item.label}-${i}`}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              columnWrapperStyle={styles.row}
              renderItem={({ item, index }) => renderCategory(item, index)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSheet}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <TouchableOpacity style={styles.backdrop} onPress={closeSheet} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={60}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <CardTransaction
                defaultCategory={selectedCat?.label}
                defaultType={selectedCat?.type}
                onSubmit={handleSubmit}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default QuickCategories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 24,
  },
  seeAllIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 2,
  },
  itemLabel: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
});
