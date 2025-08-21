import { supabase } from "./supabase";
import { sanitizeEmail } from "./validation";

export interface AuthResult {
  success: boolean;
  message: string;
  data?: any;
}

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Successfully signed in",
      data: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred during sign in",
    };
  }
};

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
): Promise<AuthResult> => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message:
        "Successfully signed up. Please check your email for confirmation.",
      data: data.user,
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred during sign up",
    };
  }
};

export const signOut = async (): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Successfully signed out",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred during sign out",
    };
  }
};

export const resetPassword = async (
  email: string,
  redirectUrl: string,
): Promise<AuthResult> => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const { error } = await supabase.auth.resetPasswordForEmail(
      sanitizedEmail,
      {
        redirectTo: redirectUrl,
      },
    );

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred during password reset",
    };
  }
};

export const updatePassword = async (
  newPassword: string,
): Promise<AuthResult> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred during password update",
    };
  }
};

export const addToWaitlist = async (
  email: string,
  fullName: string,
): Promise<AuthResult> => {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    const { error } = await supabase.from("waitlist").insert([
      {
        email: sanitizedEmail,
        full_name: fullName,
        status: "pending",
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return {
          success: false,
          message: "This email is already on the waitlist",
        };
      }
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Successfully added to waitlist",
    };
  } catch (err) {
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return null;
    }

    return user;
  } catch (err) {
    return null;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
