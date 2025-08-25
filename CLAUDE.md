# Claude Code Instructions for smarTODO

## Testing Guidelines

### Overview

This React Native + Tamagui project uses a **hybrid testing strategy** optimized for component library complexity and cross-platform development. Focus on logic testing over UI rendering tests.

### Testing Architecture

```
__tests__/
├── lib/                    # Pure function tests (Target: 95%+)
├── components/             # Component logic tests (Target: 80%+)
├── hooks/                  # Custom hook tests (Target: 85%+)
└── integration/            # API/flow tests (Target: Key flows)
```

### Test Commands

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test pattern
npm test -- --testPathPatterns="validation"

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- __tests__/lib/auth.test.ts
```

### Testing Strategy by File Type

#### 1. Utility Functions (`lib/`)

**✅ PRIORITY: High-value, easy to test**

```typescript
// ✅ DO: Test pure functions completely
describe("validateEmail", () => {
  it("should validate correct email formats", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("invalid")).toBe(false);
  });
});
```

#### 2. React Components (`components/`)

**⚠️ STRATEGY: Test logic, not rendering**

```typescript
// ✅ DO: Test component logic separately
describe("AppLayout Logic", () => {
  it("should toggle sidebar state correctly", () => {
    let sidebarOpen = false;
    const toggleSidebar = () => { sidebarOpen = !sidebarOpen; };

    expect(sidebarOpen).toBe(false);
    toggleSidebar();
    expect(sidebarOpen).toBe(true);
  });
});

// ❌ DON'T: Try to render Tamagui components
// This will fail due to DOM API requirements
render(<AppLayout><Text>Test</Text></AppLayout>);
```

#### 3. Custom Hooks (`hooks/`)

**🎯 RECOMMENDED: Use @testing-library/react-hooks**

```typescript
// ✅ DO: Test hook logic and state management
describe("useAuth", () => {
  it("should handle authentication state", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login("test@example.com", "password");
    });

    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

#### 4. API Integration (`lib/auth.ts`, etc.)

**✅ CURRENT: Well-covered with mocks**

```typescript
// ✅ DO: Mock Supabase and test error handling
jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));
```

### Current Mocking Setup

The project has robust mocking in `jest.setup.js`:

```javascript
// ✅ Well-configured mocks for:
- Tamagui components (simplified rendering)
- React Native Reanimated (animation mocks)
- Expo modules (fonts, linking, constants)
- Supabase (complete auth/db mocking)
- SafeAreaView (cross-platform safe areas)
- React Navigation (routing mocks)
```

### Writing New Tests

#### When Adding New Utility Functions

```typescript
// File: lib/new-utility.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Test: __tests__/lib/new-utility.test.ts
describe("formatCurrency", () => {
  it("should format positive amounts", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should handle decimals", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
  });
});
```

#### When Adding New Components

```typescript
// File: components/NewComponent.tsx
export default function NewComponent({ title, onPress }: Props) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => setIsActive(!isActive);

  return (
    <Button onPress={onPress} testID="new-component">
      <Text>{title}</Text>
    </Button>
  );
}

// Test: __tests__/components/component-logic.test.ts
describe("NewComponent Logic", () => {
  it("should toggle active state", () => {
    let isActive = false;
    const handleToggle = () => { isActive = !isActive; };

    expect(isActive).toBe(false);
    handleToggle();
    expect(isActive).toBe(true);
  });

  it("should handle press events", () => {
    const mockOnPress = jest.fn();

    // Test the callback logic
    const handlePress = () => mockOnPress();
    handlePress();

    expect(mockOnPress).toHaveBeenCalled();
  });
});
```

#### When Adding API Functions

```typescript
// File: lib/api.ts
export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Test: __tests__/lib/api.test.ts
describe("fetchUserProfile", () => {
  it("should return user data on success", async () => {
    const mockData = { id: "123", name: "John" };
    supabase.from().select().eq().single.mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await fetchUserProfile("123");
    expect(result).toEqual(mockData);
  });

  it("should throw error on failure", async () => {
    supabase
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

    await expect(fetchUserProfile("123")).rejects.toThrow("User not found");
  });
});
```

### Coverage Expectations

| File Type          | Target Coverage | Focus                      |
| ------------------ | --------------- | -------------------------- |
| `lib/*.ts`         | 90%+            | All functions, error cases |
| `components/*.tsx` | 50%+            | Logic only, not rendering  |
| `hooks/*.ts`       | 85%+            | State management, effects  |
| `app/*.tsx`        | 30%+            | Screen logic, navigation   |

### Common Testing Patterns

#### Error Handling

```typescript
it("should handle network errors gracefully", async () => {
  const networkError = new Error("Network failed");
  mockApiCall.mockRejectedValue(networkError);

  const result = await apiFunction();

  expect(result.success).toBe(false);
  expect(result.error).toBe("Network failed");
});
```

#### Async Operations

```typescript
it("should handle async state updates", async () => {
  const promise = asyncFunction();

  // Test loading state
  expect(isLoading).toBe(true);

  await promise;

  // Test completion state
  expect(isLoading).toBe(false);
  expect(result).toBeDefined();
});
```

#### Form Validation

```typescript
it("should validate form fields", () => {
  const errors = validateForm({
    email: "invalid-email",
    password: "123",
  });

  expect(errors.email).toContain("Invalid email format");
  expect(errors.password).toContain("Password too short");
});
```

### Don'ts

❌ **Don't test UI rendering** - Tamagui components require complex DOM mocking
❌ **Don't test third-party libraries** - Focus on your application logic
❌ **Don't aim for 100% coverage** - Focus on high-value, business-critical code
❌ **Don't test implementation details** - Test behavior, not internal structure
❌ **Don't mock everything** - Mock at the boundaries (APIs, external services)

### Running Tests in CI/CD

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --coverage --watchAll=false

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

### Test-Driven Development

When adding new features:

1. **Write failing tests first** for the core logic
2. **Implement the minimum** code to pass tests
3. **Refactor** while keeping tests green
4. **Add edge cases** and error scenarios
5. **Update mocks** if adding new dependencies

### Debugging Tests

```bash
# Debug specific test
npm test -- --testNamePattern="should validate email" --verbose

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand

# Generate coverage report
npm run test:coverage
open coverage/lcov-report/index.html
```

### Best Practices

✅ **Test behavior, not implementation**
✅ **Use descriptive test names** that explain the expected behavior
✅ **Group related tests** with `describe` blocks
✅ **Mock external dependencies** at the boundary
✅ **Test error conditions** and edge cases
✅ **Keep tests simple** and focused
✅ **Use TypeScript** for test files to catch errors early

Remember: **Quality over quantity**. Focus on testing the critical business logic that powers the application rather than chasing coverage metrics.
