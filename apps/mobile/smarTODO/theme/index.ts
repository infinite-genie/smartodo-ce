import { Platform } from "react-native";

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

export const theme = {
  colors,

  // Component-specific theming
  Button: {
    raised: true,
    buttonStyle: {
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
    },
    titleStyle: {
      fontSize: 16,
      fontWeight: "600",
    },
    disabledStyle: {
      backgroundColor: colors.grey2,
    },
    disabledTitleStyle: {
      color: colors.textDisabled,
    },
  },

  Input: {
    containerStyle: {
      paddingHorizontal: 0,
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 8,
    },
    inputStyle: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    placeholderTextColor: colors.textTertiary,
    labelStyle: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 8,
    },
    errorStyle: {
      color: colors.error,
      fontSize: 12,
      marginTop: 4,
    },
  },

  Card: {
    containerStyle: {
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 0,
    },
  },

  ListItem: {
    containerStyle: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.white,
    },
    titleStyle: {
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    subtitleStyle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
  },

  Header: {
    backgroundColor: colors.primary,
    centerComponent: {
      style: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "600",
      },
    },
    leftComponent: {
      color: colors.white,
    },
    rightComponent: {
      color: colors.white,
    },
    statusBarProps: {
      backgroundColor: colors.primaryDark,
      barStyle: "light-content",
    },
  },

  CheckBox: {
    containerStyle: {
      backgroundColor: "transparent",
      borderWidth: 0,
      padding: 0,
      marginLeft: 0,
      marginRight: 0,
    },
    textStyle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "400",
    },
    checkedColor: colors.primary,
    uncheckedColor: colors.grey3,
  },

  Badge: {
    badgeStyle: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    textStyle: {
      fontSize: 12,
      color: colors.white,
      fontWeight: "600",
    },
  },

  Avatar: {
    rounded: true,
    overlayContainerStyle: {
      backgroundColor: colors.grey2,
    },
    titleStyle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: "600",
    },
  },

  Icon: {
    color: colors.textSecondary,
    size: 24,
  },

  Text: {
    style: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    h1Style: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    h2Style: {
      fontSize: 28,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 14,
    },
    h3Style: {
      fontSize: 24,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 12,
    },
    h4Style: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 10,
    },
  },

  SearchBar: {
    containerStyle: {
      backgroundColor: "transparent",
      borderTopWidth: 0,
      borderBottomWidth: 0,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    inputContainerStyle: {
      backgroundColor: colors.searchBg,
      borderRadius: 8,
    },
    inputStyle: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    placeholderTextColor: colors.textTertiary,
  },

  Divider: {
    style: {
      backgroundColor: colors.divider,
      height: 1,
    },
  },

  FAB: {
    color: colors.primary,
    style: {
      bottom: 16,
      right: 16,
    },
    titleStyle: {
      color: colors.white,
    },
  },

  Chip: {
    buttonStyle: {
      backgroundColor: colors.grey0,
      borderColor: colors.border,
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    titleStyle: {
      color: colors.textPrimary,
      fontSize: 14,
    },
    iconStyle: {
      color: colors.textSecondary,
    },
  },

  Switch: {
    trackColor: {
      true: colors.primaryLight,
      false: colors.grey2,
    },
    thumbColor: colors.primary,
  },

  Slider: {
    thumbStyle: {
      backgroundColor: colors.primary,
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    trackStyle: {
      height: 4,
      backgroundColor: colors.grey2,
      borderRadius: 2,
    },
    minimumTrackTintColor: colors.primary,
    maximumTrackTintColor: colors.grey2,
  },
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
