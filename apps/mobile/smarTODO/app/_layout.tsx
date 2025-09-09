import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { TamaguiProvider } from "@tamagui/core";
import { PortalProvider } from "@tamagui/portal";
import { AuthProvider } from "../contexts/AuthContext";
import { TasksProvider } from "../contexts/TasksContext";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ChevronLeft, Menu, Edit3, Plus } from "@tamagui/lucide-icons";
import { HeaderIconButton } from "../components/HeaderIconButton";
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
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <KeyboardProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <PortalProvider shouldAddRootHost>
          <AuthProvider>
            <TasksProvider>
              <Stack screenOptions={headerOptions}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="login"
                  options={{
                    title: "Welcome Back",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Go back"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="signup"
                  options={{
                    title: "Create Account",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Go back"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="reset-password"
                  options={{
                    title: "Reset Password",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Go back"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="update-password"
                  options={{
                    title: "Update Password",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Go back"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="home"
                  options={{
                    title: "Home",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Open navigation menu"
                        onPress={toggleSidebar}
                        marginLeft={-8}
                      >
                        <Menu size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="profile"
                  options={{
                    title: "Profile",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Open navigation menu"
                        onPress={toggleSidebar}
                        marginLeft={-8}
                      >
                        <Menu size={24} color="white" />
                      </HeaderIconButton>
                    ),
                    headerRight: () => (
                      <HeaderIconButton
                        label="Edit Profile"
                        onPress={() => router.push("/profileEdit")}
                        marginRight={-8}
                      >
                        <Edit3 size={24} color="white" />
                      </HeaderIconButton>
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
                      <HeaderIconButton
                        label="Go back"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="tasks"
                  options={{
                    title: "Tasks",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Open navigation menu"
                        onPress={toggleSidebar}
                        marginLeft={-8}
                      >
                        <Menu size={24} color="white" />
                      </HeaderIconButton>
                    ),
                    headerRight: () => (
                      <HeaderIconButton
                        label="Create new task"
                        onPress={() => router.push("/createTask")}
                        marginRight={-8}
                      >
                        <Plus size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
                <Stack.Screen
                  name="createTask"
                  options={{
                    presentation: "modal",
                    title: "New Task",
                    animation: "slide_from_bottom",
                    headerLeft: () => (
                      <HeaderIconButton
                        label="Cancel"
                        onPress={() => router.back()}
                        marginLeft={-8}
                      >
                        <ChevronLeft size={24} color="white" />
                      </HeaderIconButton>
                    ),
                  }}
                />
              </Stack>
              <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
              <StatusBar style="auto" />
            </TasksProvider>
          </AuthProvider>
        </PortalProvider>
      </TamaguiProvider>
    </KeyboardProvider>
  );
}
