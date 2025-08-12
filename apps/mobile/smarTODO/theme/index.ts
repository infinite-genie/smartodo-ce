import { Platform } from "react-native";
import { createTheme } from "@rneui/themed";

const colors = {
  // Primary color and variations
  primary: "#E64D13",
  primaryLight: "#FF7946",
  primaryDark: "#B33A0E",
  primaryVeryLight: "#FFE5DD",

  // Secondary color (complementary blue)
  secondary: "#1384E6",
  secondaryLight: "#4DA3FF",
  secondaryDark: "#0E5FA3",

  // Neutral colors
  white: "#FFFFFF",
  black: "#000000",
  grey0: "#F8F8F8",
  grey1: "#E8E8E8",
  grey2: "#D3D3D3",
  grey3: "#BABABA",
  grey4: "#848484",
  grey5: "#4A4A4A",
  greyOutline: "#D3D3D3",
  searchBg: "#F5F5F5",

  // Semantic colors
  success: "#52C41A",
  warning: "#FAAD14",
  error: "#FF4D4F",
  info: "#1890FF",

  // Background colors
  background: "#FFFFFF",
  backgroundSecondary: "#F8F9FA",
  backgroundTertiary: "#F0F2F5",

  // Text colors
  textPrimary: "#262626",
  textSecondary: "#595959",
  textTertiary: "#8C8C8C",
  textDisabled: "#BFBFBF",
  textInverse: "#FFFFFF",

  // Border colors
  border: "#E8E8E8",
  divider: "#F0F0F0",

  // Shadow colors
  shadow: Platform.OS === "ios" ? "#000000" : "#00000029",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.5)",
};

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    white: colors.white,
    black: colors.black,
    grey0: colors.grey0,
    grey1: colors.grey1,
    grey2: colors.grey2,
    grey3: colors.grey3,
    grey4: colors.grey4,
    grey5: colors.grey5,
    greyOutline: colors.greyOutline,
    searchBg: colors.searchBg,
    background: colors.background,
    divider: colors.divider,
  },
});

// Function to get theme based on color scheme
export const getTheme = (colorScheme: "light" | "dark" | null) => {
  // For now, return the light theme regardless of color scheme
  // Can be extended later to support dark theme
  return theme;
};

// Export individual color palette for custom usage
export const appColors = colors;

// Export typography styles
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600" as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
};

// Export spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Export shadow styles
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
