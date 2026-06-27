import { defineConfig, env } from 'prisma/config'

// Prisma 7 no longer reads the connection URL from the schema's datasource block
// or auto-loads .env. Load it here (Node 22 built-in) and expose DATABASE_URL to
// the CLI (migrate/studio/generate).
process.loadEnvFile?.()

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
