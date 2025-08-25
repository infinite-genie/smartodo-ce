import { useState } from "react";
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
import { Link, router } from "expo-router";
import { handleInputChange } from "../lib/input-utils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login Error", error.message);
    } else if (data.user) {
      router.replace("/home");
    }
    setLoading(false);
  };

  const handleForgotPassword = () => {
    router.push("/reset-password");
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
                  Welcome Back
                </H1>
                <Text
                  color="$gray11"
                  fontSize="$4"
                  fontFamily="$body"
                  textAlign="center"
                >
                  Login to access your tasks
                </Text>
              </YStack>

              <YStack gap="$4" width="100%" maxWidth={400}>
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

                <YStack gap="$2">
                  <Text color="$gray12" fontSize="$3" fontFamily="$body">
                    Password
                  </Text>
                  <Input
                    size="$5"
                    placeholder="Enter your password"
                    value={password}
                    type="password"
                    onChangeText={(e) => handleInputChange(setPassword, e)}
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

                <XStack justifyContent="flex-end">
                  <Button
                    size="$2"
                    variant="outlined"
                    backgroundColor="transparent"
                    borderWidth={0}
                    color="$primary"
                    fontFamily="$body"
                    fontSize="$3"
                    onPress={handleForgotPassword}
                    disabled={loading}
                  >
                    Forgot Password?
                  </Button>
                </XStack>

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
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <XStack gap="$2" justifyContent="center" alignItems="center">
                    <Text color="$gray11" fontSize="$3" fontFamily="$body">
                      Don&apos;t have an account?
                    </Text>
                    <Link href="/signup" asChild>
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
                        Join Waitlist
                      </Button>
                    </Link>
                  </XStack>
                </YStack>
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
