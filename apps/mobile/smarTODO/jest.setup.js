// Jest setup file for React Native testing

// Extend expect with jest-native matchers
import "@testing-library/jest-native/extend-expect";

// Mock environment variables
process.env.EXPO_PUBLIC_SUPABASE_URL = "TEST_SUPABASE_URL_PLACEHOLDER";
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
  "TEST_SUPABASE_ANON_KEY_PLACEHOLDER";

// Mock polyfills
jest.mock("react-native-url-polyfill/auto", () => {});
jest.mock("react-native-get-random-values", () => {});

// Mock expo modules
jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock("expo-linking", () => ({
  createURL: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  parseInitialURLAsync: jest.fn(() => Promise.resolve("")),
  openURL: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        EXPO_PUBLIC_APP_URL: "https://smartodo.app",
      },
    },
    manifest: {
      extra: {
        EXPO_PUBLIC_APP_URL: "https://smartodo.app",
      },
    },
  },
}));

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mock Supabase
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      getSession: jest.fn(() => Promise.resolve({ data: null, error: null })),
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      upsert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  })),
}));

// Mock Tamagui Avatar component
jest.mock("@tamagui/avatar", () => ({
  Avatar: Object.assign(({ children }) => children, {
    Image: ({ children }) => children,
    Fallback: ({ children }) => children,
  }),
}));

// Mock Tamagui Separator component
jest.mock("@tamagui/separator", () => ({
  Separator: () => null,
}));

// Mock Tamagui Lucide Icons
jest.mock("@tamagui/lucide-icons", () => {
  const MockIcon = () => null;
  return {
    Home: MockIcon,
    CheckSquare: MockIcon,
    Calendar: MockIcon,
    Settings: MockIcon,
    LogOut: MockIcon,
    User: MockIcon,
    Plus: MockIcon,
    Menu: MockIcon,
  };
});

// Mock expo-router
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    navigate: jest.fn(),
  },
  Link: "Link",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
}));

// Mock SafeAreaView
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaConsumer: ({ children }) => children(inset),
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Silence console warnings during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args) => {
    if (args[0]?.includes?.("Warning:") || args[0]?.includes?.("Deprecation")) {
      return;
    }
    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    if (args[0]?.includes?.("Warning:") || args[0]?.includes?.("Error:")) {
      return;
    }
    originalError.apply(console, args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
