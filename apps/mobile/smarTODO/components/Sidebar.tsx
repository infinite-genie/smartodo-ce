import React, { useEffect } from "react";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { XStack, YStack } from "@tamagui/stacks";
import { H2, H3 } from "@tamagui/text";
import { Button } from "@tamagui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@tamagui/avatar";
import { Separator } from "@tamagui/separator";
import { supabase } from "../lib/supabase";
import { router, usePathname } from "expo-router";
import { Home, User, X } from "@tamagui/lucide-icons";

// Define allowed navigation routes (based on existing app screens)
type NavigationRoute = "/home";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

interface MenuItem {
  icon: React.ComponentType<any>;
  label: string;
  route: NavigationRoute;
  color?: string;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const translateX = useSharedValue(-280);
  const opacity = useSharedValue(0);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      translateX.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-280, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  const sidebarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleLogout = async () => {
    // Close sidebar first for immediate feedback
    onClose();

    try {
      await supabase.auth.signOut();
      // Use setTimeout to allow sidebar animation to complete
      setTimeout(() => {
        router.replace("/");
      }, 300); // Full sidebar animation duration
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate on error to prevent getting stuck
      setTimeout(() => {
        router.replace("/");
      }, 300);
    }
  };

  const handleNavigation = (route: NavigationRoute) => {
    // Close sidebar first for immediate visual feedback
    onClose();

    // Only navigate if we're not already on the target route
    if (pathname !== route) {
      // Use setTimeout to ensure sidebar closing animation starts
      // before navigation to prevent visual conflicts
      setTimeout(() => {
        router.push(route);
      }, 150); // Half of sidebar animation duration
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: Home,
      label: "Home",
      route: "/home",
    },
  ];

  return (
    <>
      {/* Animated Overlay */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          },
          overlayAnimatedStyle,
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close sidebar"
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Animated Sidebar */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 280,
            zIndex: 999,
          },
          sidebarAnimatedStyle,
        ]}
      >
        <YStack
          flex={1}
          backgroundColor="white"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 2,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <SafeAreaView
            style={{ flex: 1, backgroundColor: "white" }}
            edges={["left", "right"]}
          >
            <YStack flex={1} backgroundColor="$background">
              {/* Header */}
              <SafeAreaView
                edges={["top"]}
                style={{ backgroundColor: "#E64D13" }}
              >
                <YStack
                  paddingHorizontal="$5"
                  paddingVertical="$6"
                  backgroundColor="$primary"
                >
                  <XStack alignItems="center" gap="$3">
                    <Avatar circular size="$6">
                      <AvatarImage
                        source={{
                          uri: "https://avatar.iran.liara.run/public/13",
                        }}
                      />
                      <AvatarFallback backgroundColor="$primaryDark">
                        <User size={24} color="white" />
                      </AvatarFallback>
                    </Avatar>
                    <YStack flex={1}>
                      <H2
                        color="white"
                        fontSize="$5"
                        fontFamily="$heading"
                        fontWeight="bold"
                      >
                        smarTODO
                      </H2>
                    </YStack>
                  </XStack>
                </YStack>
              </SafeAreaView>

              <Separator />

              {/* Menu Items */}
              <YStack flex={1} paddingHorizontal="$3" paddingVertical="$4">
                {menuItems.map((item, index) => (
                  <Button
                    key={index}
                    unstyled
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    marginVertical="$1"
                    onPress={() => handleNavigation(item.route)}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "$gray3" }}
                    pressStyle={{ backgroundColor: "$gray4" }}
                  >
                    <XStack alignItems="center" gap="$3">
                      <item.icon size={20} color={item.color || "$gray11"} />
                      <H3
                        fontSize="$4"
                        fontFamily="$body"
                        color={item.color || "$gray12"}
                      >
                        {item.label}
                      </H3>
                    </XStack>
                  </Button>
                ))}
              </YStack>

              <Separator />

              {/* Logout Button */}
              <SafeAreaView edges={["bottom"]}>
                <YStack paddingHorizontal="$3" paddingVertical="$4">
                  <Button
                    unstyled
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    onPress={handleLogout}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: "$red3" }}
                    pressStyle={{ backgroundColor: "$red4" }}
                  >
                    <XStack alignItems="center" gap="$3">
                      <X size={20} color="$red9" />
                      <H3 fontSize="$4" fontFamily="$body" color="$red9">
                        Logout
                      </H3>
                    </XStack>
                  </Button>
                </YStack>
              </SafeAreaView>
            </YStack>
          </SafeAreaView>
        </YStack>
      </Animated.View>
    </>
  );
}
