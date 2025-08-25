import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../contexts/AuthContext";

/**
 * Index screen that handles authentication routing and splash screen management.
 *
 * This screen:
 * - Waits for auth state to be determined
 * - Handles navigation timing to prevent flickering
 * - Hides the native splash screen after navigation starts
 * - Redirects to /home if authenticated
 * - Redirects to /onboarding if not authenticated
 */
export default function IndexScreen() {
  const { session, isLoading } = useAuth();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!isLoading && !hasNavigated) {
      setHasNavigated(true);

      // Use setTimeout to ensure navigation happens on next frame
      // This prevents flickering by ensuring the navigation is ready
      const timer = setTimeout(async () => {
        if (session) {
          // User is authenticated, go to home
          router.replace("/home");
        } else {
          // User is not authenticated, go to onboarding
          router.replace("/onboarding");
        }

        // Hide splash screen after navigation starts
        await SplashScreen.hideAsync();
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [session, isLoading, hasNavigated]);

  // This screen renders nothing - the native splash screen is visible
  // until the auth check is complete and navigation begins
  return null;
}
