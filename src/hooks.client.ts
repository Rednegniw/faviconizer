import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://7b0b3f017038efbd4e8ffbf00e2b5610@o4508411853537280.ingest.us.sentry.io/4508925065363456',

	// Always send errors
	tracesSampleRate: 1.0
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
