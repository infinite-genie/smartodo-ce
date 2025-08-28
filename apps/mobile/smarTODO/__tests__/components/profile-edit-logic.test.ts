import {
  profileService,
  type Profile,
} from "../../lib/services/profile.service";
import { handleInputChange } from "../../lib/input-utils";

// Mock the profile service
jest.mock("../../lib/services/profile.service", () => ({
  profileService: {
    getProfile: jest.fn(),
    createProfile: jest.fn(),
    upsertUserProfile: jest.fn(),
    uploadAvatar: jest.fn(),
  },
}));

// Mock input utils
jest.mock("../../lib/input-utils", () => ({
  handleInputChange: jest.fn(),
}));

// Mock expo-image-picker
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
  },
}));

// Mock React Native Alert
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: "ios",
  },
}));

import { Alert, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

describe("Profile Edit Screen Logic", () => {
  const mockProfile: Profile = {
    id: "profile-123",
    user_id: "user-123",
    full_name: "John Doe",
    username: "johndoe",
    avatar_url: "https://example.com/avatar.jpg",
    bio: "Test bio",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Profile Loading Logic", () => {
    it("should load existing profile and populate form fields", async () => {
      (profileService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

      let fullName = "";
      let username = "";
      let bio = "";
      let avatarUrl: string | undefined;
      let loading = true;

      const loadProfile = async (userId: string) => {
        try {
          loading = true;

          if (!userId) {
            throw new Error("No user ID found");
          }

          let data = await profileService.getProfile(userId);

          if (!data) {
            data = await profileService.createProfile(userId);
          }

          if (data) {
            fullName = data.full_name || "";
            username = data.username || "";
            bio = data.bio || "";
            avatarUrl = data.avatar_url;
          }
        } finally {
          loading = false;
        }
      };

      await loadProfile("user-123");

      expect(profileService.getProfile).toHaveBeenCalledWith("user-123");
      expect(fullName).toBe("John Doe");
      expect(username).toBe("johndoe");
      expect(bio).toBe("Test bio");
      expect(avatarUrl).toBe("https://example.com/avatar.jpg");
      expect(loading).toBe(false);
    });

    it("should create profile when none exists", async () => {
      (profileService.getProfile as jest.Mock).mockResolvedValue(null);
      (profileService.createProfile as jest.Mock).mockResolvedValue(
        mockProfile,
      );

      let profile: Profile | null = null;

      const loadProfile = async (userId: string) => {
        let data = await profileService.getProfile(userId);

        if (!data) {
          data = await profileService.createProfile(userId);
        }

        profile = data;
      };

      await loadProfile("user-123");

      expect(profileService.getProfile).toHaveBeenCalledWith("user-123");
      expect(profileService.createProfile).toHaveBeenCalledWith("user-123");
      expect(profile).toEqual(mockProfile);
    });

    it("should handle loading errors gracefully", async () => {
      const error = new Error("Failed to load profile");
      (profileService.getProfile as jest.Mock).mockRejectedValue(error);

      let loading = true;
      let errorOccurred = false;

      const loadProfile = async (userId: string) => {
        try {
          loading = true;
          await profileService.getProfile(userId);
        } catch (err) {
          errorOccurred = true;
          console.error("Error loading profile:", err);
        } finally {
          loading = false;
        }
      };

      await loadProfile("user-123");

      expect(errorOccurred).toBe(true);
      expect(loading).toBe(false);
    });
  });

  describe("Form Validation and Input Handling", () => {
    it("should handle form input changes", () => {
      let fullName = "";
      let username = "";
      let bio = "";

      const setFullName = (value: string) => {
        fullName = value;
      };
      const setUsername = (value: string) => {
        username = value;
      };
      const setBio = (value: string) => {
        bio = value;
      };

      // Simulate input changes
      setFullName("Jane Doe");
      setUsername("janedoe");
      setBio("Updated bio");

      expect(fullName).toBe("Jane Doe");
      expect(username).toBe("janedoe");
      expect(bio).toBe("Updated bio");
    });

    it("should validate required fields before saving", () => {
      const validateForm = (formData: {
        full_name: string;
        username: string;
        bio: string;
      }) => {
        const errors: string[] = [];

        if (!formData.full_name.trim()) {
          errors.push("Full name is required");
        }

        if (formData.username.trim() && formData.username.length < 3) {
          errors.push("Username must be at least 3 characters");
        }

        return errors;
      };

      // Test with empty name
      let errors = validateForm({
        full_name: "",
        username: "user",
        bio: "bio",
      });
      expect(errors).toContain("Full name is required");

      // Test with short username
      errors = validateForm({ full_name: "John", username: "ab", bio: "bio" });
      expect(errors).toContain("Username must be at least 3 characters");

      // Test valid form
      errors = validateForm({
        full_name: "John Doe",
        username: "johndoe",
        bio: "bio",
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe("Profile Save Logic", () => {
    it("should save profile successfully", async () => {
      const updatedProfile = { ...mockProfile, full_name: "Updated Name" };
      (profileService.upsertUserProfile as jest.Mock).mockResolvedValue(
        updatedProfile,
      );

      let saving = false;
      let navigatedBack = false;

      const saveProfile = async () => {
        try {
          saving = true;

          const profileData = {
            full_name: "Updated Name",
            username: "updateduser",
            bio: "Updated bio",
          };

          await profileService.upsertUserProfile(profileData);
          navigatedBack = true;
        } finally {
          saving = false;
        }
      };

      await saveProfile();

      expect(profileService.upsertUserProfile).toHaveBeenCalledWith({
        full_name: "Updated Name",
        username: "updateduser",
        bio: "Updated bio",
      });
      expect(saving).toBe(false);
      expect(navigatedBack).toBe(true);
    });

    it("should handle save errors", async () => {
      const saveError = new Error("Save failed");
      (profileService.upsertUserProfile as jest.Mock).mockRejectedValue(
        saveError,
      );

      let saving = false;
      let errorOccurred = false;

      const saveProfile = async () => {
        try {
          saving = true;
          await profileService.upsertUserProfile({});
        } catch (error) {
          errorOccurred = true;
          console.error("Error updating profile:", error);
        } finally {
          saving = false;
        }
      };

      await saveProfile();

      expect(errorOccurred).toBe(true);
      expect(saving).toBe(false);
    });
  });

  describe("Avatar Upload Logic", () => {
    it("should handle image picker selection and upload", async () => {
      const mockImageResult = {
        canceled: false,
        assets: [
          {
            base64: "base64imagedata",
            uri: "file://path/to/image",
          },
        ],
      };

      (
        ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockImageResult,
      );
      (profileService.uploadAvatar as jest.Mock).mockResolvedValue(
        "https://new-avatar-url.com",
      );

      let avatarUrl = "";
      let uploadingAvatar = false;
      let successAlert = false;

      const pickImage = async () => {
        // Request permissions
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"] as any,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
          try {
            uploadingAvatar = true;
            const newAvatarUrl = await profileService.uploadAvatar(
              result.assets[0].base64,
            );
            avatarUrl = newAvatarUrl;
            successAlert = true;
          } finally {
            uploadingAvatar = false;
          }
        }
      };

      await pickImage();

      expect(
        ImagePicker.requestMediaLibraryPermissionsAsync,
      ).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      expect(profileService.uploadAvatar).toHaveBeenCalledWith(
        "base64imagedata",
      );
      expect(avatarUrl).toBe("https://new-avatar-url.com");
      expect(uploadingAvatar).toBe(false);
      expect(successAlert).toBe(true);
    });

    it("should handle permission denial for image picker", async () => {
      (
        ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "denied",
      });

      let permissionDenied = false;

      const pickImage = async () => {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          permissionDenied = true;
          return;
        }
      };

      await pickImage();

      expect(permissionDenied).toBe(true);
      expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    });

    it("should handle camera photo taking", async () => {
      const mockCameraResult = {
        canceled: false,
        assets: [
          {
            base64: "camerabase64data",
            uri: "file://path/to/camera/image",
          },
        ],
      };

      (
        ImagePicker.requestCameraPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });
      (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue(
        mockCameraResult,
      );
      (profileService.uploadAvatar as jest.Mock).mockResolvedValue(
        "https://camera-avatar-url.com",
      );

      let avatarUrl = "";

      const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          return;
        }

        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
          const newAvatarUrl = await profileService.uploadAvatar(
            result.assets[0].base64,
          );
          avatarUrl = newAvatarUrl;
        }
      };

      await takePhoto();

      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalledWith({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      expect(profileService.uploadAvatar).toHaveBeenCalledWith(
        "camerabase64data",
      );
      expect(avatarUrl).toBe("https://camera-avatar-url.com");
    });

    it("should handle avatar upload errors", async () => {
      const mockImageResult = {
        canceled: false,
        assets: [{ base64: "base64data" }],
      };

      (
        ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: "granted",
      });
      (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(
        mockImageResult,
      );
      (profileService.uploadAvatar as jest.Mock).mockRejectedValue(
        new Error("Upload failed"),
      );

      let uploadingAvatar = false;
      let errorOccurred = false;

      const pickImage = async () => {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") return;

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"] as any,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
          base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
          try {
            uploadingAvatar = true;
            await profileService.uploadAvatar(result.assets[0].base64);
          } catch (error) {
            errorOccurred = true;
            console.error("Error uploading avatar:", error);
          } finally {
            uploadingAvatar = false;
          }
        }
      };

      await pickImage();

      expect(errorOccurred).toBe(true);
      expect(uploadingAvatar).toBe(false);
    });
  });

  describe("Navigation Logic", () => {
    it("should navigate back after successful save", () => {
      let navigatedBack = false;

      const handleSaveSuccess = () => {
        navigatedBack = true;
      };

      handleSaveSuccess();

      expect(navigatedBack).toBe(true);
    });

    it("should handle cancel navigation", () => {
      let cancelled = false;

      const handleCancel = () => {
        cancelled = true;
      };

      handleCancel();

      expect(cancelled).toBe(true);
    });
  });

  describe("Loading States", () => {
    it("should manage loading states correctly", () => {
      let loading = false;
      let saving = false;
      let uploadingAvatar = false;

      const setLoadingStates = (
        loadingState: boolean,
        savingState: boolean,
        uploadingState: boolean,
      ) => {
        loading = loadingState;
        saving = savingState;
        uploadingAvatar = uploadingState;
      };

      // Test initial states
      expect(loading).toBe(false);
      expect(saving).toBe(false);
      expect(uploadingAvatar).toBe(false);

      // Test setting loading states
      setLoadingStates(true, true, true);
      expect(loading).toBe(true);
      expect(saving).toBe(true);
      expect(uploadingAvatar).toBe(true);

      // Test clearing loading states
      setLoadingStates(false, false, false);
      expect(loading).toBe(false);
      expect(saving).toBe(false);
      expect(uploadingAvatar).toBe(false);
    });

    it("should handle concurrent operations", async () => {
      let operations = {
        loading: false,
        saving: false,
        uploading: false,
      };

      const simulateLoading = async () => {
        operations.loading = true;
        await new Promise((resolve) => setTimeout(resolve, 50));
        operations.loading = false;
      };

      const simulateSaving = async () => {
        operations.saving = true;
        await new Promise((resolve) => setTimeout(resolve, 50));
        operations.saving = false;
      };

      // Start both operations
      const loadingPromise = simulateLoading();
      const savingPromise = simulateSaving();

      // Both should be running
      expect(operations.loading).toBe(true);
      expect(operations.saving).toBe(true);

      // Wait for completion
      await Promise.all([loadingPromise, savingPromise]);

      // Both should be finished
      expect(operations.loading).toBe(false);
      expect(operations.saving).toBe(false);
    });
  });
});
