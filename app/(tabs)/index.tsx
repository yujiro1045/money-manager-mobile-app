import Header from "@/components/header/Header";
import { BACKGROUND } from "@/constants/theme2";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={[styles.safe]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        {/* <Pressable style={styles.logoutButton}>
          <Text onPress={logoutUser} style={styles.logoutText}>
            cerrar sesion
          </Text>
        </Pressable>
        <View>
          <View style={styles.cuadro}></View>
          <View style={styles.cuadro}></View>
          <View style={styles.cuadro}></View>
        </View> */}
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cuadro: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "red",
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
