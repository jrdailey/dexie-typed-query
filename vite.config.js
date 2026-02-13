import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
    },
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts'],
    },
  },
})
