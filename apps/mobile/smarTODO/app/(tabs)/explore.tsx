import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";
import { appColors } from "@/theme";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>
        Explore
      </Text>
      <Text style={styles.subtitle}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: appColors.textPrimary,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    color: appColors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
});
