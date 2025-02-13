import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), enhancedImages()],
	esbuild: {
		drop: process.env.NODE_ENV === 'production' ? ['console'] : undefined
	},
	optimizeDeps: {
		include: ['cropperjs']
	}
});
