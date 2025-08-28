import { useState } from "react";
import { Alert } from "react-native";
import { Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Input } from "@tamagui/input";
import { supabase } from "../lib/supabase";
import { Link, router } from "expo-router";
import Constants from "expo-constants";
import { handleInputChange } from "../lib/input-utils";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    const appUrl =
      Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_URL ||
      Constants.manifest?.extra?.EXPO_PUBLIC_APP_URL ||
      "https://smartodo.app"; // fallback URL

    if (!appUrl) {
      Alert.alert(
        "Configuration Error",
        "App URL is not configured. Please contact support.",
      );
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/update-password`,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check Your Email",
        "We've sent you a password reset link. Please check your email and follow the instructions.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    }
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
      bottomOffset={64}
    >
      <YStack flex={1} padding="$6" backgroundColor="$background">
        <YStack flex={1} justifyContent="center">
          <YStack gap="$6" alignItems="center">
            <YStack gap="$2" alignItems="center">
              <Text
                color="$gray11"
                fontSize="$4"
                fontFamily="$body"
                textAlign="center"
                paddingHorizontal="$4"
              >
                {
                  "Enter your email address and we'll send you a link to reset your password"
                }
              </Text>
            </YStack>

            <YStack gap="$4" width="100%" maxWidth={400}>
              <YStack gap="$2">
                <Text color="$gray12" fontSize="$3" fontFamily="$body">
                  Email Address
                </Text>
                <Input
                  size="$5"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(e) => handleInputChange(setEmail, e)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                  backgroundColor="$gray2"
                  borderWidth={1}
                  borderColor="$gray6"
                  focusStyle={{
                    borderColor: "$primary",
                    borderWidth: 2,
                  }}
                />
              </YStack>

              <YStack gap="$3">
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
                  onPress={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <XStack gap="$2" justifyContent="center" alignItems="center">
                  <Text color="$gray11" fontSize="$3" fontFamily="$body">
                    Remember your password?
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
                      Back to Login
                    </Button>
                  </Link>
                </XStack>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </KeyboardAwareScrollView>
  );
}
