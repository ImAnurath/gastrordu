import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Load .env (all keys, no prefix filter) so tests that hit the DB or external
    // services see the same vars as the app. Per-file `@vitest-environment node`
    // opts DB/PDF tests out of jsdom.
    env: loadEnv(mode, process.cwd(), ''),
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
}))
