# smarTODO - AI-Assisted Smart Todo Application

## Project Overview

smarTODO is an open-source AI-assisted todo application built with modern web and mobile technologies. The application helps users manage tasks intelligently with AI-powered features.

## Tech Stack

- **Frontend Web**: Vite + React + TypeScript
- **Mobile**: React Native + TypeScript
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Database**: PostgreSQL 17
- **Documentation**: Docusaurus
- **Monorepo**: Lerna + npm workspaces

## Project Structure

```
smarTODO/
├── apps/
│   ├── web/              # Vite + React web application
│   └── mobile/           # React Native mobile application
├── packages/
│   ├── shared/           # Shared utilities, types, and business logic
│   └── ui/               # Shared UI components library
├── supabase/
│   ├── functions/        # Supabase Edge Functions
│   ├── migrations/       # Database schema migrations
│   ├── seed/             # Database seed data
│   └── config.example.toml # Example Supabase configuration
├── docs/                 # Documentation site (Docusaurus)
├── design-assets/        # Design assets (Git LFS managed)
│   ├── brand/            # Logos, branding guidelines
│   ├── icons/            # App and UI icons
│   ├── images/           # Screenshots, illustrations
│   └── mockups/          # Design mockups and wireframes
├── tools/                # Build tools and custom scripts
├── scripts/              # Automation scripts
└── .github/              # GitHub workflows and templates
```

## Key Commands

```bash
# Install dependencies
npm install

# Start all development servers
npm run dev

# Build all packages
npm run build

# Run linting across all packages
npm run lint

# Run tests across all packages
npm run test

# Start documentation server
npm run docs:dev

# Supabase commands
npm run supabase:start    # Start local Supabase
npm run supabase:stop     # Stop local Supabase
npm run supabase:reset    # Reset database
```

## Development Setup

1. **Prerequisites**: Node.js 18+, npm 9+, Supabase CLI, Git LFS
2. **Configuration**: Copy `supabase/config.example.toml` to `supabase/config.toml`
3. **Environment**: Set up local environment variables
4. **Database**: PostgreSQL 17 (configured in Supabase)

## Architecture Notes

- **Monorepo**: Managed with Lerna for efficient development
- **Shared Code**: Common utilities and components in packages/
- **Type Safety**: Full TypeScript coverage across web and mobile
- **Database**: Supabase with PostgreSQL 17 for modern SQL features
- **Assets**: Git LFS for efficient design asset management
- **Documentation**: Comprehensive docs with API references

## Contributing

This is an open-source project. All contributions should follow the established patterns and maintain type safety across the codebase.