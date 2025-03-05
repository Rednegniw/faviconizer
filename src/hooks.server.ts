import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { cleanupOldFavicons } from '$lib/cleanup';

/**
 * Sentry Configuration
 * -------------------
 * Initialize Sentry for error tracking and monitoring.
 * This captures errors and performance data in the application.
 */
Sentry.init({
	dsn: 'https://7b0b3f017038efbd4e8ffbf00e2b5610@o4508411853537280.ingest.us.sentry.io/4508925065363456',
	tracesSampleRate: 1
});

/**
 * Sentry Hooks
 * -----------
 * These hooks integrate Sentry with SvelteKit's hook system.
 * - handleError: Captures and reports errors to Sentry
 * - handle: Adds Sentry context to requests
 */
export const handleError = Sentry.handleErrorWithSentry();
export const handle = sequence(Sentry.sentryHandle());

/**
 * Favicon Cleanup Service
 * ----------------------
 * Periodically removes old favicons from storage to prevent
 * accumulation of unused files and reduce storage costs.
 */

// Run cleanup every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Start the cleanup interval
const cleanupInterval = setInterval(cleanupOldFavicons, CLEANUP_INTERVAL);

// Ensure the interval is cleared when the server shuts down
process.on('SIGTERM', () => {
	clearInterval(cleanupInterval);
	process.exit(0);
});
