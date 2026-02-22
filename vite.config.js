import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // 为了让打包后的 index.html 直接双击可用，使用相对资源路径
  base: '/tea_culture/',
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

