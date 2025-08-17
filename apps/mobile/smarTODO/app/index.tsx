import { View, Text, Stack } from "@tamagui/core";
import { Button } from "@tamagui/button";
import { H2 } from "@tamagui/text";
import { useState } from "react";
import {
  useWindowDimensions,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";

const onboardingData = [
  {
    image: require("../assets/images/illustrations/onboarding/phone_todo_list.png"),
    title: "Complete Tasks Efficiently",
    description:
      "smarTODO helps you organize and complete your tasks with smart prioritization and intuitive task management.",
  },
  {
    image: require("../assets/images/illustrations/onboarding/dora_v1.png"),
    title: "Meet DORA AI Assistant",
    description:
      "Your personal AI chatbot assistant helps you break down complex tasks and provides intelligent suggestions.",
  },
  {
    image: require("../assets/images/illustrations/onboarding/notifications.png"),
    title: "Never Miss a Task",
    description:
      "Get timely reminders and sync with your calendar to stay on top of your schedule.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: winWidth } = useWindowDimensions();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.max(
      0,
      Math.min(onboardingData.length - 1, Math.round(x / winWidth)),
    );
    setCurrentIndex(slideIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex={1} backgroundColor="$background">
        <View flex={1}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {onboardingData.map((item, index) => (
              <View
                key={index}
                width={winWidth}
                alignItems="center"
                justifyContent="center"
                padding="$6"
              >
                <Image
                  source={item.image}
                  style={{
                    width: winWidth * 0.8,
                    height: winWidth * 0.8,
                    resizeMode: "contain",
                  }}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={item.title}
                />
                <Stack gap="$3" alignItems="center" marginTop="$4">
                  <H2
                    color="$primary"
                    fontSize="$8"
                    fontFamily="$heading"
                    textAlign="center"
                  >
                    {item.title}
                  </H2>
                  <Text
                    color="$gray11"
                    fontSize="$4"
                    fontFamily="$body"
                    textAlign="center"
                    paddingHorizontal="$4"
                  >
                    {item.description}
                  </Text>
                </Stack>
              </View>
            ))}
          </ScrollView>

          <Stack
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            gap="$2"
            paddingVertical="$4"
          >
            {onboardingData.map((_, index) => (
              <View
                key={index}
                width={8}
                height={8}
                borderRadius={4}
                backgroundColor={currentIndex === index ? "$primary" : "$gray5"}
              />
            ))}
          </Stack>
        </View>

        <Stack gap="$4" padding="$6" paddingBottom="$20">
          <Button
            size="$5"
            backgroundColor="$primary"
            color="white"
            fontFamily="$heading"
            fontSize="$5"
            pressStyle={{
              scale: 0.98,
              opacity: 0.9,
            }}
            animation="quick"
            onPress={() => {
              // TODO: navigate to Signup screen
            }}
          >
            Sign Up
          </Button>

          <Button
            size="$5"
            backgroundColor="transparent"
            borderWidth={2}
            borderColor="$primary"
            color="$primary"
            fontFamily="$heading"
            fontSize="$5"
            pressStyle={{
              scale: 0.98,
              opacity: 0.9,
            }}
            animation="quick"
            onPress={() => {
              // TODO: navigate to Login screen
            }}
          >
            Login
          </Button>
        </Stack>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Styles can be kept here for static properties if needed
});
