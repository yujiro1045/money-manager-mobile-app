import { LucideIcon } from "./LucideIcon";

export const LoginIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="CircleDollarSign" size={size} color={color} />;

export const RegisterIcon = ({
  size = 24,
  color,
}: {
  size?: number;
  color: string;
}) => <LucideIcon name="ChartColumn" size={size} color={color} />;