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
  private realtimeChannel: RealtimeChannel | null = null;
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

    // Generate unique filename
    const fileExt = "jpg";
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Convert base64 to ArrayBuffer
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const arrayBuffer = decode(base64Data);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Update profile with new avatar URL
    await this.upsertUserProfile({ avatar_url: publicUrl });

    return publicUrl;
  }

  async deleteAvatar(): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No user logged in");

    const profile = await this.getCurrentUserProfile();
    if (!profile?.avatar_url) return;

    // Extract file path from URL
    const urlParts = profile.avatar_url.split("/");
    const filePath = urlParts.slice(-2).join("/");

    // Delete from storage
    const { error } = await supabase.storage.from("avatars").remove([filePath]);

    if (error) throw error;

    // Update profile to remove avatar URL
    await this.upsertUserProfile({ avatar_url: undefined });
  }

  subscribeToProfileUpdates(
    userId: string,
    callback: (profile: Profile) => void,
  ): () => void {
    this.realtimeChannel = supabase
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

    // Return unsubscribe function
    return () => {
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }
    };
  }

  unsubscribeFromProfileUpdates(): void {
    if (this.realtimeChannel) {
      supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }
  }
}

export const profileService = new ProfileService();
