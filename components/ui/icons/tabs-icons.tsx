import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export const HomeIcon = ({
  size = 28,
  color,
}: {
  size?: number;
  color: string;
}) => <FontAwesome5 name="home" size={size} color={color} />;
