# The AI Chat - Monorepo

## Apps

- @repo/nuxt - apps/nuxt
- @repo/server - apps/server

# Local development

Required: you need to register a free account with DeepL and get an API key

Then execute in the root folder these commands in order:

```shell
// To start Postgres, pgadmin and Mailhog
docker compose up -d

// install dependencies for all packages
pnpm install

// generate .env files
./packages/scripts/environment-config.ts --DEEPL_KEY=<your-deepl-key>

// Apply db migrations in the Nuxt app
pnpm --filter=@repo/nuxt migrate

// Start all apps at once in dev mode
pnpm dev
```
