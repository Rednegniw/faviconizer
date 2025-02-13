<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { theme } from '$lib/theme';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import posthog from 'posthog-js';
	import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

	let { children } = $props();

	onMount(() => {
		theme.initialize();

		if (browser) {
			posthog.init(PUBLIC_POSTHOG_KEY, {
				api_host: PUBLIC_POSTHOG_HOST,
				person_profiles: 'identified_only',
				capture_pageview: true,
				capture_pageleave: true
			});
		}
	});
</script>

{@render children()}
<Toaster />
