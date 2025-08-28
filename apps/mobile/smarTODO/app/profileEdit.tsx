import { useState, useEffect, useCallback } from "react";
import { Alert, ActivityIndicator, Platform } from "react-native";
import { YStack } from "@tamagui/stacks";
import { Text } from "@tamagui/core";
import { Input } from "@tamagui/input";
import { Button } from "@tamagui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@tamagui/avatar";
import { Separator } from "@tamagui/separator";
import { useAuth } from "../contexts/AuthContext";
import { User, Camera } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { handleInputChange } from "../lib/input-utils";
import { profileService } from "../lib/services/profile.service";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        throw new Error("No user ID found");
      }

      let data = await profileService.getProfile(user.id);

      if (!data) {
        data = await profileService.createProfile(user.id);
      }

      if (data) {
        setFullName(data.full_name || "");
        setUsername(data.username || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      console.log("No user found in profileEdit");
      setLoading(false);
    }
  }, [user, loadProfile]);

  const saveProfile = async () => {
    try {
      setSaving(true);

      const profileData = {
        full_name: fullName,
        username: username,
        bio: bio,
      };

      await profileService.upsertUserProfile(profileData);

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    // Request permissions
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry",
          "We need camera roll permissions to change your avatar",
        );
        return;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    // Verify assets array and base64 data exist
    if (!result.assets || result.assets.length === 0) {
      Alert.alert("Error", "No image was selected");
      return;
    }

    if (!result.assets[0].base64) {
      Alert.alert("Error", "Failed to process image data");
      return;
    }

    try {
      setUploadingAvatar(true);
      const newAvatarUrl = await profileService.uploadAvatar(
        result.assets[0].base64,
      );
      setAvatarUrl(newAvatarUrl);
      Alert.alert("Success", "Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const takePhoto = async () => {
    // Request camera permissions
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Sorry", "We need camera permissions to take a photo");
        return;
      }
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (result.canceled) {
      return;
    }

    // Verify assets array and base64 data exist
    if (!result.assets || result.assets.length === 0) {
      Alert.alert("Error", "No photo was taken");
      return;
    }

    if (!result.assets[0].base64) {
      Alert.alert("Error", "Failed to process photo data");
      return;
    }

    try {
      setUploadingAvatar(true);
      const newAvatarUrl = await profileService.uploadAvatar(
        result.assets[0].base64,
      );
      setAvatarUrl(newAvatarUrl);
      Alert.alert("Success", "Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      Alert.alert("Error", "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  if (loading) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text marginTop="$4">Loading profile...</Text>
      </YStack>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 24,
      }}
      bottomOffset={64} // tune 40–100 based on design
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <YStack flex={1} gap="$4">
        {/* Avatar Section */}
        <YStack alignItems="center" gap="$3" paddingVertical="$4">
          <YStack position="relative">
            <Avatar circular size="$10">
              <AvatarImage
                source={{
                  uri: avatarUrl || "https://avatar.iran.liara.run/public/13",
                }}
              />
              <AvatarFallback backgroundColor="$blue5">
                <User size="$4" />
              </AvatarFallback>
            </Avatar>
            {uploadingAvatar && (
              <YStack
                pointerEvents="none"
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                backgroundColor="rgba(0,0,0,0.5)"
                borderRadius="$10"
              >
                <ActivityIndicator size="small" color="white" />
              </YStack>
            )}
          </YStack>
          <Button
            size="$3"
            variant="outlined"
            onPress={showImagePickerOptions}
            disabled={uploadingAvatar}
            icon={Camera}
          >
            Change Photo
          </Button>
        </YStack>

        <Separator />

        {/* Form Fields */}
        <YStack gap="$4">
          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Full Name
            </Text>
            <Input
              size="$4"
              value={fullName}
              onChangeText={(text) => handleInputChange(setFullName, text)}
              placeholder="Enter your full name"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Username
            </Text>
            <Input
              size="$4"
              value={username}
              onChangeText={(text) => handleInputChange(setUsername, text)}
              placeholder="Choose a username"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Bio
            </Text>
            <Input
              size="$4"
              value={bio}
              onChangeText={(text) => handleInputChange(setBio, text)}
              placeholder="Tell us about yourself"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
              height={100}
              returnKeyType="done"
            />
          </YStack>

          <YStack gap="$2">
            <Text fontSize="$3" fontWeight="600">
              Email
            </Text>
            <Input
              size="$4"
              value={user?.email || ""}
              editable={false}
              opacity={0.6}
            />
            <Text fontSize="$1" color="$gray10">
              Email cannot be changed
            </Text>
          </YStack>

          {/* Save Button */}
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
            onPress={saveProfile}
            disabled={saving}
            marginTop="$4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </YStack>
      </YStack>
    </KeyboardAwareScrollView>
  );
}
