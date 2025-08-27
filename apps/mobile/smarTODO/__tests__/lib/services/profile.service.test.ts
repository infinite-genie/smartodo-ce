import {
  profileService,
  Profile,
  ProfileUpdateData,
} from "../../../lib/services/profile.service";

// Mock the supabase module with proper structure
jest.mock("../../../lib/supabase", () => {
  const mockChainable = {
    select: jest.fn(),
    eq: jest.fn(),
    single: jest.fn(),
    upsert: jest.fn(),
    insert: jest.fn(),
    delete: jest.fn(),
  };

  // Important: Setup chainable returns - each method returns the same object
  mockChainable.select.mockImplementation(() => mockChainable);
  mockChainable.eq.mockImplementation(() => mockChainable);
  mockChainable.upsert.mockImplementation(() => mockChainable);
  mockChainable.insert.mockImplementation(() => mockChainable);
  mockChainable.delete.mockImplementation(() => mockChainable);

  const mockStorage = {
    upload: jest.fn(),
    remove: jest.fn(),
    getPublicUrl: jest.fn(),
  };

  const mockChannel = {
    on: jest.fn(),
    subscribe: jest.fn(),
  };

  // Set up chainable returns for channel
  mockChannel.on.mockReturnValue(mockChannel);
  mockChannel.subscribe.mockReturnValue(mockChannel);

  return {
    supabase: {
      auth: {
        getUser: jest.fn(),
      },
      from: jest.fn(() => mockChainable),
      storage: {
        from: jest.fn(() => mockStorage),
      },
      channel: jest.fn(() => mockChannel),
      removeChannel: jest.fn(),
    },
    __mockChainable: mockChainable,
    __mockStorage: mockStorage,
    __mockChannel: mockChannel,
  };
});

// Mock base64-arraybuffer
jest.mock("base64-arraybuffer", () => ({
  decode: jest.fn(() => new ArrayBuffer(8)),
}));

const {
  supabase,
  __mockChainable,
  __mockStorage,
  __mockChannel,
} = require("../../../lib/supabase");

describe("ProfileService", () => {
  const mockUser = { id: "user-123" };
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
    // Re-establish chainable returns after clearing mocks
    __mockChainable.select.mockImplementation(() => __mockChainable);
    __mockChainable.eq.mockImplementation(() => __mockChainable);
    __mockChainable.upsert.mockImplementation(() => __mockChainable);
    __mockChainable.insert.mockImplementation(() => __mockChainable);
    __mockChainable.delete.mockImplementation(() => __mockChainable);
  });

  describe("getProfile", () => {
    it("should return profile data when found", async () => {
      __mockChainable.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await profileService.getProfile("user-123");

      expect(supabase.from).toHaveBeenCalledWith("profiles");
      expect(__mockChainable.select).toHaveBeenCalledWith("*");
      expect(__mockChainable.eq).toHaveBeenCalledWith("user_id", "user-123");
      expect(result).toEqual(mockProfile);
    });

    it("should return null when profile not found", async () => {
      __mockChainable.single.mockResolvedValue({
        data: null,
        error: { code: "PGRST116" },
      });

      const result = await profileService.getProfile("user-123");
      expect(result).toBeNull();
    });

    it("should throw error for database errors", async () => {
      const dbError = { code: "OTHER_ERROR", message: "Database error" };
      __mockChainable.single.mockResolvedValue({
        data: null,
        error: dbError,
      });

      await expect(profileService.getProfile("user-123")).rejects.toEqual(
        dbError,
      );
    });
  });

  describe("getCurrentUserProfile", () => {
    it("should return current user profile", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      __mockChainable.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await profileService.getCurrentUserProfile();

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual(mockProfile);
    });

    it("should throw error when no user is logged in", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(profileService.getCurrentUserProfile()).rejects.toThrow(
        "No user logged in",
      );
    });
  });

  describe("upsertUserProfile", () => {
    const updateData: ProfileUpdateData = {
      full_name: "Jane Doe",
      bio: "Updated bio",
    };

    it("should update user profile successfully", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      __mockChainable.single.mockResolvedValue({
        data: { ...mockProfile, ...updateData },
        error: null,
      });

      const result = await profileService.upsertUserProfile(updateData);

      expect(__mockChainable.upsert).toHaveBeenCalledWith(
        [{ ...updateData, user_id: "user-123" }],
        { onConflict: "user_id" },
      );
      expect(result).toEqual({ ...mockProfile, ...updateData });
    });

    it("should throw error when no user is logged in", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(
        profileService.upsertUserProfile(updateData),
      ).rejects.toThrow("No user logged in");
    });

    it("should throw error on database error", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const dbError = { message: "Update failed" };
      __mockChainable.single.mockResolvedValue({
        data: null,
        error: dbError,
      });

      await expect(
        profileService.upsertUserProfile(updateData),
      ).rejects.toEqual(dbError);
    });
  });

  describe("createProfile", () => {
    it("should create new profile successfully", async () => {
      __mockChainable.single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      const result = await profileService.createProfile("user-123");

      expect(__mockChainable.insert).toHaveBeenCalledWith([
        { user_id: "user-123" },
      ]);
      expect(result).toEqual(mockProfile);
    });

    it("should throw error on creation failure", async () => {
      const dbError = { message: "Creation failed" };
      __mockChainable.single.mockResolvedValue({
        data: null,
        error: dbError,
      });

      await expect(profileService.createProfile("user-123")).rejects.toEqual(
        dbError,
      );
    });
  });

  describe("updateAvatar", () => {
    it("should update avatar URL", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const avatarUrl = "https://example.com/new-avatar.jpg";
      __mockChainable.single.mockResolvedValue({
        data: { ...mockProfile, avatar_url: avatarUrl },
        error: null,
      });

      const result = await profileService.updateAvatar(avatarUrl);

      expect(result.avatar_url).toBe(avatarUrl);
    });
  });

  describe("deleteProfile", () => {
    it("should delete profile successfully", async () => {
      __mockChainable.eq.mockResolvedValue({ error: null });

      await profileService.deleteProfile("user-123");

      expect(__mockChainable.delete).toHaveBeenCalled();
      expect(__mockChainable.eq).toHaveBeenCalledWith("user_id", "user-123");
    });

    it("should throw error on deletion failure", async () => {
      const dbError = { message: "Deletion failed" };
      __mockChainable.eq.mockResolvedValue({ error: dbError });

      await expect(profileService.deleteProfile("user-123")).rejects.toEqual(
        dbError,
      );
    });
  });

  describe("uploadAvatar", () => {
    const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA";

    it("should upload avatar successfully", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      __mockStorage.upload.mockResolvedValue({ error: null });
      __mockStorage.getPublicUrl.mockReturnValue({
        data: { publicUrl: "https://example.com/uploaded-avatar.jpg" },
      });

      __mockChainable.single.mockResolvedValue({
        data: {
          ...mockProfile,
          avatar_url: "https://example.com/uploaded-avatar.jpg",
        },
        error: null,
      });

      const result = await profileService.uploadAvatar(base64Image);

      expect(__mockStorage.upload).toHaveBeenCalled();
      expect(result).toBe("https://example.com/uploaded-avatar.jpg");
    });

    it("should throw error when no user is logged in", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(profileService.uploadAvatar(base64Image)).rejects.toThrow(
        "No user logged in",
      );
    });

    it("should throw error on upload failure", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      const uploadError = { message: "Upload failed" };
      __mockStorage.upload.mockResolvedValue({ error: uploadError });

      await expect(profileService.uploadAvatar(base64Image)).rejects.toEqual(
        uploadError,
      );
    });
  });

  describe("deleteAvatar", () => {
    it("should delete avatar successfully", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      // Mock getCurrentUserProfile call first, then upsertUserProfile call
      __mockChainable.single
        .mockResolvedValueOnce({
          data: mockProfile,
          error: null,
        })
        .mockResolvedValueOnce({
          data: { ...mockProfile, avatar_url: undefined },
          error: null,
        });

      __mockStorage.remove.mockResolvedValue({ error: null });

      await profileService.deleteAvatar();

      expect(__mockStorage.remove).toHaveBeenCalled();
    });

    it("should return early if no avatar exists", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      });

      __mockChainable.single.mockResolvedValue({
        data: { ...mockProfile, avatar_url: null },
        error: null,
      });

      await profileService.deleteAvatar();

      expect(__mockStorage.remove).not.toHaveBeenCalled();
    });

    it("should throw error when no user is logged in", async () => {
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      });

      await expect(profileService.deleteAvatar()).rejects.toThrow(
        "No user logged in",
      );
    });
  });

  describe("subscribeToProfileUpdates", () => {
    it("should set up realtime subscription", () => {
      const callback = jest.fn();

      const unsubscribe = profileService.subscribeToProfileUpdates(
        "user-123",
        callback,
      );

      expect(supabase.channel).toHaveBeenCalledWith("profile:user-123");
      expect(__mockChannel.on).toHaveBeenCalledWith(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "user_id=eq.user-123",
        },
        expect.any(Function),
      );
      expect(__mockChannel.subscribe).toHaveBeenCalled();
      expect(typeof unsubscribe).toBe("function");
    });

    it("should call callback when profile updates", () => {
      const callback = jest.fn();

      profileService.subscribeToProfileUpdates("user-123", callback);

      // Get the callback passed to channel.on and simulate payload
      const onCallback = __mockChannel.on.mock.calls[0][2];
      const payload = { new: mockProfile };

      onCallback(payload);

      expect(callback).toHaveBeenCalledWith(mockProfile);
    });

    it("should return unsubscribe function that removes channel", () => {
      const callback = jest.fn();

      const unsubscribe = profileService.subscribeToProfileUpdates(
        "user-123",
        callback,
      );
      unsubscribe();

      expect(supabase.removeChannel).toHaveBeenCalled();
    });
  });

  describe("unsubscribeFromProfileUpdates", () => {
    it("should remove channel if exists", () => {
      const callback = jest.fn();

      // Set up a subscription first
      profileService.subscribeToProfileUpdates("user-123", callback);
      profileService.unsubscribeFromProfileUpdates();

      expect(supabase.removeChannel).toHaveBeenCalled();
    });

    it("should do nothing if no channel exists", () => {
      jest.clearAllMocks(); // Clear any previous calls
      profileService.unsubscribeFromProfileUpdates();

      // Should not throw or crash, and removeChannel should not be called
      expect(supabase.removeChannel).not.toHaveBeenCalled();
    });
  });
});
