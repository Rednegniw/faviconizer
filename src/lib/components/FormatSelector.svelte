<script lang="ts">
	import { faviconFormat } from '$lib/stores';
	import { Separator } from './ui/separator';
	import { cn } from '$lib/utils';
	import autoAnimate from '@formkit/auto-animate';

	const formats = [
		{ value: 'ico', label: 'ICO' },
		{ value: 'png', label: 'PNG' },
		{ value: 'jpg', label: 'JPG' }
	];

	let format = $derived($faviconFormat);

	const handleFormatChange = (newFormat: 'ico' | 'png' | 'jpg') => {
		faviconFormat.set(newFormat);
	};
</script>

<div class="flex flex-col items-center gap-2" use:autoAnimate>
	<div class="flex items-center gap-1 rounded-lg border bg-transparent p-2 text-center text-sm">
		{#each formats as formatOption, i (formatOption.value)}
			<button
				class={cn(
					'rounded-lg px-3 py-1 transition-colors',
					format === formatOption.value ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
				)}
				onclick={() => handleFormatChange(formatOption.value as 'ico' | 'png' | 'jpg')}
			>
				{formatOption.label}
			</button>
			{#if i < formats.length - 1}
				<Separator orientation="vertical" />
			{/if}
		{/each}
	</div>
</div>
