import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { H3 } from "@tamagui/text";
import { Menu } from "@tamagui/lucide-icons";
import Sidebar from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  title?: string;
}

export default function AppLayout({
  children,
  showHeader = true,
  title,
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <View style={{ flex: 1, position: "relative" }}>
      {/* Header with menu button */}
      {showHeader && (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: "#E64D13" }}>
          <XStack
            paddingHorizontal="$3"
            paddingVertical="$4"
            backgroundColor="$primary"
            borderBottomWidth={1}
            borderBottomColor="$primaryDark"
            alignItems="center"
            justifyContent="flex-start"
            minHeight={60}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Button
              unstyled
              padding="$2"
              onPress={toggleSidebar}
              backgroundColor="transparent"
              hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Menu size={24} color="white" />
            </Button>
            {title && (
              <H3
                color="white"
                fontSize="$5"
                fontFamily="$heading"
                fontWeight="bold"
                marginLeft="$3"
              >
                {title}
              </H3>
            )}
          </XStack>
        </SafeAreaView>
      )}

      {/* Main content */}
      <View style={{ flex: 1 }}>{children}</View>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
    </View>
  );
}
