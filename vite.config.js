import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({

  plugins: [
    laravel({
      input: 'resources/react/src/main.jsx', // ✅ Correct entry point
      refresh: true,
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/react/src'), // ✅ Shorter import paths
    },
  },
  
  build: {
    manifest: 'manifest.json', // Ensures the manifest is created
    outDir: 'public/build', // Output files in `public/build`
    emptyOutDir: true, // Clears `public/build` before each build
    rollupOptions: {
      input: 'resources/react/src/main.jsx',
  },
   
},
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true, // Ensures it doesn't switch ports
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Ensure Laravel is running here
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
})
