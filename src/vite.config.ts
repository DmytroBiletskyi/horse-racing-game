import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

const resolve = (dir: string) => fileURLToPath(new URL(dir, import.meta.url));

export default defineConfig({
	plugins: [vue()],
	root: './src',
	resolve: {
		alias: {
			'@': resolve('./')
		}
	},
	build: {
		outDir: '../dist',
		emptyOutDir: true
	}
});
