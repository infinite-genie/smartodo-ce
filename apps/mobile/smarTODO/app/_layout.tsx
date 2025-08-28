import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";
import { AuthProvider } from "../contexts/AuthContext";
import { KeyboardProvider } from "react-native-keyboard-controller";

import tamaguiConfig from "../tamagui.config";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * App root layout that provides theming and loads app fonts before rendering.
 *
 * Loads custom fonts (VarelaRound and SpaceMono) and returns null until the fonts are ready.
 * Once loaded, it wraps nested routes (Stack) in a TamaguiProvider using the light theme
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
  // after auth state is also ready

  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <AuthProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen
              name="reset-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="update-password"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="profile" options={{ headerShown: false }} />
            <Stack.Screen
              name="profileEdit"
              options={{
                presentation: "modal",
                headerShown: false,
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </AuthProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
