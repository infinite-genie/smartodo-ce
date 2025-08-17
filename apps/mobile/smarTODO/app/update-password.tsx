import { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { H1 } from "@tamagui/text";
import { Input } from "@tamagui/input";
import { supabase } from "../lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UpdatePasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    // Check if we have a valid session from the deep link
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert(
        "Session Expired",
        "Your password reset link has expired. Please request a new one.",
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
