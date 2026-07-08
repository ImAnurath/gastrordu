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
    // Load .env (all keys, no prefix filter). Harmless for the static site;
    // kept so any future env-dependent test sees the same vars as the app.
    env: loadEnv(mode, process.cwd(), ''),
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
}))
