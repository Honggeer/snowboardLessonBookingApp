/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- 核心配置在这里，扫描src下所有相关文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}