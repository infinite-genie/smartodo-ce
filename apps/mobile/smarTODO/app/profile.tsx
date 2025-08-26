import { useState, useEffect } from "react";
import { Alert, ScrollView, ActivityIndicator } from "react-native";
import { YStack, XStack } from "@tamagui/stacks";
import { H3 } from "@tamagui/text";
import { Text } from "@tamagui/core";
import { Button } from "@tamagui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@tamagui/avatar";
import { Separator } from "@tamagui/separator";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { profileService, type Profile } from "../lib/services/profile.service";
import {
  User,
  Edit3,
  Mail,
  AtSign,
  FileText,
  Calendar,
} from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import AppLayout from "../components/AppLayout";

export default function ProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();

      // Subscribe to real-time profile updates
      const unsubscribe = profileService.subscribeToProfileUpdates(
        user.id,
        (updatedProfile) => {
          setProfile(updatedProfile);
        },
      );

      return unsubscribe;
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        loadProfile();
      }
    }, [user]),
  );

  const loadProfile = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        throw new Error("No user ID found");
      }

      let data = await profileService.getProfile(user.id);

      if (!data) {
        data = await profileService.createProfile(user.id);
      }

      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text marginTop="$4">Loading profile...</Text>
        </YStack>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Profile"
      headerRight={
        <Button
          unstyled
          onPress={() => router.push("/profileEdit")}
          backgroundColor="transparent"
          hoverStyle={{ backgroundColor: "rgba(255,255,255,0.1)" }}
          pressStyle={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          padding="$2"
          height="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Edit3 size={24} color="white" />
        </Button>
      }
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          {/* Avatar Section */}
          <YStack alignItems="center" gap="$3" paddingVertical="$4">
            <Avatar circular size="$12">
              <AvatarImage
                source={{
                  uri:
                    profile?.avatar_url ||
                    "https://avatar.iran.liara.run/public/13",
                }}
              />
              <AvatarFallback backgroundColor="$blue5">
                <User size="$5" />
              </AvatarFallback>
            </Avatar>
            <YStack alignItems="center" gap="$1">
              <H3>{profile?.full_name || "No name set"}</H3>
              {profile?.username && (
                <Text fontSize="$3" color="$gray10">
                  @{profile.username}
                </Text>
              )}
            </YStack>
          </YStack>

          {/* Profile Information */}
          <YStack
            gap="$4"
            backgroundColor="$gray2"
            borderRadius="$4"
            padding="$4"
          >
            {/* Email */}
            <XStack gap="$3" alignItems="center">
              <Mail size="$1" color="$gray10" />
              <YStack flex={1}>
                <Text fontSize="$2" color="$gray10">
                  Email
                </Text>
                <Text fontSize="$3" fontWeight="500">
                  {user?.email || "Not available"}
                </Text>
              </YStack>
            </XStack>

            <Separator />

            {/* Username */}
            <XStack gap="$3" alignItems="center">
              <AtSign size="$1" color="$gray10" />
              <YStack flex={1}>
                <Text fontSize="$2" color="$gray10">
                  Username
                </Text>
                <Text fontSize="$3" fontWeight="500">
                  {profile?.username || "Not set"}
                </Text>
              </YStack>
            </XStack>

            <Separator />

            {/* Bio */}
            <XStack gap="$3" alignItems="flex-start">
              <FileText size="$1" color="$gray10" />
              <YStack flex={1}>
                <Text fontSize="$2" color="$gray10">
                  Bio
                </Text>
                <Text fontSize="$3" fontWeight="500">
                  {profile?.bio || "No bio added yet"}
                </Text>
              </YStack>
            </XStack>

            <Separator />

            {/* Account Created */}
            <XStack gap="$3" alignItems="center">
              <Calendar size="$1" color="$gray10" />
              <YStack flex={1}>
                <Text fontSize="$2" color="$gray10">
                  Member Since
                </Text>
                <Text fontSize="$3" fontWeight="500">
                  {profile?.updated_at
                    ? new Date(profile.updated_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          {/* Account Actions */}
          <YStack gap="$3" marginTop="$4">
            <Button
              size="$4"
              variant="outlined"
              theme="red"
              onPress={async () => {
                Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                      await supabase.auth.signOut();
                      router.replace("/");
                    },
                  },
                ]);
              }}
            >
              Sign Out
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </AppLayout>
  );
}
