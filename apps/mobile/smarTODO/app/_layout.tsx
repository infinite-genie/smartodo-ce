import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";

import { useColorScheme } from "@/hooks/useColorScheme";
import tamaguiConfig from "../tamagui.config";

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
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    VarelaRound: VarelaRound_400Regular,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <Slot />
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
