import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";

export const LoginIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <Foundation name="dollar" size={size} color={color} />;

export const RegisterIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <Ionicons name="bar-chart" size={size} color={color} />;
