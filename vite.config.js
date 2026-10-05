import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the build work on GitHub Pages / Netlify / Vercel sub-paths
export default defineConfig({ plugins: [react()], base: './' })
