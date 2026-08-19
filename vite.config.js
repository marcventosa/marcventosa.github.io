import { defineConfig } from 'vite'
import adminPlugin from './scripts/admin-plugin.mjs'

export default defineConfig({
  plugins: [adminPlugin()],
  server: {
    hmr: true,
  }
})
