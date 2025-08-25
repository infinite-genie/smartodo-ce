import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  updatePassword,
  addToWaitlist,
  getCurrentUser,
  isAuthenticated,
} from "../../lib/auth";
import { supabase } from "../../lib/supabase";

// Mock the supabase module
jest.mock("../../lib/supabase");

describe("Authentication Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signIn", () => {
    it("should successfully sign in with valid credentials", async () => {
      const mockUser = { id: "123", email: "user@example.com" };
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signIn("user@example.com", "password123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Successfully signed in");
      expect(result.data).toEqual(mockUser);
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });

    it("should handle sign in errors", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });

      const result = await signIn("user@example.com", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid credentials");
    });

    it("should sanitize email before signing in", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: {} },
        error: null,
      });

      await signIn("  USER@EXAMPLE.COM  ", "password123");

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
      });
    });

    it("should handle unexpected errors", async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await signIn("user@example.com", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred during sign in",
      );
    });
  });

  describe("signUp", () => {
    it("should successfully sign up a new user", async () => {
      const mockUser = { id: "123", email: "newuser@example.com" };
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const result = await signUp(
        "newuser@example.com",
        "password123",
        "John Doe",
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Successfully signed up. Please check your email for confirmation.",
      );
      expect(result.data).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: "newuser@example.com",
        password: "password123",
        options: {
          data: {
            full_name: "John Doe",
          },
        },
      });
    });

    it("should handle sign up errors", async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: "User already exists" },
      });

      const result = await signUp(
        "existing@example.com",
        "password123",
        "John Doe",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("User already exists");
    });

    it("should handle unexpected errors during sign up", async () => {
      (supabase.auth.signUp as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await signUp(
        "user@example.com",
        "password123",
        "John Doe",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred during sign up",
      );
    });
  });

  describe("signOut", () => {
    it("should successfully sign out", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(result.message).toBe("Successfully signed out");
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it("should handle sign out errors", async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: "Sign out failed" },
      });

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Sign out failed");
    });

    it("should handle unexpected errors during sign out", async () => {
      (supabase.auth.signOut as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await signOut();

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred during sign out",
      );
    });
  });

  describe("resetPassword", () => {
    it("should successfully send password reset email", async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await resetPassword(
        "user@example.com",
        "https://app.example.com/reset",
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Password reset email sent successfully");
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        "user@example.com",
        { redirectTo: "https://app.example.com/reset" },
      );
    });

    it("should handle password reset errors", async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue({
        error: { message: "User not found" },
      });

      const result = await resetPassword(
        "nonexistent@example.com",
        "https://app.example.com/reset",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("User not found");
    });

    it("should handle unexpected errors during password reset", async () => {
      (supabase.auth.resetPasswordForEmail as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await resetPassword(
        "user@example.com",
        "https://app.example.com/reset",
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred during password reset",
      );
    });
  });

  describe("updatePassword", () => {
    it("should successfully update password", async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
        error: null,
      });

      const result = await updatePassword("newPassword123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Password updated successfully");
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "newPassword123",
      });
    });

    it("should handle password update errors", async () => {
      (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
        error: { message: "Password update failed" },
      });

      const result = await updatePassword("newPassword123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Password update failed");
    });

    it("should handle unexpected errors during password update", async () => {
      (supabase.auth.updateUser as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await updatePassword("newPassword123");

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred during password update",
      );
    });
  });

  describe("addToWaitlist", () => {
    it("should successfully add user to waitlist", async () => {
      const mockInsert = jest.fn().mockResolvedValue({ error: null });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await addToWaitlist("waitlist@example.com", "Jane Doe");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Successfully added to waitlist");
      expect(mockInsert).toHaveBeenCalledWith([
        {
          email: "waitlist@example.com",
          full_name: "Jane Doe",
          status: "pending",
        },
      ]);
    });

    it("should handle duplicate email in waitlist", async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        error: { code: "23505", message: "Duplicate key" },
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await addToWaitlist("existing@example.com", "Jane Doe");

      expect(result.success).toBe(false);
      expect(result.message).toBe("This email is already on the waitlist");
    });

    it("should handle general waitlist errors", async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        error: { message: "Database error" },
      });
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await addToWaitlist("user@example.com", "Jane Doe");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });

    it("should handle unexpected errors during waitlist addition", async () => {
      const mockInsert = jest
        .fn()
        .mockRejectedValue(new Error("Network error"));
      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      const result = await addToWaitlist("user@example.com", "Jane Doe");

      expect(result.success).toBe(false);
      expect(result.message).toBe("An unexpected error occurred");
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      const mockUser = { id: "123", email: "user@example.com" };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toEqual(mockUser);
    });

    it("should return null when not authenticated", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });

    it("should return null on error", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: "Session expired" },
      });

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });

    it("should return null on unexpected error", async () => {
      (supabase.auth.getUser as jest.Mock).mockRejectedValue(
        new Error("Network error"),
      );

      const user = await getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when user is authenticated", async () => {
      const mockUser = { id: "123", email: "user@example.com" };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const authenticated = await isAuthenticated();

      expect(authenticated).toBe(true);
    });

    it("should return false when user is not authenticated", async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const authenticated = await isAuthenticated();

      expect(authenticated).toBe(false);
    });
  });
});
