# Testing Documentation for smarTODO Mobile App

## Overview

This mobile app uses Jest as the testing framework with React Native Testing Library for component testing. The test suite focuses on critical business logic components following industry-accepted standards.

## Test Setup

### Dependencies

- **jest**: Core testing framework
- **@testing-library/react-native**: React Native testing utilities
- **jest-expo**: Jest preset for Expo apps
- **babel-jest**: JavaScript transpilation for tests
- **react-test-renderer**: React component rendering for tests

### Configuration Files

- **jest.config.js**: Main Jest configuration
- **jest.setup.js**: Test environment setup and global mocks
- **babel.config.js**: Babel configuration for transpiling code

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI environment
npm run test:ci
```

## Code Coverage

Current coverage thresholds:

- **Branches**: 60%
- **Functions**: 60%
- **Lines**: 60%
- **Statements**: 60%

### Current Coverage Status

```
File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|----------
All files      |   92.68 |    96.66 |     100 |   92.68
 auth.ts       |   89.65 |    93.75 |     100 |   89.65
 validation.ts |     100 |      100 |     100 |     100
```

Coverage reports are generated in:

- **Terminal**: Text summary after running `npm run test:coverage`
- **HTML Report**: `coverage/lcov-report/index.html`
- **LCOV Format**: `coverage/lcov.info` (for CI tools)

## What We Test

Following industry standards, we focus testing on:

### 1. **Business Logic** (Priority: HIGH)

- Authentication functions (`lib/auth.ts`)
- Form validation utilities (`lib/validation.ts`)
- Data transformation functions
- Complex calculations

### 2. **Critical User Flows** (Priority: HIGH)

- User authentication (login, signup, logout)
- Password reset flow
- Waitlist signup
- Session management

### 3. **Utility Functions** (Priority: MEDIUM)

- Email validation
- Password strength validation
- Name sanitization
- Input formatting

## What We Don't Test

Following best practices, we skip testing for:

- **Simple UI components** without logic
- **Third-party library internals**
- **Configuration files**
- **Styling-only components**
- **Direct API calls** (mocked in tests)

## Test Structure

### Unit Tests Location

```
__tests__/
├── lib/
│   ├── auth.test.ts       # Authentication logic tests
│   └── validation.test.ts # Validation utilities tests
```

### Test File Naming Convention

- Test files: `*.test.ts` or `*.test.tsx`
- Test directories: `__tests__/`

## Writing New Tests

### Example Test Structure

```typescript
import { functionToTest } from "../path/to/module";

describe("Module Name", () => {
  describe("functionToTest", () => {
    it("should handle normal case", () => {
      const result = functionToTest("input");
      expect(result).toBe("expected");
    });

    it("should handle edge case", () => {
      const result = functionToTest("");
      expect(result).toBe(null);
    });

    it("should handle error case", async () => {
      await expect(functionToTest("invalid")).rejects.toThrow();
    });
  });
});
```

### Mocking Guidelines

1. **Mock external dependencies** (Supabase, AsyncStorage, etc.)
2. **Mock navigation** (expo-router)
3. **Mock platform-specific modules** (expo-linking, expo-constants)
4. **Keep mocks simple and maintainable**

## CI/CD Integration

The test suite is designed to run in CI environments:

```bash
npm run test:ci
```

This command:

- Runs tests without watch mode
- Generates coverage reports
- Uses limited workers for CI performance
- Exits with proper error codes

## Best Practices

1. **Test behavior, not implementation**
2. **Keep tests isolated and independent**
3. **Use descriptive test names**
4. **Follow AAA pattern**: Arrange, Act, Assert
5. **Mock external dependencies**
6. **Test edge cases and error scenarios**
7. **Maintain high coverage for critical paths**
8. **Keep test files close to source files**

## Troubleshooting

### Common Issues

1. **Module not found errors**: Check `transformIgnorePatterns` in jest.config.js
2. **Async test timeouts**: Increase timeout or check async handling
3. **Mock not working**: Ensure mock is defined before import
4. **Coverage not accurate**: Check `collectCoverageFrom` patterns

### Debug Mode

Run tests with debugging output:

```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## Future Improvements

- [ ] Add integration tests for complete user flows
- [ ] Add E2E tests using Detox or Maestro
- [ ] Increase coverage threshold as codebase matures
- [ ] Add visual regression testing for UI components
- [ ] Set up mutation testing for test quality
