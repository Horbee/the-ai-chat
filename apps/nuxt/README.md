# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

'''
// Generate Nuxt Auth Secret
openssl rand -base64 32
'''

'''
// Generate prisma client
pnpm prisma generate

// Generate Prisma migration and apply it
pnpm prisma migrate dev --name init

// Create a draft migration - don't apply
pnpm prisma migrate dev --create-only

// after checking SQL file apply migarion
pnpm prisma migrate dev
'''
