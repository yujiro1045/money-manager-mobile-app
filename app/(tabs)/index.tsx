import CardBalance from "@/components/cards/CardBalance";
import CardTransaction from "@/components/cards/CardTransaction";
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
        <CardBalance />
        <CardTransaction />
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BACKGROUND },
  container: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 8,
  },
});
