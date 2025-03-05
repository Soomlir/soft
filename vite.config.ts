import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '',
  plugins: [vue()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: ' @use "@/scss/env" as *;'
			},
		}
	},
});
