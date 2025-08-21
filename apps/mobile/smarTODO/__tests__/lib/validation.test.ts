import {
  validateEmail,
  validatePassword,
  validateFullName,
  validatePasswordMatch,
  sanitizeEmail,
  sanitizeFullName,
} from "../../lib/validation";

describe("Validation Utilities", () => {
  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("user.name@example.com")).toBe(true);
      expect(validateEmail("user+tag@example.co.uk")).toBe(true);
      expect(validateEmail("user_name@example-domain.com")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("invalid@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user@example")).toBe(false);
      expect(validateEmail("user @example.com")).toBe(false);
      expect(validateEmail("user@exam ple.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      const result = validatePassword("StrongP@ss123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject passwords less than 8 characters", () => {
      const result = validatePassword("Short1!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long",
      );
    });

    it("should require at least one uppercase letter", () => {
      const result = validatePassword("weakpass123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter",
      );
    });

    it("should require at least one lowercase letter", () => {
      const result = validatePassword("WEAKPASS123!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter",
      );
    });

    it("should require at least one number", () => {
      const result = validatePassword("WeakPass!");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number",
      );
    });

    it("should require at least one special character", () => {
      const result = validatePassword("WeakPass123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one special character",
      );
    });

    it("should return multiple errors for very weak passwords", () => {
      const result = validatePassword("weak");
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe("validateFullName", () => {
    it("should validate correct name formats", () => {
      expect(validateFullName("John Doe")).toBe(true);
      expect(validateFullName("Mary")).toBe(true);
      expect(validateFullName("O'Brien")).toBe(true);
      expect(validateFullName("Jean-Pierre")).toBe(true);
      expect(validateFullName("Mary Jane Smith")).toBe(true);
    });

    it("should reject invalid name formats", () => {
      expect(validateFullName("J")).toBe(false); // Too short
      expect(validateFullName("John123")).toBe(false); // Contains numbers
      expect(validateFullName("John@Doe")).toBe(false); // Contains special characters
      expect(validateFullName("")).toBe(false); // Empty
      expect(validateFullName("  ")).toBe(false); // Only spaces
    });
  });

  describe("validatePasswordMatch", () => {
    it("should return true when passwords match", () => {
      expect(validatePasswordMatch("password123", "password123")).toBe(true);
    });

    it("should return false when passwords do not match", () => {
      expect(validatePasswordMatch("password123", "password456")).toBe(false);
    });

    it("should return false when passwords are empty", () => {
      expect(validatePasswordMatch("", "")).toBe(false);
    });
  });

  describe("sanitizeEmail", () => {
    it("should trim and lowercase email addresses", () => {
      expect(sanitizeEmail("  USER@EXAMPLE.COM  ")).toBe("user@example.com");
      expect(sanitizeEmail("John.Doe@Example.Com")).toBe(
        "john.doe@example.com",
      );
    });

    it("should handle already clean emails", () => {
      expect(sanitizeEmail("user@example.com")).toBe("user@example.com");
    });
  });

  describe("sanitizeFullName", () => {
    it("should trim and normalize spaces in names", () => {
      expect(sanitizeFullName("  John   Doe  ")).toBe("John Doe");
      expect(sanitizeFullName("Mary    Jane    Smith")).toBe("Mary Jane Smith");
    });

    it("should handle already clean names", () => {
      expect(sanitizeFullName("John Doe")).toBe("John Doe");
    });

    it("should handle single names", () => {
      expect(sanitizeFullName("  John  ")).toBe("John");
    });
  });
});
