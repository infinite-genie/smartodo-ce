import { supabase } from "../supabase";
import { decode } from "base64-arraybuffer";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
}

class ProfileService {
  private realtimeChannels: Map<string, RealtimeChannel> = new Map();
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    return data;
  }

  async getCurrentUserProfile(): Promise<Profile | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    return this.getProfile(user.id);
  }

  async upsertUserProfile(profileData: ProfileUpdateData): Promise<Profile> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("profiles")
      .upsert([{ ...profileData, user_id: user.id }], { onConflict: "user_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from("profiles")
      .insert([{ user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateAvatar(avatarUrl: string): Promise<Profile> {
    return this.upsertUserProfile({ avatar_url: avatarUrl });
  }

  async deleteProfile(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
  }

  async uploadAvatar(base64Image: string): Promise<string> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    // Extract MIME type and validate
    const mimeMatch = base64Image.match(/^data:(image\/[^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";

    // Map MIME types to file extensions (only allow safe types)
    const mimeToExt: { [key: string]: string } = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    // Validate and get extension
    const fileExt = mimeToExt[mimeType];
    if (!fileExt) {
      throw new Error(
        "Invalid image format. Allowed formats: JPEG, PNG, WebP, GIF",
      );
    }

    // Generate unique filename with proper extension
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Convert base64 to ArrayBuffer
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const arrayBuffer = decode(base64Data);

    // Upload to Supabase Storage with dynamic content type
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: mimeType,
        upsert: true,
      });
    if (uploadError) throw uploadError;
    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);
    // Update profile with new avatar URL
    try {
      await this.upsertUserProfile({ avatar_url: publicUrl });
    } catch (error) {
      // Clean up uploaded file if profile update fails
      await supabase.storage.from("avatars").remove([filePath]);
      throw error;
    }
    return publicUrl;
  }

  async deleteAvatar(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    const profile = await this.getCurrentUserProfile();
    if (!profile?.avatar_url) return;

    // Extract file path from URL using URL parsing
    let filePath: string;
    try {
      const url = new URL(profile.avatar_url);
      const pathname = url.pathname;
      const pathSegments = pathname.split("/").filter((segment) => segment);

      // Take the last two segments (user_id/filename)
      if (pathSegments.length >= 2) {
        filePath = pathSegments.slice(-2).join("/");
      } else {
        throw new Error("Invalid avatar URL format");
      }
    } catch (error) {
      console.error("Failed to parse avatar URL:", error);
      throw new Error("Invalid avatar URL format");
    }

    // Delete from storage
    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) throw error;

    // Update profile to explicitly set avatar URL to null
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) throw updateError;
  }

  subscribeToProfileUpdates(
    userId: string,
    callback: (profile: Profile) => void,
  ): () => void {
    // Remove any existing channel for this userId
    const existingChannel = this.realtimeChannels.get(userId);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
      this.realtimeChannels.delete(userId);
    }

    // Create new channel for this userId
    const channel = supabase
      .channel(`profile:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as Profile);
          }
        },
      )
      .subscribe();

    // Store channel reference
    this.realtimeChannels.set(userId, channel);

    // Return unsubscribe function
    return () => {
      const channelToRemove = this.realtimeChannels.get(userId);
      if (channelToRemove) {
        supabase.removeChannel(channelToRemove);
        this.realtimeChannels.delete(userId);
      }
    };
  }

  unsubscribeFromProfileUpdates(userId?: string): void {
    if (userId) {
      // Unsubscribe specific user
      const channel = this.realtimeChannels.get(userId);
      if (channel) {
        supabase.removeChannel(channel);
        this.realtimeChannels.delete(userId);
      }
    } else {
      // Unsubscribe all
      this.realtimeChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      this.realtimeChannels.clear();
    }
  }
}

export const profileService = new ProfileService();
