import { config } from "@tamagui/config";
import { createTamagui, createFont } from "@tamagui/core";

// Linear interpolation helper
const lerp = (min: number, max: number, t: number): number => {
  return min + (max - min) * t;
};

// Clamp value to range
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Helper function to generate color scale from a base color
const generateColorScale = (baseColor: string, isDark = false) => {
  const primaryHsl = hexToHsl(baseColor);
  const colors: Record<string, string> = {};

  // Constants for consistent lightness distribution
  const totalSteps = 12;
  const minLight = isDark ? 10 : 90; // Dark theme: starts dark, Light theme: starts light
  const maxLight = isDark ? 90 : 10; // Dark theme: ends light, Light theme: ends dark

  for (let i = 1; i <= totalSteps; i++) {
    // Compute normalized position (0 to 1)
    const position = (i - 1) / (totalSteps - 1);

    // Linear interpolation between min and max lightness
    let lightness = lerp(minLight, maxLight, position);

    // Clamp to safe range [2, 98]
    lightness = clamp(lightness, 2, 98);

    colors[`color${i}`] = hslToHex(primaryHsl.h, primaryHsl.s, lightness);
  }

  return colors;
};

// Helper functions for color conversion
const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToHex = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const lightColorScale = generateColorScale("#E64D13", false);
const darkColorScale = generateColorScale("#E64D13", true);

// Create Varela Round font configuration
const varelaRoundFont = createFont({
  family: "VarelaRound",
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 15,
    6: 16,
    7: 18,
    8: 20,
    9: 24,
    10: 27,
    11: 32,
    12: 40,
    13: 48,
    14: 56,
    15: 64,
    16: 72,
  },
  lineHeight: {
    1: 17,
    2: 20,
    3: 22,
    4: 24,
    5: 26,
    6: 28,
    7: 30,
    8: 33,
    9: 38,
    10: 44,
    11: 50,
    12: 60,
    13: 72,
    14: 84,
    15: 96,
    16: 108,
  },
  weight: {
    1: "400",
    2: "400",
    3: "400",
    4: "400",
    5: "400",
    6: "400",
    7: "400",
    8: "400",
    9: "400",
  },
  letterSpacing: {
    1: 0,
    2: -0.1,
    3: -0.2,
    4: -0.3,
    5: -0.4,
    6: -0.5,
    7: -0.6,
    8: -0.7,
    9: -0.8,
    10: -0.9,
    11: -1,
    12: -1.1,
    13: -1.2,
    14: -1.3,
    15: -1.4,
    16: -1.5,
  },
  face: {
    400: { normal: "VarelaRound" },
  },
});

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    heading: varelaRoundFont,
    body: varelaRoundFont,
    mono: createFont({
      ...varelaRoundFont,
      family: "SpaceMono",
      face: {
        400: { normal: "SpaceMono" },
      },
    }),
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      ...lightColorScale,
      background: "#ffffff",
      backgroundHover: "#f8f8f8",
      backgroundPress: "#f0f0f0",
      backgroundFocus: "#f5f5f5",
      borderColor: "#e0e0e0",
      borderColorHover: "#d0d0d0",
      borderColorPress: "#c0c0c0",
      borderColorFocus: lightColorScale.color9,
      color: "#000000",
      colorHover: "#333333",
      colorPress: "#666666",
      colorFocus: "#000000",
      colorTransparent: "rgba(0,0,0,0)",
      placeholderColor: "#999999",
      outlineColor: lightColorScale.color9,
    },
    dark: {
      ...config.themes.dark,
      ...darkColorScale,
      background: "#111111",
      backgroundHover: "#1a1a1a",
      backgroundPress: "#222222",
      backgroundFocus: "#1a1a1a",
      borderColor: "#333333",
      borderColorHover: "#444444",
      borderColorPress: "#555555",
      borderColorFocus: darkColorScale.color9,
      color: "#ffffff",
      colorHover: "#cccccc",
      colorPress: "#999999",
      colorFocus: "#ffffff",
      colorTransparent: "rgba(255,255,255,0)",
      placeholderColor: "#666666",
      outlineColor: darkColorScale.color9,
    },
  },
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      primary: "#E64D13",
      primaryDark: "#C73E0F",
      primaryLight: "#F55D1C",
    },
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
