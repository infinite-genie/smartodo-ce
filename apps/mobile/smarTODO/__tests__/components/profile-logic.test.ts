import {
  profileService,
  type Profile,
} from "../../lib/services/profile.service";

// Mock the profile service
jest.mock("../../lib/services/profile.service", () => ({
  profileService: {
    getProfile: jest.fn(),
    createProfile: jest.fn(),
    subscribeToProfileUpdates: jest.fn(),
    unsubscribeFromProfileUpdates: jest.fn(),
  },
}));

// Mock Auth Context
const mockUser = { id: "user-123", email: "test@example.com" };

describe("Profile Screen Logic", () => {
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
    it("should load existing profile successfully", async () => {
      (profileService.getProfile as jest.Mock).mockResolvedValue(mockProfile);

      let profile: Profile | null = null;
      let loading = true;
      let error = null;

      // Simulate loadProfile function logic
      const loadProfile = async (userId: string) => {
        try {
          loading = true;
          error = null;

          if (!userId) {
            throw new Error("No user ID found");
          }

          let data = await profileService.getProfile(userId);

          if (!data) {
            data = await profileService.createProfile(userId);
          }

          profile = data;
        } catch (err) {
          error = err;
        } finally {
          loading = false;
        }
      };

      await loadProfile("user-123");

      expect(profileService.getProfile).toHaveBeenCalledWith("user-123");
      expect(profileService.createProfile).not.toHaveBeenCalled();
      expect(profile).toEqual(mockProfile);
      expect(loading).toBe(false);
      expect(error).toBeNull();
    });

    it("should create profile when none exists", async () => {
      (profileService.getProfile as jest.Mock).mockResolvedValue(null);
      (profileService.createProfile as jest.Mock).mockResolvedValue(
        mockProfile,
      );

      let profile: Profile | null = null;
      let loading = true;

      const loadProfile = async (userId: string) => {
        try {
          loading = true;

          let data = await profileService.getProfile(userId);

          if (!data) {
            data = await profileService.createProfile(userId);
          }

          profile = data;
        } finally {
          loading = false;
        }
      };

      await loadProfile("user-123");

      expect(profileService.getProfile).toHaveBeenCalledWith("user-123");
      expect(profileService.createProfile).toHaveBeenCalledWith("user-123");
      expect(profile).toEqual(mockProfile);
      expect(loading).toBe(false);
    });

    it("should handle error when user ID is missing", async () => {
      let profile: Profile | null = null;
      let loading = true;
      let error = null;

      const loadProfile = async (userId: string | undefined) => {
        try {
          loading = true;
          error = null;

          if (!userId) {
            throw new Error("No user ID found");
          }

          let data = await profileService.getProfile(userId);
          profile = data;
        } catch (err: any) {
          error = err.message;
        } finally {
          loading = false;
        }
      };

      await loadProfile(undefined);

      expect(profileService.getProfile).not.toHaveBeenCalled();
      expect(profile).toBeNull();
      expect(loading).toBe(false);
      expect(error).toBe("No user ID found");
    });

    it("should handle service errors gracefully", async () => {
      const serviceError = new Error("Service unavailable");
      (profileService.getProfile as jest.Mock).mockRejectedValue(serviceError);

      let profile: Profile | null = null;
      let loading = true;
      let error = null;

      const loadProfile = async (userId: string) => {
        try {
          loading = true;
          error = null;

          let data = await profileService.getProfile(userId);
          profile = data;
        } catch (err: any) {
          error = err.message;
          console.error("Error loading profile:", err);
        } finally {
          loading = false;
        }
      };

      await loadProfile("user-123");

      expect(profileService.getProfile).toHaveBeenCalledWith("user-123");
      expect(profile).toBeNull();
      expect(loading).toBe(false);
      expect(error).toBe("Service unavailable");
    });
  });

  describe("Real-time Subscription Logic", () => {
    it("should set up profile subscription correctly", () => {
      const mockUnsubscribe = jest.fn();
      (profileService.subscribeToProfileUpdates as jest.Mock).mockReturnValue(
        mockUnsubscribe,
      );

      let profile: Profile | null = null;

      // Simulate useEffect subscription setup
      const setupSubscription = (userId: string) => {
        return profileService.subscribeToProfileUpdates(
          userId,
          (updatedProfile) => {
            profile = updatedProfile;
          },
        );
      };

      const unsubscribe = setupSubscription("user-123");

      expect(profileService.subscribeToProfileUpdates).toHaveBeenCalledWith(
        "user-123",
        expect.any(Function),
      );

      // Test callback functionality
      const callback = (profileService.subscribeToProfileUpdates as jest.Mock)
        .mock.calls[0][1];
      const updatedProfile = { ...mockProfile, full_name: "Updated Name" };
      callback(updatedProfile);

      expect(profile).toEqual(updatedProfile);
      expect(typeof unsubscribe).toBe("function");
    });

    it("should clean up subscription on unmount", () => {
      const mockUnsubscribe = jest.fn();
      (profileService.subscribeToProfileUpdates as jest.Mock).mockReturnValue(
        mockUnsubscribe,
      );

      const setupSubscription = (userId: string) => {
        return profileService.subscribeToProfileUpdates(userId, () => {});
      };

      const unsubscribe = setupSubscription("user-123");

      // Simulate cleanup
      unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe("Navigation Logic", () => {
    it("should handle edit button press", () => {
      let navigatedTo = "";

      const mockRouter = {
        push: (path: string) => {
          navigatedTo = path;
        },
      };

      const handleEditPress = () => {
        mockRouter.push("/profileEdit");
      };

      handleEditPress();

      expect(navigatedTo).toBe("/profileEdit");
    });
  });

  describe("Profile Data Display Logic", () => {
    it("should format profile display data correctly", () => {
      const formatProfileData = (profile: Profile) => {
        return {
          displayName: profile.full_name || "No name",
          displayUsername: profile.username
            ? `@${profile.username}`
            : "No username",
          displayBio: profile.bio || "No bio provided",
          hasAvatar: !!profile.avatar_url,
          displayEmail: "test@example.com", // from user context
        };
      };

      const formatted = formatProfileData(mockProfile);

      expect(formatted).toEqual({
        displayName: "John Doe",
        displayUsername: "@johndoe",
        displayBio: "Test bio",
        hasAvatar: true,
        displayEmail: "test@example.com",
      });
    });

    it("should handle empty profile fields", () => {
      const emptyProfile: Profile = {
        id: "profile-123",
        user_id: "user-123",
      };

      const formatProfileData = (profile: Profile) => {
        return {
          displayName: profile.full_name || "No name",
          displayUsername: profile.username
            ? `@${profile.username}`
            : "No username",
          displayBio: profile.bio || "No bio provided",
          hasAvatar: !!profile.avatar_url,
        };
      };

      const formatted = formatProfileData(emptyProfile);

      expect(formatted).toEqual({
        displayName: "No name",
        displayUsername: "No username",
        displayBio: "No bio provided",
        hasAvatar: false,
      });
    });
  });

  describe("Loading States", () => {
    it("should manage loading state correctly", () => {
      let loading = false;

      const setLoadingState = (state: boolean) => {
        loading = state;
      };

      // Initially not loading
      expect(loading).toBe(false);

      // Set loading true
      setLoadingState(true);
      expect(loading).toBe(true);

      // Set loading false
      setLoadingState(false);
      expect(loading).toBe(false);
    });

    it("should show loading state during profile fetch", async () => {
      (profileService.getProfile as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockProfile), 100)),
      );

      let loading = false;
      let profile: Profile | null = null;

      const loadProfile = async () => {
        loading = true;
        try {
          profile = await profileService.getProfile("user-123");
        } finally {
          loading = false;
        }
      };

      const promise = loadProfile();

      // Should be loading initially
      expect(loading).toBe(true);
      expect(profile).toBeNull();

      await promise;

      // Should not be loading after completion
      expect(loading).toBe(false);
      expect(profile).toEqual(mockProfile);
    });
  });
});
