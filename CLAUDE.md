# Claude Code Instructions for smarTODO

## 📋 Overview

This file serves as the main entry point for AI assistant instructions. For detailed guidelines on specific topics, see the modular instruction files in the `.ai-instructions/` directory.

## 🚀 Quick Access to Guidelines

| Topic                   | File                                                                                       | When to Use                         |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| **Testing**             | [`.ai-instructions/01-testing-guidelines.md`](.ai-instructions/01-testing-guidelines.md)   | Writing tests, mocks, coverage      |
| **Database Migrations** | [`.ai-instructions/02-database-migrations.md`](.ai-instructions/02-database-migrations.md) | Creating tables, schema changes     |
| **SQL Style**           | [`.ai-instructions/03-postgres-sql-style.md`](.ai-instructions/03-postgres-sql-style.md)   | Writing SQL queries                 |
| **Database Functions**  | [`.ai-instructions/04-database-functions.md`](.ai-instructions/04-database-functions.md)   | Creating functions, triggers        |
| **RLS Policies**        | [`.ai-instructions/05-rls-policies.md`](.ai-instructions/05-rls-policies.md)               | Security policies, access control   |
| **Declarative Schema**  | [`.ai-instructions/06-declarative-schema.md`](.ai-instructions/06-declarative-schema.md)   | Schema management with CLI          |
| **Edge Functions**      | [`.ai-instructions/07-edge-functions.md`](.ai-instructions/07-edge-functions.md)           | Serverless functions, API endpoints |

## 🎯 Important Reminders

### ⚠️ CRITICAL DATABASE SAFETY WARNING

**NEVER EVER run database reset commands under ANY circumstances!**

**FORBIDDEN COMMANDS - DO NOT RUN IN ANY FORM:**

- `supabase db reset`
- `npx supabase db reset`
- `npm run supabase db reset`
- `yarn supabase db reset`
- `pnpm supabase db reset`
- Any variation or alias that includes "db reset"

**WHY THIS IS CRITICAL:**

- These commands are EXTREMELY DANGEROUS and will DELETE ALL DATA
- They completely destroy the entire database including all user data
- There is NO undo or recovery from this operation
- Data loss is PERMANENT and IRREVERSIBLE

**SAFE ALTERNATIVES TO USE INSTEAD:**

- `npx supabase migration up` - Apply new migrations safely
- `npx supabase db push` - Sync schema changes without data loss
- `npx supabase migration repair` - Fix migration issues
- `npx supabase migration list` - Check migration status
- `npx supabase db diff` - Compare schema differences

**IMPORTANT:** If database issues arise, ALWAYS consult with the user before taking ANY action that might affect data. Never attempt to "fix" database problems by resetting.

### Project Behavior

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User

### Code Quality

- Follow the existing code conventions in each file
- Use existing libraries and utilities already in the project
- Follow existing patterns and project structure
- Always check security best practices
- Never introduce code that exposes or logs secrets and keys

### Testing Requirements

- VERY IMPORTANT: After completing implementation tasks, run lint and typecheck commands:
  - `npm run lint`
  - `npm run typecheck`
  - Or equivalent commands for the project
- Never assume specific test frameworks - check the project to determine the testing approach
- Follow the hybrid testing strategy outlined in the testing guidelines

### Git and Commits

- NEVER commit changes unless explicitly asked by the user
- When creating commits, follow conventional commit format
- Include the Claude Code signature in commit messages

## 📁 Detailed Guidelines

For comprehensive guidelines on specific topics, refer to the individual instruction files in the `.ai-instructions/` directory. Each file contains:

- **Overview** of the topic
- **Best practices** and conventions
- **Code examples** and templates
- **Common patterns** to follow
- **Things to avoid**

## 🔄 Usage with Other AI Assistants

These instruction files are designed to work with:

- **Claude Code** (automatically referenced)
- **Cursor** (add to `.cursorrules`)
- **Windsurf** (add to `.windsurfrules`)
- **Other AI assistants** (copy relevant sections)

See the [README in .ai-instructions/](.ai-instructions/README.md) for specific setup instructions.

---

_This modular structure allows for easier maintenance and enables use with different AI coding assistants while maintaining consistency across the project._
