module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "@tamagui/babel-plugin",
      {
        components: [
          "@tamagui/config",
          "@tamagui/core",
          "@tamagui/text",
          "@tamagui/button",
          "@tamagui/stacks",
          "@tamagui/input",
          "@tamagui/avatar",
          "@tamagui/separator",
          "@tamagui/lucide-icons",
        ],
        config: "./tamagui.config.ts", // Path to your Tamagui config
        logTimings: true, // Optional: see build time logs
        disableExtraction: process.env.NODE_ENV === "development", // Enable extraction only in production
      },
    ],
    "react-native-reanimated/plugin", // Ensure this is last
  ],
};
