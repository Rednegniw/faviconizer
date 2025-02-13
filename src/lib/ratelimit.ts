import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private';

if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('Missing Upstash Redis environment variables');
}

// Initialize Redis client
const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN
});

// Create a new ratelimiter that allows 100 requests per hour
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 h'),
    analytics: true,
    prefix: '@faviconizer/ratelimit'
});

export const checkRateLimit = async (identifier: string) => {
    console.log('🔍 Checking rate limit for', identifier);
    const { success } = await ratelimit.limit(identifier);
    return success;
}; 