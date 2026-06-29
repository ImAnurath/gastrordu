import { defineConfig, env } from 'prisma/config'

// Prisma 7 no longer reads the connection URL from the schema's datasource block
// or auto-loads .env. Load it here (Node 22 built-in) and expose DATABASE_URL to
// the CLI (migrate/studio/generate). On Vercel/CI there is no .env file — env vars
// come from the platform — and process.loadEnvFile() THROWS ENOENT when .env is
// absent, so guard it (the ?. only handles old Node where the fn is undefined).
try {
  process.loadEnvFile?.()
} catch {
  // no .env file (Vercel/CI): DATABASE_URL is provided by the environment instead
}

type Env = {
  DATABASE_URL: string
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
})
