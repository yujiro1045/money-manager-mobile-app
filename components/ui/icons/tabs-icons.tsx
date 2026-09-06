import { ColorValue } from "react-native";
import { LucideIcon } from "./LucideIcon";

export const HomeIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: ColorValue;
}) => <LucideIcon name="House" size={size} color={color as string} />;

export const TransactionIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: ColorValue;
}) => <LucideIcon name="Repeat" size={size} color={color as string} />;

export const DashboardIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: ColorValue;
}) => <LucideIcon name="LayoutDashboard" size={size} color={color as string} />;

export const ProfileIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: ColorValue;
}) => <LucideIcon name="CircleUser" size={size} color={color as string} />;
