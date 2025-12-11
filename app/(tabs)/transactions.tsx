import { StyleSheet, Text, View } from "react-native";

export default function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola soy transaction</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    color: "#fff",
  },
});
