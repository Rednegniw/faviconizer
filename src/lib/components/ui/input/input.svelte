<!-- A reusable input component that matches the UI style -->
<script lang="ts">
	import { cn } from '$lib/utils';

	let className = '';
	export { className as class };

	export let value: string | number = '';
	export let type = 'text';
	export let placeholder = '';
	export let min: string | number | undefined = undefined;
	export let max: string | number | undefined = undefined;
	export let step: string | number | undefined = undefined;
</script>

<input
	{type}
	bind:value
	{placeholder}
	{min}
	{max}
	{step}
	class={cn(
		'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
		'file:border-0 file:bg-transparent file:text-sm file:font-medium',
		'placeholder:text-muted-foreground',
		'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
		'disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
/> 