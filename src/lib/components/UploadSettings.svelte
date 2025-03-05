<!-- A component for selecting upload settings (size and format) -->
<script lang="ts">
	import { Separator } from './ui/separator';
	import { cn } from '$lib/utils';
	import autoAnimate from '@formkit/auto-animate';
	import SizeSelector from './SizeSelector.svelte';
	import FormatSelector from './FormatSelector.svelte';
</script>

<div class="flex flex-col items-center gap-4" use:autoAnimate>
	<div class="grid grid-cols-[0.4fr_0.7fr] justify-between gap-4 items-center">
		<span class="text-sm text-muted-foreground mb-1">Size:</span>
		<span class="place-self-end"><SizeSelector /></span>
		<span class="text-sm text-muted-foreground mb-1">Format:</span>
		<span class="place-self-end"><FormatSelector /></span>
	</div>
</div> 