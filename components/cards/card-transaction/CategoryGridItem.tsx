import { PRIMARY } from "@/constants/theme2";
import { CategoryItem } from "@/hooks/useCardTransaction";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { LucideIcon } from "../../ui/icons/LucideIcon";

type Props = {
  item: CategoryItem;
  isSelected: boolean;
  isProtected: boolean;
  editMode: boolean;
  onPress: () => void;
  onDelete: () => void;
};

export default function CategoryGridItem({
  item,
  isSelected,
  isProtected,
  editMode,
  onPress,
  onDelete,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.sheetItem, isSelected && styles.sheetItemSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.sheetItemIconBox,
          isSelected && styles.sheetItemIconBoxSelected,
        ]}
      >
        <LucideIcon
          name={item.icon}
          size={22}
          color={isSelected ? PRIMARY : "#64748B"}
        />
      </View>

      {isSelected ? (
        <View style={styles.sheetCheckBadge}>
          <LucideIcon name="Check" size={12} color="#fff" />
        </View>
      ) : null}

      {editMode && !isProtected ? (
        <Animated.View
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(150)}
          style={styles.deleteBadge}
        >
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <LucideIcon name="X" size={12} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      ) : null}

      {/* Antes "General" simplemente no mostraba nada en modo edición, lo
          que se veía como un bug (¿por qué esta no tiene el badge rojo?).
          El candado comunica explícitamente "está protegida". */}
      {editMode && isProtected ? (
        <Animated.View
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(150)}
          style={styles.lockBadge}
        >
          <LucideIcon name="Lock" size={11} color="#fff" />
        </Animated.View>
      ) : null}

      <Text
        style={[
          styles.sheetItemLabel,
          isSelected && styles.sheetItemLabelSelected,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sheetItem: {
    width: "30%",
    flexGrow: 1,
    flexBasis: "30%",
    alignItems: "center",
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    maxWidth: "31%",
  },
  sheetItemSelected: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: PRIMARY,
    paddingVertical: 12.5,
    paddingHorizontal: 2.5,
  },
  sheetItemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetItemIconBoxSelected: {
    backgroundColor: "#DBEAFE",
  },
  sheetCheckBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetItemLabel: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
    textAlign: "center",
  },
  sheetItemLabelSelected: {
    color: PRIMARY,
    fontWeight: "600",
  },
  deleteBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  lockBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});
