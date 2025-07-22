# smarTODO

An AI-assisted smart todo application built with React, React Native, and Supabase.

## Project Structure

```
smarTODO/
├── apps/
│   ├── web/          # Vite + React web application
│   └── mobile/       # React Native mobile application
├── packages/
│   ├── shared/       # Shared utilities and types
│   └── ui/           # Shared UI components
├── supabase/
│   ├── functions/    # Edge functions
│   ├── migrations/   # Database migrations
│   ├── seed/         # Database seed data
│   └── config.example.toml
├── docs/             # Documentation (Docusaurus)
├── design-assets/    # Design assets (managed with Git LFS)
│   ├── brand/
│   ├── icons/
│   ├── images/
│   └── mockups/
└── tools/            # Build tools and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase CLI
- Git LFS (for design assets)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd smarTODO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   ```bash
   cp supabase/config.example.toml supabase/config.toml
   # Edit config.toml with your settings
   npm run supabase:start
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run tests
- `npm run docs:dev` - Start documentation server
- `npm run supabase:start` - Start Supabase services
- `npm run supabase:stop` - Stop Supabase services

## Contributing

Please read our contributing guidelines and code of conduct before submitting pull requests.

## License

MIT License - see LICENSE file for details.