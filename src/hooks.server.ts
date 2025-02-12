import { cleanupOldFavicons } from '$lib/cleanup';

// Run cleanup every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Start the cleanup interval
const cleanupInterval = setInterval(cleanupOldFavicons, CLEANUP_INTERVAL);

// Ensure the interval is cleared when the server shuts down
process.on('SIGTERM', () => {
    clearInterval(cleanupInterval);
    process.exit(0);
}); 