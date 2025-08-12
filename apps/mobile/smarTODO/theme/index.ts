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

// Dark mode colors
const darkColors = {
  // Primary color and variations (slightly brighter for dark mode)
  primary: "#FF5722",
  primaryLight: "#FF8A65",
  primaryDark: "#D84315",
  primaryVeryLight: "#3D2520",

  // Secondary color
  secondary: "#2196F3",
  secondaryLight: "#64B5F6",
  secondaryDark: "#1565C0",

  // Neutral colors (inverted for dark mode)
  white: "#000000",
  black: "#FFFFFF",
  grey0: "#1A1A1A",
  grey1: "#2A2A2A",
  grey2: "#3D3D3D",
  grey3: "#525252",
  grey4: "#757575",
  grey5: "#BDBDBD",
  greyOutline: "#3D3D3D",
  searchBg: "#2A2A2A",

  // Semantic colors (adjusted for dark mode)
  success: "#66BB6A",
  warning: "#FFA726",
  error: "#EF5350",
  info: "#42A5F5",

  // Background colors (dark variants)
  background: "#121212",
  backgroundSecondary: "#1E1E1E",
  backgroundTertiary: "#2A2A2A",

  // Text colors (inverted for dark mode)
  textPrimary: "#F5F5F5",
  textSecondary: "#B3B3B3",
  textTertiary: "#808080",
  textDisabled: "#525252",
  textInverse: "#121212",

  // Border colors (darker)
  border: "#3D3D3D",
  divider: "#2A2A2A",

  // Shadow colors (lighter for dark mode)
  shadow: Platform.OS === "ios" ? "#FFFFFF" : "#FFFFFF29",

  // Overlay
  overlay: "rgba(255, 255, 255, 0.1)",
};

export const lightTheme = createTheme({
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

// Create dark theme
export const darkTheme = createTheme({
  mode: "dark",
  darkColors: {
    primary: darkColors.primary,
    secondary: darkColors.secondary,
    success: darkColors.success,
    warning: darkColors.warning,
    error: darkColors.error,
    white: darkColors.white,
    black: darkColors.black,
    grey0: darkColors.grey0,
    grey1: darkColors.grey1,
    grey2: darkColors.grey2,
    grey3: darkColors.grey3,
    grey4: darkColors.grey4,
    grey5: darkColors.grey5,
    greyOutline: darkColors.greyOutline,
    searchBg: darkColors.searchBg,
    background: darkColors.background,
    divider: darkColors.divider,
  },
});

// For backward compatibility, export lightTheme as theme
export const theme = lightTheme;

// Function to get theme based on color scheme
export const getTheme = (colorScheme: "light" | "dark" | null) => {
  switch (colorScheme) {
    case "dark":
      return darkTheme;
    case "light":
      return lightTheme;
    default:
      // Default to light theme when colorScheme is null or undefined
      return lightTheme;
  }
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
