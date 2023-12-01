# The AI Chat - Monorepo

## Apps

- @repo/nuxt - apps/nuxt
- @repo/server - apps/server

# Local development

Execute in the root folder these commands in order:

```shell
// To start Postgres, pgadmin and Mailhog
docker compose up -d

// install dependencies for all packages
pnpm install


// Apply db migrations in the Nuxt app
pnpm --filter=@repo/nuxt migrate

// Start all apps at once in dev mode
pnpm dev
```
