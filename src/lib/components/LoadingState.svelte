<script lang="ts">
	import Progress from './ui/progress/progress.svelte';
	import { onMount } from 'svelte';

	let progress = $state(0);
	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			// Random increment between 2 and 10
			const increment = Math.random() * 8 + 2;
			progress = Math.min(98, progress + increment);
		}, 200);

		return () => {
			clearInterval(interval);
		};
	});

	const { file } = $props<{ file: File | null }>();
</script>

<div class="flex flex-col items-center gap-10">
	{#if file}
		<img src={URL.createObjectURL(file)} alt="Loading" class="size-32 rounded-xl shadow-md" />
	{:else}
		<div class="bg-muted size-32 rounded-xl shadow-md"></div>
	{/if}
	<p class="text-muted-foreground text-sm">Processing...</p>
	<Progress class="h-2" value={progress} />
</div>
