import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 【新增】代理配置
    proxy: {
      // 当请求路径以 /api 开头时，启用代理
      '/api': {
        // 后端服务器的地址
        target: 'http://localhost:8080',
        // 需要改变源，解决跨域问题
        changeOrigin: true,
      }
    }
  }
})
