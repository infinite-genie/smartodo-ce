module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "mobile", // React Native app
        "web", // Web application
        "shared", // Shared packages/utilities
        "config", // Lerna, workspace, build configuration
        "deps", // Dependency updates
        "ci", // CI/CD pipeline
        "docs", // Documentation
        "root", // Root-level changes
        "api", // API/backend changes
        "ui", // UI components
        "auth", // Authentication
        "db", // Database changes
        "tools", // Development tools
        "scripts", // Build/dev scripts
      ],
    ],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "always", "lower-case"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation changes
        "style", // Code style changes (formatting, etc.)
        "refactor", // Code refactoring
        "test", // Adding or updating tests
        "chore", // Maintenance tasks
        "perf", // Performance improvements
        "ci", // CI/CD changes
        "build", // Build system changes
        "revert", // Reverting changes
      ],
    ],
  },
  ignores: [
    // Allow merge commits
    (commit) => commit.includes("Merge"),
    // Allow initial commits
    (commit) => commit.includes("Initial commit"),
  ],
};
