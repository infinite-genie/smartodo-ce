# smarTODO Community Edition 📝

A modern, cross-platform todo management application built with React Native, React Router, and Supabase. This monorepo contains both mobile and web applications with a shared backend infrastructure.

## 🏗️ Architecture

This is a **Lerna monorepo** containing multiple applications and shared packages:

```
smartodo-ce/
├── apps/
│   ├── mobile/smarTODO/     # React Native mobile app (Expo)
│   ├── web/smartodo/        # React Router web app
│   └── supabase/           # Supabase backend configuration
└── packages/               # Shared packages (future)
```

## 🚀 Tech Stack

### Frontend

- **Mobile**: React Native 0.79 + Expo 53 + Expo Router
- **Web**: React 19 + React Router 7 + Tailwind CSS
- **UI Framework**: Tamagui (Mobile), Tailwind CSS (Web)
- **State Management**: React Context + React Hooks
- **Navigation**: Expo Router (Mobile), React Router (Web)

### Backend

- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Edge Functions**: Supabase Functions (Deno)

### Development Tools

- **Monorepo**: Lerna 8.2.3
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + Commitlint
- **Deployment**: Docker (Web), Expo EAS (Mobile)

## 📱 Features

- **Cross-Platform**: Native mobile app (iOS/Android) and responsive web app
- **User Authentication**: Sign up, sign in, password reset
- **User Profiles**: Profile management with avatar upload
- **Real-time Sync**: Changes sync across devices instantly
- **Offline Support**: Works offline with local storage
- **Dark/Light Mode**: Theme switching support
- **Responsive Design**: Optimized for all screen sizes

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Expo CLI (`npm install -g @expo/cli`)
- Supabase CLI (`npm install -g supabase`)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smartodo-ce
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**

   ```bash
   # Start Supabase locally
   supabase start

   # Apply database migrations
   supabase db push
   ```

4. **Configure environment variables**
   ```bash
   # Copy example env files and configure
   cp apps/mobile/smarTODO/.env.example apps/mobile/smarTODO/.env
   cp apps/web/smartodo/.env.example apps/web/smartodo/.env
   ```

### Development

Start all applications in parallel:

```bash
npm run dev
```

Or start individual applications:

**Mobile Development**

```bash
npm run dev:mobile
# Then scan QR code with Expo Go app
```

**Web Development**

```bash
npm run dev:web
# Open http://localhost:5173
```

**Supabase Dashboard**

```bash
npm run dev:supabase
# Open http://localhost:54323
```

## 📁 Project Structure

### Mobile App (`apps/mobile/smarTODO/`)

```
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Landing page
│   ├── login.tsx          # Authentication
│   └── home.tsx           # Main todo interface
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utilities and services
├── hooks/               # Custom React hooks
└── __tests__/           # Test files
```

### Web App (`apps/web/smartodo/`)

```
├── app/                  # React Router app
│   ├── root.tsx         # Root component
│   ├── routes.ts        # Route definitions
│   └── routes/          # Route components
├── public/              # Static assets
└── vite.config.ts       # Vite configuration
```

### Backend (`apps/supabase/`)

```
├── migrations/          # Database migrations
├── functions/          # Edge functions
├── types/             # Generated TypeScript types
└── config.toml        # Supabase configuration
```

## 🧪 Testing

### Run Tests

```bash
# All tests
npm test

# Mobile tests only
cd apps/mobile/smarTODO && npm test

# Watch mode
cd apps/mobile/smarTODO && npm run test:watch

# Coverage report
cd apps/mobile/smarTODO && npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Pure functions and utilities (90%+ coverage target)
- **Component Logic Tests**: Business logic without UI rendering (50%+ target)
- **Hook Tests**: Custom React hooks (85%+ target)
- **Integration Tests**: API and service interactions

See [Testing Guidelines](.ai-instructions/01-testing-guidelines.md) for detailed testing practices.

## 🏗️ Build & Deploy

### Mobile (React Native)

```bash
cd apps/mobile/smarTODO

# Development build
expo build:android
expo build:ios

# Production build with EAS
eas build --platform android
eas build --platform ios
```

### Web (React Router)

```bash
cd apps/web/smartodo

# Build for production
npm run build

# Start production server
npm start

# Docker deployment
docker build -t smartodo-web .
docker run -p 3000:3000 smartodo-web
```

## 🔧 Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feat/*`: Feature branches
- `fix/*`: Bug fix branches

### Commit Messages

Follow conventional commits:

```bash
feat(mobile): add todo creation functionality
fix(web): resolve authentication redirect issue
docs: update README with deployment instructions
```

### Code Quality

- **Linting**: ESLint with project-specific rules
- **Formatting**: Prettier with consistent configuration
- **Type Checking**: TypeScript strict mode
- **Pre-commit Hooks**: Automated formatting and linting

## 📊 Database Schema

### Core Tables

- `profiles`: User profile information
- `todos`: Todo items and metadata
- `categories`: Todo categories and labels
- `auth.users`: Supabase authentication (managed)

### Storage Buckets

- `avatars`: User profile pictures
- `attachments`: Todo file attachments

See database migrations in `apps/supabase/migrations/` for detailed schema.

## 🤖 AI Assistant Guidelines

This project includes comprehensive AI assistant instructions in the `.ai-instructions/` directory:

- **Testing Guidelines**: Testing strategy and patterns
- **Database Guidelines**: Migration and SQL best practices
- **Code Style**: Project conventions and patterns

Compatible with Claude Code, Cursor, Windsurf, and other AI coding assistants.

## 📝 Available Scripts

### Root Level (Lerna)

- `npm run dev` - Start all applications
- `npm run build` - Build all applications
- `npm test` - Run all tests
- `npm run release` - Create version release

### Mobile App

- `npm run dev` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run Jest tests
- `npm run lint` - Run ESLint

### Web App

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript checks

## 🔐 Environment Variables

### Required Variables

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional Configuration
EXPO_PUBLIC_APP_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes following the project conventions
4. Run tests (`npm test`)
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feat/amazing-feature`)
7. Open a Pull Request

### Code Style

- Follow existing TypeScript and React patterns
- Use Tamagui components for mobile UI
- Use Tailwind CSS for web styling
- Follow the testing guidelines in `.ai-instructions/`
- Ensure all tests pass and coverage targets are met

### 🤖 AI-Assisted Development (Vibe Coding Friendly)

This project is **vibe coder friendly**! We fully support AI-assisted development with tools like Claude Code, Cursor, Windsurf, and other AI coding assistants, but please vibe responsibly:

- ✅ Use AI assistants to accelerate development
- ✅ Leverage the `.ai-instructions/` directory for consistent AI guidance
- ✅ Let AI help with boilerplate and repetitive tasks
- ⚠️ Always review AI-generated code before committing
- ⚠️ Ensure AI follows project patterns (check `.ai-instructions/`)
- ⚠️ Run tests on all AI-generated code (`npm test`)
- ⚠️ Verify security implications of generated code
- 🚫 Don't blindly accept AI suggestions without understanding them
- 🚫 Don't let AI bypass code review processes
- 🚫 Don't share sensitive credentials with AI assistants

**Pro tip**: Our AI instruction files in `.ai-instructions/` are specifically designed to help AI assistants understand our codebase and follow our conventions. Use them!

**Remember**: AI is a powerful tool, but human oversight ensures quality, security, and maintainability. Vibe responsibly! 🚀

## 📄 License

ISC License - See LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `.ai-instructions/` directory
- **Issues**: Open a GitHub issue
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

- [ ] Todo CRUD operations
- [ ] Category management
- [ ] Real-time collaboration
- [ ] Push notifications
- [ ] Offline sync
- [ ] File attachments
- [ ] Team workspaces
- [ ] Advanced filtering and search
- [ ] Integration with calendar apps
- [ ] API for third-party integrations

---

**Built with ❤️ using modern web technologies**
