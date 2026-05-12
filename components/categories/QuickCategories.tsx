import { useQuickCategories } from "@/hooks/useQuickCategories";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
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
    allCategories,
  } = useQuickCategories();

  const expenseCategories = allCategories.filter((c) => c.type === "expense");
  const incomeCategories = allCategories.filter((c) => c.type === "income");

  const renderCategory = (cat: (typeof allCategories)[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.item}
      onPress={() => handlePress(cat)}
      activeOpacity={0.7}
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

  const renderCategoryGrid = (categories: typeof allCategories) => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 4) {
      rows.push(categories.slice(i, i + 4));
    }
    return (
      <View>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cat, catIndex) => renderCategory(cat, catIndex))}
          </View>
        ))}
      </View>
    );
  };

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
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Todas las categorías</Text>
              <TouchableOpacity onPress={closeAll} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gastos</Text>
                {renderCategoryGrid(expenseCategories)}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingresos</Text>
                {renderCategoryGrid(incomeCategories)}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSheet}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.backdropArea}
            onPress={closeSheet}
            activeOpacity={1}
          />

          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <KeyboardAwareScrollView
              bottomOffset={62}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <CardTransaction
                defaultCategory={selectedCat?.label}
                defaultType={selectedCat?.type}
                onSubmit={handleSubmit}
              />
            </KeyboardAwareScrollView>
          </View>
        </View>
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
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    paddingBottom: 40,
    maxHeight: "90%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  backdropArea: {
    flex: 1,
  },
});
