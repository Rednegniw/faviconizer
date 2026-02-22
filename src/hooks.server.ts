import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { cleanupOldFavicons, CLEANUP_RUN_INTERVAL } from '$lib/cleanup';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';

Sentry.init({
	dsn: PUBLIC_SENTRY_DSN,
	tracesSampleRate: 1
});

export const handleError = Sentry.handleErrorWithSentry();
export const handle = sequence(Sentry.sentryHandle());

const cleanupInterval = setInterval(cleanupOldFavicons, CLEANUP_RUN_INTERVAL);

process.on('SIGTERM', () => {
	clearInterval(cleanupInterval);
	process.exit(0);
});
