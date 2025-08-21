// apps/mobile/smarTODO/lib/supabase.ts

import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy apps/mobile/smarTODO/.env.example to .env and restart the dev server.",
  );
}

// Debug logging in development
if (__DEV__) {
  console.log("Supabase Config:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlStartsWith: supabaseUrl.startsWith("https://") ? "https://" : "invalid",
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
