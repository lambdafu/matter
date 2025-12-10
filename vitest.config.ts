import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@/engine': path.resolve(__dirname, './src/engine'),
      '@/ui': path.resolve(__dirname, './src/ui'),
      '@/test': path.resolve(__dirname, './src/test'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
  },
})
