<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';
	import SizeSelector from './SizeSelector.svelte';
	import FormatSelector from './FormatSelector.svelte';
</script>

<div class="flex flex-col items-center gap-4" use:autoAnimate>
	<div class="grid grid-cols-[0.4fr_0.7fr] items-center justify-between gap-4">
		<span class="text-muted-foreground mb-1 text-sm">Size:</span>
		<span class="place-self-end"><SizeSelector /></span>
		<span class="text-muted-foreground mb-1 text-sm">Format:</span>
		<span class="place-self-end"><FormatSelector /></span>
	</div>
</div>
