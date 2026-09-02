import { LucideIcon } from "./LucideIcon";

export const HomeIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="House" size={size} color={color} />;

export const TransactionIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="Repeat" size={size} color={color} />;

export const DashboardIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="LayoutDashboard" size={size} color={color} />;

export const ProfileIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="CircleUser" size={size} color={color} />;
