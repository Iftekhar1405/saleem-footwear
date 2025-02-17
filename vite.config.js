import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      external: [
        "core-js/modules/es.promise.js",
        "core-js/modules/es.string.match.js" /* add other unresolved modules here */,
      ],
    },
  },
});
