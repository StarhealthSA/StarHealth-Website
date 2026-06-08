import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from "vite-plugin-html";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    createHtmlPlugin({
      inject: {
        data: {
          title: "Star-Health",
          description: "Discover Jetarah, a global leader in aviation consultancy. Specializing in aircraft sales, acquisition, leasing, and asset management, we deliver expert solutions tailored to your needs",
          keywords: "Star Health is here to do more than just treat. We listen, guide, and walk with you. Experience compassionate and expert care that's truly patient-first.",
          ogTitle: "Star-Health",
          ogDescription: "Star Health is here to do more than just treat. We listen, guide, and walk with you. Experience compassionate and expert care that's truly patient-first.",
          ogImage: "https://starhealth.sa/socialimage.png",
          ogUrl: "https://starhealth.sa/",
          twitterCard: "summary_large_image",
        },
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})