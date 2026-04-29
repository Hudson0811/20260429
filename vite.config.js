import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command }) => {
  return {
    // 如果是開發模式 (npm run dev)，路徑用 '/'
    // 如果是打包模式 (npm run build)，路徑用 './'
    base: command === 'serve' ? '/' : './',
    plugins: [
      vue(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})