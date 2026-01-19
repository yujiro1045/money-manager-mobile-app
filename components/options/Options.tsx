import { Text, View } from "react-native";

function Option({
  label,
  value,
  right,
}: {
  label: string;
  value?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.option}>
      <Text style={styles.optionText}>{label}</Text>
      {right ? right : <Text style={styles.optionValue}>{value ?? ">"}</Text>}
    </View>
  );
}
