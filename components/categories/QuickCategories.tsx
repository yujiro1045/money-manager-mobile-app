import { useQuickCategories } from "@/hooks/useQuickCategories";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LucideIcon } from "../ui/icons/LucideIcon";

import { PRIMARY_COLOR } from "@/constants/theme2";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import CardTransaction from "../cards/CardTransaction";
import AnimatedBottomSheet from "../ui/AnimatedBottomSheet";

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
    sheetKey,
    visibleCategories,
    allCategories,
  } = useQuickCategories();

  const expenseCategories = allCategories.filter((c) => c.type === "expense");
  const incomeCategories = allCategories.filter((c) => c.type === "income");

  const renderCategory = (cat: (typeof allCategories)[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        {
          borderRightWidth: 3,
          borderRightColor: cat.type === "expense" ? "#E53935" : "#2E7D32",
        },
      ]}
      onPress={() => handlePress(cat)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: cat.type === "expense" ? "#FFF0F0" : "#F0FFF4" },
        ]}
      >
        <LucideIcon
          name={cat.icon}
          size={24}
          color={cat.type === "expense" ? "#E53935" : "#2E7D32"}
        />
      </View>
      <Text style={styles.itemLabel} numberOfLines={2}>
        {cat.label}
      </Text>
    </TouchableOpacity>
  );

  const renderSectionTitle = (label: string, type: "expense" | "income") => {
    const color = type === "expense" ? "#E53935" : "#2E7D32";
    const bg = type === "expense" ? "#FFF0F0" : "#F0FFF4";
    return (
      <View style={[styles.sectionTitleBadge, { backgroundColor: bg }]}>
        <View style={[styles.sectionTitleDot, { backgroundColor: color }]} />
        <Text style={[styles.sectionTitleText, { color }]}>{label}</Text>
      </View>
    );
  };

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
            {row.length < 4 &&
              Array.from({ length: 4 - row.length }).map((_, i) => (
                <View key={`filler-${i}`} style={styles.cardFiller} />
              ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleCategory}>Categorias rapidas</Text>
        <View style={styles.row}>
          {visibleCategories
            .slice(0, 4)
            .map((cat, i) => renderCategory(cat, i))}
        </View>

        <View style={styles.row}>
          {visibleCategories
            .slice(4, 7)
            .map((cat, i) => renderCategory(cat, i + 4))}
          <TouchableOpacity style={styles.card} onPress={openAll}>
            <View style={[styles.iconBox, { backgroundColor: "#F3F4F6" }]}>
              <LucideIcon name="Ellipsis" size={24} color="#6B7280" />
            </View>
            <Text style={styles.itemLabel}>Ver todo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AnimatedBottomSheet visible={showAll} onClose={closeAll}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Todas las categorías</Text>
            <TouchableOpacity
              onPress={closeAll}
              style={styles.closeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <LucideIcon name="X" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              {renderSectionTitle("Gastos", "expense")}
              {renderCategoryGrid(expenseCategories)}
            </View>

            <View style={[styles.section, styles.lastSection]}>
              {renderSectionTitle("Ingresos", "income")}
              {renderCategoryGrid(incomeCategories)}
            </View>
          </ScrollView>
        </View>
      </AnimatedBottomSheet>

      <AnimatedBottomSheet visible={showSheet} onClose={closeSheet}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <CardTransaction
              key={sheetKey}
              defaultCategory={selectedCat?.label}
              defaultType={selectedCat?.type}
              defaultIcon={selectedCat?.icon}
              onSubmit={handleSubmit}
            />
          </KeyboardAwareScrollView>
        </View>
      </AnimatedBottomSheet>
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
  titleCategory: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 6,
    minHeight: 92,
    borderWidth: 1,
    borderColor: "#F1F2F4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardFiller: {
    flex: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 11,
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 14,
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },

  scrollContent: {
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },

  lastSection: {
    marginBottom: 12,
  },

  sectionTitleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 14,
  },
  sectionTitleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitleText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
