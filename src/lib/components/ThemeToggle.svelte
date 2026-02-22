<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { theme } from '$lib/theme';
	import { cn } from '$lib/utils';

	let { class: className = '' }: { class?: string } = $props();

	function handleClick() {
		theme.toggle();
	}
</script>

<div class="absolute top-4 right-4">
	<Button variant="ghost" size="icon" class={cn('h-9 w-9', className)} onclick={handleClick}>
		<Sun
			class="absolute size-4 scale-100 rotate-0 transition-transform duration-200 dark:scale-0 dark:-rotate-90"
		/>
		<Moon
			class="absolute size-4 scale-0 rotate-90 transition-transform duration-200 dark:scale-100 dark:rotate-0"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
