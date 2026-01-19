import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const HomeIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <FontAwesome5 name="home" size={size} color={color} />;

export const TransactionIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <FontAwesome6 name="money-bill-transfer" size={size} color={color} />;

export const DashboardIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => (
  <MaterialCommunityIcons name="monitor-dashboard" size={size} color={color} />
);
export const ProfileIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => (
  <MaterialCommunityIcons name="account-circle" size={size} color={color} />
);
