# Supabase Edge Functions Guidelines

## Overview

You're an expert in writing TypeScript and Deno JavaScript runtime. Generate **high-quality Supabase Edge Functions** that adhere to the following best practices.

## Core Guidelines

1. **Use Web APIs and Deno's core APIs** instead of external dependencies (e.g., use `fetch` instead of Axios, use WebSockets API instead of node-ws)

2. **Shared utilities** should be placed in `supabase/functions/_shared` and imported using relative paths. Do NOT have cross dependencies between Edge Functions

3. **No bare specifiers** when importing dependencies. External dependencies must be prefixed with either `npm:` or `jsr:`. For example:
   - ❌ `@supabase/supabase-js`
   - ✅ `npm:@supabase/supabase-js`

4. **Always define versions** for external imports:
   - ❌ `npm:express`
   - ✅ `npm:express@4.18.2`

5. **Preferred import sources:**
   - First choice: `npm:` and `jsr:`
   - Minimize use of: `deno.land/x`, `esm.sh`, `unpkg.com`
   - Replace CDN hostnames with `npm:` specifier when possible

6. **Node built-in APIs** are available using the `node:` specifier:

   ```typescript
   import process from "node:process";
   ```

7. **Use built-in `Deno.serve`** instead of:
   ```typescript
   // ❌ Don't use this
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   // ✅ Use this instead
   Deno.serve(handler);
   ```

## Environment Variables

Pre-populated environment variables (no manual setup needed):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

For custom environment variables:

```bash
supabase secrets set --env-file path/to/env-file
```

## Routing and File Operations

- **Multiple routes** in a single Edge Function are recommended using Express or Hono
- Routes must be prefixed with `/function-name` for correct routing
- **File writes** are ONLY permitted in `/tmp` directory
- Use `EdgeRuntime.waitUntil(promise)` for long-running background tasks

## Example Templates

### Simple Hello World Function

```typescript
interface reqPayload {
  name: string;
}

console.info("server started");

Deno.serve(async (req: Request) => {
  const { name }: reqPayload = await req.json();
  const data = {
    message: `Hello ${name} from foo!`,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", Connection: "keep-alive" },
  });
});
```

### Function Using Node Built-in API

```typescript
import { randomBytes } from "node:crypto";
import { createServer } from "node:http";
import process from "node:process";

const generateRandomString = (length) => {
  const buffer = randomBytes(length);
  return buffer.toString("hex");
};

const randomString = generateRandomString(10);
console.log(randomString);

const server = createServer((req, res) => {
  const message = `Hello`;
  res.end(message);
});

server.listen(9999);
```

### Using npm Packages

```typescript
import express from "npm:express@4.18.2";

const app = express();

app.get(/(.*)/, (req, res) => {
  res.send("Welcome to Supabase");
});

app.listen(8000);
```

### Generate Embeddings Using Supabase AI

```typescript
const model = new Supabase.ai.Session("gte-small");

Deno.serve(async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const input = params.get("text");
  const output = await model.run(input, { mean_pool: true, normalize: true });
  return new Response(JSON.stringify(output), {
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  });
});
```
