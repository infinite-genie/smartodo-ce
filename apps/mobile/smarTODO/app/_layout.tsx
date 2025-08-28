import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";
import { AuthProvider } from "../contexts/AuthContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Button } from "@tamagui/button";
import { ChevronLeft, Menu, Edit3 } from "@tamagui/lucide-icons";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

import tamaguiConfig from "../tamagui.config";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const headerOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: "#E64D13",
  },
  headerTintColor: "white",
  headerTitleStyle: {
    fontFamily: "VarelaRound",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerShadowVisible: true,
};

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't hide splash screen here - let the index screen handle it
  // after auth state is also ready

  if (!fontsLoaded) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <KeyboardProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <AuthProvider>
          <Stack screenOptions={headerOptions}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen
              name="login"
              options={{
                title: "Welcome Back",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.back()}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Go back"
                    accessible={true}
                    marginLeft={-8}
                  >
                    <ChevronLeft size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="signup"
              options={{
                title: "Create Account",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.back()}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Go back"
                    accessible={true}
                    marginLeft={-8}
                  >
                    <ChevronLeft size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="reset-password"
              options={{
                title: "Reset Password",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.back()}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Go back"
                    accessible={true}
                    marginLeft={-8}
                  >
                    <ChevronLeft size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="update-password"
              options={{
                title: "Update Password",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.back()}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Go back"
                    accessible={true}
                    marginLeft={-8}
                  >
                    <ChevronLeft size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="home"
              options={{
                title: "Home",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={toggleSidebar}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Open navigation menu"
                    marginLeft={-8}
                  >
                    <Menu size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                title: "Profile",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={toggleSidebar}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Open navigation menu"
                    marginLeft={-8}
                  >
                    <Menu size={24} color="white" />
                  </Button>
                ),
                headerRight: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.push("/profileEdit")}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Edit Profile"
                    marginRight={-8}
                  >
                    <Edit3 size={24} color="white" />
                  </Button>
                ),
              }}
            />
            <Stack.Screen
              name="profileEdit"
              options={{
                presentation: "modal",
                title: "Edit Profile",
                animation: "slide_from_bottom",
                headerLeft: () => (
                  <Button
                    unstyled
                    padding="$2"
                    onPress={() => router.back()}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                    accessibilityLabel="Go back"
                    accessible={true}
                    marginLeft={-8}
                  >
                    <ChevronLeft size={24} color="white" />
                  </Button>
                ),
              }}
            />
          </Stack>
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          <StatusBar style="auto" />
        </AuthProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
