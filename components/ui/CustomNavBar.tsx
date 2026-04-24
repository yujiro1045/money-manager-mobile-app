import CardTransaction from "@/components/cards/CardTransaction";
import {
  DashboardIcon,
  HomeIcon,
  ProfileIcon,
  TransactionIcon,
} from "@/components/ui/icons/tabs-icons";
import { PRIMARY_COLOR, SECONDARY_COLOR } from "@/constants/theme2";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text } from "@react-navigation/elements";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import NavBarNotch, {
  BAR_HEIGHT,
  BAR_WIDTH,
  NOTCH_RADIUS,
} from "./NavBarNotch";

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const [showSheet, setShowSheet] = useState(false);
  //const [showSuccess, setShowSuccess] = useState(false);

  const routes = state.routes;
  const mid = Math.floor(routes.length / 2);
  const leftRoutes = routes.slice(0, mid);
  const rightRoutes = routes.slice(mid);

  const renderTab = (route: (typeof routes)[0], index: number) => {
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={[
          styles.tabItem,
          { backgroundColor: isFocused ? SECONDARY_COLOR : "transparent" },
        ]}
      >
        {getIconByRouteName(
          route.name,
          isFocused ? PRIMARY_COLOR : SECONDARY_COLOR,
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.svgContainer}>
          <NavBarNotch color={PRIMARY_COLOR} />
          <View style={styles.tabsRow}>
            <View style={styles.tabGroup}>
              {leftRoutes.map((route, i) => renderTab(route, i))}
            </View>
            <View style={{ width: NOTCH_RADIUS * 2 + 20 }} />
            <View style={styles.tabGroup}>
              {rightRoutes.map((route, i) => renderTab(route, mid + i))}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowSheet(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showSheet}
        animationType="slide"
        transparent
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.backdrop}
          onPress={() => setShowSheet(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <CardTransaction
                onSubmit={() => {
                  setShowSheet(false);
                }}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/*  <CustomModal
        visible={showSuccess}
        title="¡Transacción añadida!"
        message="Tu transacción se registró correctamente."
        confirmText="Aceptar"
        onConfirm={() => setShowSuccess(false)}
      /> */}
    </>
  );

  function getIconByRouteName(routeName: string, color: string) {
    switch (routeName) {
      case "index":
        return <HomeIcon size={18} color={color} />;
      case "transactions":
        return <TransactionIcon size={18} color={color} />;
      case "dashboard":
        return <DashboardIcon size={18} color={color} />;
      case "profile":
        return <ProfileIcon size={18} color={color} />;
      default:
        return <HomeIcon size={18} color={color} />;
    }
  }
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 15,
    alignSelf: "center",
    width: BAR_WIDTH,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },

  svgContainer: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
  },

  tabsRow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  tabGroup: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  tabItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 30,
  },

  addButton: {
    position: "absolute",
    top: -(NOTCH_RADIUS - 10),
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    backgroundColor: SECONDARY_COLOR,
    shadowColor: SECONDARY_COLOR,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 10,
  },

  addButtonText: {
    fontSize: 30,
    fontWeight: "700",
    color: PRIMARY_COLOR,
    lineHeight: 34,
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
    backgroundColor: "#F3F4F6",
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
});

export default CustomNavBar;
