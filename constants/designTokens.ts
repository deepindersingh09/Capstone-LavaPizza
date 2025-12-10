/**
 * Design Tokens - Central source of truth for app styling
 * Supports both light and dark modes
 */

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_WEIGHT = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

// Brand Colors
export const BRAND_COLORS = {
  primary: "#f8a831", // Lava Pizza Orange
  primaryDark: "#d9901c",
  secondary: "#FFC800", // Lava Pizza Yellow
  secondaryLight: "#FFF2B8",
  accent: "#f0e249",
  danger: "#ff4444",
  success: "#00C851",
  warning: "#ffbb33",
  info: "#33b5e5",
} as const;

// Light Theme Colors
export const LIGHT_COLORS = {
  background: "#ffffff",
  backgroundSecondary: "#fff9ed",
  backgroundTertiary: "#f5f5f5",

  surface: "#ffffff",
  surfaceHighlight: "#FFF2B8",

  text: "#222222",
  textSecondary: "#666666",
  textTertiary: "#888888",
  textInverse: "#ffffff",

  border: "#eeeeee",
  borderLight: "#f0f0f0",
  borderDark: "#dddddd",

  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.2)",

  ...BRAND_COLORS,
} as const;

// Dark Theme Colors
export const DARK_COLORS = {
  background: "#121212",
  backgroundSecondary: "#1e1e1e",
  backgroundTertiary: "#2a2a2a",

  surface: "#1e1e1e",
  surfaceHighlight: "#2a2a2a",

  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textTertiary: "#808080",
  textInverse: "#222222",

  border: "#333333",
  borderLight: "#2a2a2a",
  borderDark: "#444444",

  shadow: "rgba(0, 0, 0, 0.4)",
  shadowDark: "rgba(0, 0, 0, 0.6)",

  ...BRAND_COLORS,
} as const;

// Elevation/Shadow presets
export const ELEVATION = {
  none: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

export type Theme = typeof LIGHT_COLORS;
export type ThemeMode = "light" | "dark";
