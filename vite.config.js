import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Allows access from other devices
    port: 5173, // You can change this if needed
  },
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
