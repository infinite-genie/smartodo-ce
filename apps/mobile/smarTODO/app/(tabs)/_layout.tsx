import { Tabs } from "expo-router";
import React from "react";
import { Icon } from "react-native-elements";
import { appColors } from "@/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appColors.primary,
        tabBarInactiveTintColor: appColors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: appColors.background,
          borderTopColor: appColors.border,
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
