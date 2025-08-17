import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";

import { useColorScheme } from "@/hooks/useColorScheme";
import tamaguiConfig from "../tamagui.config";

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
