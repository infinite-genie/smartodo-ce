import { SafeAreaView } from "react-native";
import { Text } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import { H1 } from "@tamagui/text";
import { Button } from "@tamagui/button";
import { supabase } from "../lib/supabase";
import { router } from "expo-router";

export default function HomeScreen() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack
        flex={1}
        padding="$6"
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <H1
          color="$primary"
          fontSize="$8"
          fontFamily="$heading"
          textAlign="center"
        >
          Welcome to smarTODO
        </H1>
        <Text
          color="$gray11"
          fontSize="$4"
          fontFamily="$body"
          textAlign="center"
          marginTop="$4"
        >
          Your tasks will appear here
        </Text>

        <Button
          size="$4"
          backgroundColor="$red9"
          color="white"
          fontFamily="$heading"
          fontSize="$4"
          marginTop="$8"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </YStack>
    </SafeAreaView>
  );
}
