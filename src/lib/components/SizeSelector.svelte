<!-- A component for selecting the favicon size -->
<script lang="ts">
	import { faviconSize } from '$lib/stores';
	import Separator from './ui/separator/separator.svelte';
	import { z } from 'zod';
	import { cn } from '$lib/utils';
	import autoAnimate from '@formkit/auto-animate';

	const sizeSchema = z
		.number({
			message: 'Size must be a number.'
		})
		.int('Size must be a whole number')
		.min(8, 'Size must be at least 8px')
		.max(128, 'Size must be at most 128px');

	let size = $derived($faviconSize);
	let error = $state<string | null>(null);
	let inputValue = $state(size.toString());

	$effect(() => console.log('size', size));

	const validate = (value: string) => {
		try {
			const parsed = sizeSchema.parse(Number(value));
			error = null;
			faviconSize.set(parsed);
		} catch (e) {
			if (e instanceof z.ZodError) {
				error = e.errors[0].message;
			}
		}
	};

	const handleInput = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		inputValue = value;
	};

	const handleBlur = () => {
		validate(inputValue);
	};

	const handleFocus = (e: Event) => {
		(e.target as HTMLInputElement).select();
	};
</script>

<div class="flex flex-col items-center gap-2" use:autoAnimate>
	<div
		class={cn(
			'flex items-center gap-4 rounded-full border bg-transparent p-2 px-4 text-center text-sm',
			error && 'border-destructive'
		)}
	>
		<input
			value={inputValue}
			oninput={handleInput}
			onblur={handleBlur}
			onfocus={handleFocus}
			class={cn('w-[3ch] bg-transparent p-0 text-center text-sm')}
		/>
		<Separator orientation="vertical" />
		<span class="text-sm text-muted-foreground">px</span>
	</div>
	{#if error}
		<p class="text-xs text-destructive">{error}</p>
	{/if}
</div>
