import { useState, useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { H1 } from "@tamagui/text";
import { Input } from "@tamagui/input";
import { supabase } from "../lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

export default function UpdatePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    // Check if we have a valid session from the deep link
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // First, try to get the URL that opened the app
      const url = await Linking.getInitialURL();

      if (url) {
        const parsedUrl = new URL(url);

        // Check for 'code' query parameter (magic link exchange)
        const code = parsedUrl.searchParams.get("code");
        if (code) {
          const { data, error } =
            await supabase.auth.exchangeCodeForSession(code);
          if (!error && data.session) {
            setSessionReady(true);
            return;
          }
        }

        // Check for access_token and refresh_token in fragment
        const hashParams = new URLSearchParams(parsedUrl.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error && data.session) {
            setSessionReady(true);
            return;
          }
        }
      }

      // If no valid session could be established, check existing session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setSessionReady(true);
      } else {
        Alert.alert(
          "Session Expired",
          "Your password reset link has expired or is invalid. Please request a new one.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/reset-password"),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error checking session:", error);
      Alert.alert(
        "Error",
        "Failed to verify your reset link. Please try again.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/reset-password"),
          },
        ],
      );
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Your password has been updated successfully!", [
        {
          text: "OK",
          onPress: async () => {
            // Sign out to ensure clean state
            await supabase.auth.signOut();
            router.replace("/login");
          },
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "android" ? -100 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} padding="$6" backgroundColor="$background">
            <XStack marginBottom="$4" alignItems="center">
              <Button
                size="$3"
                circular
                backgroundColor="transparent"
                onPress={() => router.replace("/login")}
                color="$gray12"
                pressStyle={{
                  scale: 0.95,
                  opacity: 0.8,
                }}
                animation="quick"
              >
                <Ionicons name="chevron-back" size={24} color="#666" />
              </Button>
            </XStack>

            <YStack flex={1} justifyContent="center">
              <YStack gap="$6" alignItems="center">
                <YStack gap="$2" alignItems="center">
                  <H1
                    color="$primary"
                    fontSize="$9"
                    fontFamily="$heading"
                    textAlign="center"
                  >
                    Set New Password
                  </H1>
                  <Text
                    color="$gray11"
                    fontSize="$4"
                    fontFamily="$body"
                    textAlign="center"
                    paddingHorizontal="$4"
                  >
                    Enter your new password below
                  </Text>
                </YStack>

                <YStack gap="$4" width="100%" maxWidth={400}>
                  <YStack gap="$2">
                    <Text color="$gray12" fontSize="$3" fontFamily="$body">
                      New Password
                    </Text>
                    <Input
                      size="$5"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChangeText={setNewPassword}
                      type="password"
                      secureTextEntry
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
                    <Text color="$gray10" fontSize="$2" fontFamily="$body">
                      Must be at least 6 characters
                    </Text>
                  </YStack>

                  <YStack gap="$2">
                    <Text color="$gray12" fontSize="$3" fontFamily="$body">
                      Confirm Password
                    </Text>
                    <Input
                      size="$5"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      type="password"
                      secureTextEntry
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
                      onPress={handleUpdatePassword}
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>

                    <XStack
                      gap="$2"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text color="$gray11" fontSize="$3" fontFamily="$body">
                        Changed your mind?
                      </Text>
                      <Button
                        size="$2"
                        variant="outlined"
                        backgroundColor="transparent"
                        borderWidth={0}
                        color="$primary"
                        fontFamily="$body"
                        fontSize="$3"
                        disabled={loading}
                        onPress={() => router.replace("/login")}
                      >
                        Back to Login
                      </Button>
                    </XStack>
                  </YStack>
                </YStack>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
