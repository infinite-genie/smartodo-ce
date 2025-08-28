import { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { H1 } from "@tamagui/text";
import { Input } from "@tamagui/input";
import { supabase } from "../lib/supabase";
import { Link, router } from "expo-router";
import { handleInputChange } from "../lib/input-utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSignup = async () => {
    if (!email || !fullName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Use upsert to make operation idempotent - won't fail on duplicate email
      const { error } = await supabase.from("waitlist").upsert(
        {
          email,
          full_name: fullName,
          // Don't set status - let database default apply
        },
        {
          onConflict: "email", // Update existing entry if email exists
        },
      );

      if (error) {
        console.error("Waitlist signup error:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to join waitlist. Please try again.",
        );
      } else {
        setSubmitted(true);
        Alert.alert(
          "Success!",
          "You have been added to our waitlist. We will notify you when your account is ready!",
          [{ text: "OK", onPress: () => router.replace("/") }],
        );
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please check your internet connection and try again.",
        [
          {
            text: "Retry",
            onPress: () => handleWaitlistSignup(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <YStack
          flex={1}
          padding="$6"
          justifyContent="center"
          alignItems="center"
          backgroundColor="$background"
        >
          <YStack gap="$6" alignItems="center" maxWidth={400}>
            <View
              width={100}
              height={100}
              borderRadius={50}
              backgroundColor="$green5"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="$10" color="$green11">
                ✓
              </Text>
            </View>

            <YStack gap="$3" alignItems="center">
              <H1
                color="$primary"
                fontSize="$8"
                fontFamily="$heading"
                textAlign="center"
              >
                You&apos;re on the list!
              </H1>
              <Text
                color="$gray11"
                fontSize="$4"
                fontFamily="$body"
                textAlign="center"
                paddingHorizontal="$4"
              >
                Thank you for joining our waitlist. We&apos;ll send you an email
                when your account is ready.
              </Text>
            </YStack>

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
              onPress={() => router.replace("/")}
              width="100%"
            >
              Back to Home
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
        bottomOffset={32}
        extraKeyboardSpace={8}
      >
        <YStack
          flex={1}
          padding="$6"
          justifyContent="center"
          backgroundColor="$background"
        >
          <YStack gap="$6" alignItems="center">
            <YStack gap="$2" alignItems="center">
              <H1
                color="$primary"
                fontSize="$10"
                fontFamily="$heading"
                textAlign="center"
              >
                Join the Waitlist
              </H1>
              <Text
                color="$gray11"
                fontSize="$4"
                fontFamily="$body"
                textAlign="center"
                paddingHorizontal="$4"
              >
                Be among the first to experience the future of task management
              </Text>
            </YStack>

            <YStack gap="$4" width="100%" maxWidth={400}>
              <YStack gap="$2">
                <Text color="$gray12" fontSize="$3" fontFamily="$body">
                  Full Name
                </Text>
                <Input
                  size="$5"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={(e) => handleInputChange(setFullName, e)}
                  autoCapitalize="words"
                  backgroundColor="$gray2"
                  borderWidth={1}
                  borderColor="$gray6"
                  focusStyle={{
                    borderColor: "$primary",
                    borderWidth: 2,
                  }}
                />
              </YStack>

              <YStack gap="$2">
                <Text color="$gray12" fontSize="$3" fontFamily="$body">
                  Email
                </Text>
                <Input
                  size="$5"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(e) => handleInputChange(setEmail, e)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  backgroundColor="$gray2"
                  borderWidth={1}
                  borderColor="$gray6"
                  focusStyle={{
                    borderColor: "$primary",
                    borderWidth: 2,
                  }}
                />
              </YStack>

              <YStack gap="$4" marginTop="$2">
                <View
                  backgroundColor="$blue2"
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$blue6"
                >
                  <Text
                    color="$blue11"
                    fontSize="$3"
                    fontFamily="$body"
                    textAlign="center"
                  >
                    🎯 Early access to all features
                  </Text>
                </View>

                <View
                  backgroundColor="$green2"
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$green6"
                >
                  <Text
                    color="$green11"
                    fontSize="$3"
                    fontFamily="$body"
                    textAlign="center"
                  >
                    🤖 Priority access to DORA AI Assistant
                  </Text>
                </View>

                <View
                  backgroundColor="$purple2"
                  padding="$3"
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor="$purple6"
                >
                  <Text
                    color="$purple11"
                    fontSize="$3"
                    fontFamily="$body"
                    textAlign="center"
                  >
                    🎁 Special launch pricing
                  </Text>
                </View>
              </YStack>

              <YStack gap="$3" marginTop="$4">
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
                  onPress={handleWaitlistSignup}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Join Waitlist"}
                </Button>

                <XStack gap="$2" justifyContent="center" alignItems="center">
                  <Text color="$gray11" fontSize="$3" fontFamily="$body">
                    Already have access?
                  </Text>
                  <Link href="/login" asChild>
                    <Button
                      size="$2"
                      variant="outlined"
                      backgroundColor="transparent"
                      borderWidth={0}
                      color="$primary"
                      fontFamily="$body"
                      fontSize="$3"
                      disabled={loading}
                    >
                      Login
                    </Button>
                  </Link>
                </XStack>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
