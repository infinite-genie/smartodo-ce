module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "@tamagui/babel-plugin",
      {
        components: ["@tamagui/core", "@tamagui/text"],
        config: "./tamagui.config.ts", // Path to your Tamagui config
        logTimings: true, // Optional: see build time logs
        disableExtraction: process.env.NODE_ENV === "development", // Enable extraction only in production
      },
    ],
    "expo-router/babel",
    "react-native-reanimated/plugin", // Ensure this is last
  ],
};
