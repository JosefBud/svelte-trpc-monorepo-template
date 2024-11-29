import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  // @ts-expect-error This works fine, just a strange mismatch of types that doesn't cause any issues
  plugins: [svelte()],
})
