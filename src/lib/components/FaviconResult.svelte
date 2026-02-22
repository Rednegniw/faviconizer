<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { DownloadIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { faviconFormat } from '$lib/stores';
	import { toast } from 'svelte-sonner';

	let { faviconUrl, onReset } = $props<{
		faviconUrl: string;
		onReset: () => void;
	}>();

	const handleReset = () => {
		onReset();
	};

	const handleDownload = async () => {
		try {
			const response = await fetch(faviconUrl);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;

			const format = $faviconFormat;
			a.download = `favicon.${format}`;

			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch {
			toast.error('Failed to download favicon. Click the button to try again.');
		}
	};

	onMount(() => {
		handleDownload();
	});
</script>

<div class="flex flex-col items-center space-y-8 text-center" in:fade>
	<button type="button" onclick={handleDownload} class="cursor-pointer">
		<img
			src={faviconUrl}
			alt="Generated favicon"
			class={cn(
				'size-[64px] rounded-lg shadow-md',
				'transition-transform duration-300 ease-in-out hover:scale-105'
			)}
		/>
	</button>
	<div class="flex flex-col items-center gap-2">
		<p class="text-lg font-semibold">Your favicon is ready!</p>
		<span class="text-muted-foreground text-sm">It should be downloaded automatically.</span>
	</div>
	<div class="space-y-4">
		<Button onclick={handleDownload} class="flex items-center gap-4 px-24" variant="outline">
			<DownloadIcon class="mr-2 size-4" />
			<span>Download</span>
		</Button>
		<Button onclick={handleReset} variant="ghost">...or create another</Button>
	</div>
</div>
