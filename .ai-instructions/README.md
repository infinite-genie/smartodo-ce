# AI Assistant Instructions for smarTODO

This directory contains modular instruction files for AI coding assistants (Claude Code, Cursor, Windsurf, etc.) working on the smarTODO project.

## 📁 Structure

Each file contains specific guidelines for different aspects of the project:

| File                                                       | Description                                              | When to Use                                               |
| ---------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| [`01-testing-guidelines.md`](./01-testing-guidelines.md)   | Testing strategy and patterns for React Native + Tamagui | Writing tests, setting up mocks, coverage expectations    |
| [`02-database-migrations.md`](./02-database-migrations.md) | Creating Supabase database migrations                    | Creating new tables, modifying schema, writing migrations |
| [`03-postgres-sql-style.md`](./03-postgres-sql-style.md)   | SQL style guide and conventions                          | Writing any SQL queries or statements                     |
| [`04-database-functions.md`](./04-database-functions.md)   | PostgreSQL function best practices                       | Creating database functions, triggers                     |
| [`05-rls-policies.md`](./05-rls-policies.md)               | Row Level Security (RLS) policies                        | Implementing security policies, access control            |
| [`06-declarative-schema.md`](./06-declarative-schema.md)   | Declarative schema management                            | Managing database schema with Supabase CLI                |
| [`07-edge-functions.md`](./07-edge-functions.md)           | Supabase Edge Functions with Deno                        | Writing serverless functions, API endpoints               |

## 🚀 Usage

### For Claude Code

Add the entire directory to your project and Claude Code will automatically reference these guidelines. The main `CLAUDE.md` file in the project root references this structure.

### For Cursor

1. Add specific instruction files to your `.cursorrules` file
2. Or reference them in your cursor settings
3. Example `.cursorrules`:

```
# Include testing guidelines
cat .ai-instructions/01-testing-guidelines.md

# Include database guidelines
cat .ai-instructions/02-database-migrations.md
```

### For Windsurf

1. Add instruction files to your Windsurf rules configuration
2. Reference specific files based on your current task
3. Configure in `.windsurfrules` or project settings

### For Other AI Assistants

1. Copy relevant instruction content to your AI assistant's configuration
2. Reference files as context when asking questions
3. Include in system prompts or project-specific instructions

## 📋 Quick Reference

### Testing a Component?

→ See [`01-testing-guidelines.md`](./01-testing-guidelines.md)

### Creating a Database Table?

→ See [`02-database-migrations.md`](./02-database-migrations.md) and [`03-postgres-sql-style.md`](./03-postgres-sql-style.md)

### Adding Security Policies?

→ See [`05-rls-policies.md`](./05-rls-policies.md)

### Writing an API Endpoint?

→ See [`07-edge-functions.md`](./07-edge-functions.md)

### Managing Schema Changes?

→ See [`06-declarative-schema.md`](./06-declarative-schema.md)

## 🔄 Updating Instructions

When adding new guidelines:

1. Create a new numbered file (e.g., `08-new-guideline.md`)
2. Update this README with the new file reference
3. Update the main `CLAUDE.md` file if needed

## 📝 Format Convention

Each instruction file follows this format:

```markdown
# [Topic] Guidelines

## Overview

Brief description of what these guidelines cover

## [Main Sections]

Detailed guidelines with examples

## Example Templates

Code examples and patterns
```

## 🎯 Goals

These instructions aim to:

- Ensure consistent code quality across the project
- Follow best practices for each technology
- Provide clear examples and patterns
- Support multiple AI coding assistants
- Make development faster and more reliable
