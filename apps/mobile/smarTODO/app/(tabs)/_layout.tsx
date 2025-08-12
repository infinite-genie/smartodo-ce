import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { Icon, useTheme } from "@rneui/themed";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grey3,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.divider,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="material" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Icon name="explore" type="material" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
