# Git Workflow & Commit Strategy

This document outlines the git workflow and commit strategy for the SmartTodo monorepo.

## 🎯 Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) with monorepo-specific scopes.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `perf` - Performance improvements
- `ci` - CI/CD changes
- `build` - Build system changes
- `revert` - Reverting changes

### Scopes

- `mobile` - React Native app
- `web` - Web application
- `shared` - Shared packages/utilities
- `config` - Lerna, workspace, build configuration
- `deps` - Dependency updates
- `ci` - CI/CD pipeline
- `docs` - Documentation
- `root` - Root-level changes
- `api` - API/backend changes
- `ui` - UI components
- `auth` - Authentication
- `db` - Database changes
- `tools` - Development tools
- `scripts` - Build/dev scripts

### Examples

```bash
feat(mobile): add todo creation form with validation
fix(web): resolve login redirect loop on mobile browsers
feat(mobile,web): implement dark mode theme support
chore(deps): bump React to 18.3.0 across all packages
docs(mobile): add setup instructions for React Native
```

## 🔧 Setup & Tools

### Automatic Validation

- **commitlint** - Validates commit messages on commit
- **husky** - Git hooks for automation
- **lint-staged** - Runs linting/testing on staged files

### Git Message Template

Set up the commit message template:

```bash
git config commit.template .gitmessage
```

## 🚀 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feat/mobile-todo-creation

# Make changes with proper commits
git commit -m "feat(mobile): add todo input component"
git commit -m "feat(mobile): implement todo validation logic"
git commit -m "test(mobile): add todo creation tests"

# Push and create PR
git push -u origin feat/mobile-todo-creation
```

### 2. Pull Request Process

1. **Create PR** using the template (auto-filled)
2. **Check affected packages** in PR description
3. **Verify CI/CD** passes all checks
4. **Request reviews** from relevant team members
5. **Address feedback** with additional commits
6. **Squash merge** for clean history (optional)

### 3. Release Process

```bash
# Generate changelog
npm run changelog

# Create release with conventional commits
npm run release

# This will:
# - Analyze commits since last release
# - Determine version bump (patch/minor/major)
# - Update package.json versions
# - Create git tags
# - Generate changelog entries
```

## 📋 Pre-commit Checks

The following checks run automatically on every commit:

### Code Quality

- **Linting** - ESLint on JS/TS files
- **Testing** - Run tests for changed packages
- **Formatting** - Prettier on JSON/MD/YAML files

### Commit Message

- **Format validation** - Conventional commit format
- **Scope validation** - Must use predefined scopes
- **Type validation** - Must use predefined types

## 🎨 Branch Naming Convention

```bash
<type>/<scope>-<description>

# Examples:
feat/mobile-todo-creation
fix/web-login-redirect
chore/deps-react-upgrade
docs/mobile-setup-guide
```

## 🔄 Monorepo Considerations

### Cross-package Changes

When changes affect multiple packages:

```bash
feat(mobile,web): implement shared authentication flow

- Add auth context to mobile app
- Update web app login component
- Create shared auth utilities package
```

### Package-specific Development

```bash
# Work only on mobile app
cd apps/mobile/smarTODO
npm run dev

# Run tests for specific package
npx lerna run test --scope=smartodo

# Build specific package
npx lerna run build --scope=smartodo
```

### Dependency Management

```bash
# Add dependency to specific package
cd apps/mobile/smarTODO
npm install react-native-vector-icons

# Add dev dependency to root
npm install --save-dev prettier

# Update all dependencies
npx lerna exec npm update
```

## 🚨 Troubleshooting

### Commit Message Rejected

If your commit message is rejected:

1. Check the format matches: `type(scope): description`
2. Ensure scope is from the allowed list
3. Use lowercase for type and scope
4. Don't end description with a period

### Pre-commit Hooks Failing

If pre-commit hooks fail:

1. Fix linting errors: `npx lerna run lint --fix`
2. Fix test failures: `npx lerna run test`
3. Format files: `npx prettier --write .`

### Husky Not Working

If git hooks aren't running:

```bash
# Reinstall husky hooks
npm run prepare
# Or manually
npx husky install
```

## 📊 Changelog Generation

Changelogs are automatically generated based on conventional commits:

- `feat` → **Features** section
- `fix` → **Bug Fixes** section
- `perf` → **Performance Improvements** section
- `BREAKING CHANGE` → **BREAKING CHANGES** section

## 🎯 Best Practices

1. **Atomic commits** - One logical change per commit
2. **Clear descriptions** - Use imperative mood ("add" not "added")
3. **Proper scoping** - Always include relevant scope
4. **Test before commit** - Ensure tests pass locally
5. **Review your changes** - Use `git diff --staged` before committing
6. **Keep history clean** - Rebase feature branches if needed

## 📞 Getting Help

- Check this document first
- Review [Conventional Commits](https://www.conventionalcommits.org/)
- Ask team members for guidance on scope selection
- Use `git log --oneline` to see examples of good commit messages
