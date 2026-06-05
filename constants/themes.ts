export const themes = {
  light: {
    // Primary colors
    primary: "#3669C9",
    primaryColor: "#130057",
    secondary: "#fff",

    // Backgrounds
    background: "#e7e9edff",
    card: "#FFFFFF",
    surface: "#F3F4F6",

    // Text
    text: "#121212",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",

    // UI Elements
    border: "#E5E7EB",
    success: "#1DB954",
    error: "#DC2626",
    warning: "#F59E0B",

    // Specific
    muted: "#6F6F6F",
    headerBg: "#1F2A5A",
    inputBg: "#F3F4F6",
    iconColor: "#6B7280",
  },
  dark: {
    // Primary colors
    primary: "#60A5FA",
    primaryColor: "#93C5FD",
    secondary: "#1F2937",

    // Backgrounds
    background: "#0F172A",
    card: "#1F2937",
    surface: "#374151",

    // Text
    text: "#F9FAFB",
    textSecondary: "#D1D5DB",
    textMuted: "#9CA3AF",

    // UI Elements
    border: "#4B5563",
    success: "#10B981",
    error: "#EF4444",
    warning: "#FBBF24",

    // Specific
    muted: "#9CA3AF",
    headerBg: "#111827",
    inputBg: "#374151",
    iconColor: "#D1D5DB",
  },
};

export type Theme = keyof typeof themes;
export type ThemeColors = typeof themes.light;
