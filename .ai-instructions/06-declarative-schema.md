# Declarative Database Schema Guidelines

## Mandatory Instructions for Supabase Declarative Schema Management

## 1. Exclusive Use of Declarative Schema

- **All database schema modifications must be defined within `.sql` files located in the `supabase/schemas/` directory**
- **Do not** create or modify files directly in the `supabase/migrations/` directory unless the modification is about the known caveats below
- Migration files are to be generated automatically through the CLI

## 2. Schema Declaration

- For each database entity (e.g., tables, views, functions), create or update a corresponding `.sql` file in the `supabase/schemas/` directory
- Ensure that each `.sql` file accurately represents the desired final state of the entity

## 3. Migration Generation

Before generating migrations, **stop the local Supabase development environment**:

```bash
supabase stop
```

Generate migration files by diffing the declared schema against the current database state:

```bash
supabase db diff -f <migration_name>
```

Replace `<migration_name>` with a descriptive name for the migration.

## 4. Schema File Organization

- Schema files are executed in lexicographic order. To manage dependencies (e.g., foreign keys), name files to ensure correct execution order
- When adding new columns, append them to the end of the table definition to prevent unnecessary diffs

## 5. Rollback Procedures

To revert changes:

1. Manually update the relevant `.sql` files in `supabase/schemas/` to reflect the desired state
2. Generate a new migration file capturing the rollback:
   ```bash
   supabase db diff -f <rollback_migration_name>
   ```
3. Review the generated migration file carefully to avoid unintentional data loss

## 6. Known Caveats

The migra diff tool used for generating schema diff is capable of tracking most database changes. However, there are edge cases where it can fail.

If you need to use any of the entities below, remember to add them through versioned migrations instead.

### Data Manipulation Language

- DML statements such as insert, update, delete, etc., are not captured by schema diff

### View Ownership

- View owner and grants
- Security invoker on views
- Materialized views
- Doesn't recreate views when altering column type

### RLS Policies

- Alter policy statements
- Column privileges

### Other Entities

- Schema privileges are not tracked because each schema is diffed separately
- Comments are not tracked
- Partitions are not tracked
- `alter publication ... add table ...`
- `create domain` statements are ignored
- Grant statements are duplicated from default privileges

**Non-compliance with these instructions may lead to inconsistent database states and is strictly prohibited.**
