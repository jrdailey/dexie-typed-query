import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
      perfFile: true,
      reporter: ['text', 'json', 'html', 'json-summary'],
    },
    typecheck: {
      enabled: true,
      include: ['**/*.test-d.ts'],
    },
  },
})
