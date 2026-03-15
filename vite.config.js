import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // 本地开发用 '/'，GitHub Actions 自动打包时用 '/tea_culture/'
  base: process.env.GITHUB_ACTIONS ? '/tea_culture/' : '/',
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ["echarts"],
          "element-plus": ["element-plus"],
        },
      },
    },
  },
});

