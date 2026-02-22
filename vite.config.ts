import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			sourceMapsUploadOptions: {
				org: 'awsoft',
				project: 'faviconizer'
			}
		}),
		tailwindcss(),
		sveltekit()
	],
	optimizeDeps: {
		include: ['cropperjs']
	}
});
