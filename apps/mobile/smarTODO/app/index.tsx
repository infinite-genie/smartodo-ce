import { useEffect } from "react";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/AuthContext";

/**
 * Index screen that handles authentication routing.
 *
 * This screen:
 * - Waits for auth state to be determined
 * - Handles navigation timing to prevent flickering
 * - Redirects to /home if authenticated
 * - Redirects to /onboarding if not authenticated
 */
export default function IndexScreen() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    // Only navigate when auth state is determined (not loading)
    if (!isLoading) {
      const navigate = async () => {
        if (session) {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }

        // Hide splash screen after navigation is initiated
        await SplashScreen.hideAsync();
      };

      navigate();
    }
  }, [session, isLoading]);

  // This screen renders nothing - the native splash screen is visible
  // until the auth check is complete and navigation begins
  return null;
}
