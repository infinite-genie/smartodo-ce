module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "@tamagui/babel-plugin",
      {
        components: ["tamagui"],
        config: "./tamagui.config.ts", // Path to your Tamagui config
        logTimings: true, // Optional: see build time logs
        disableExtraction: process.env.NODE_ENV === "development", // Enable extraction only in production
      },
    ],
  ],
};
