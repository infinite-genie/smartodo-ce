import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";
import { AuthProvider } from "../contexts/AuthContext";

import tamaguiConfig from "../tamagui.config";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * App root layout that provides theming and loads app fonts before rendering.
 *
 * Loads custom fonts (VarelaRound and SpaceMono) and returns null until the fonts are ready.
 * Once loaded, it wraps nested routes (Slot) in a TamaguiProvider using the light theme
 * and renders the platform StatusBar.
 *
 * @returns The root layout element to render when app fonts have finished loading.
 */
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    VarelaRound: VarelaRound_400Regular,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Don't hide splash screen here - let the index screen handle it
  // after both fonts and auth state are ready

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <AuthProvider>
        <Slot />
        <StatusBar style="auto" />
      </AuthProvider>
    </TamaguiProvider>
  );
}
