import { SafeAreaView } from "react-native";
import { Text } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import { H1 } from "@tamagui/text";
import AppLayout from "../components/AppLayout";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppLayout title="Home">
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
          <Text
            color="$gray10"
            fontSize="$3"
            fontFamily="$body"
            textAlign="center"
            marginTop="$2"
          >
            Tap the menu icon to explore features
          </Text>
        </YStack>
      </AppLayout>
    </SafeAreaView>
  );
}
