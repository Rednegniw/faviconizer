<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { DownloadIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

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
            a.download = 'favicon.ico';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading favicon:', error);
        }
    };

    onMount(() => {
        handleDownload();
    });
</script>

<div class="text-center flex flex-col items-center space-y-8" in:fade>
    <img
        src={faviconUrl}
        alt="Generated favicon"
        class={cn("size-[64px] rounded-lg shadow-md cursor-pointer", "hover:scale-105 transition-transform duration-300 ease-in-out")}
        onclick={handleDownload}
    />
    <div class="flex flex-col items-center gap-2">
        <p class="text-lg font-semibold">Your favicon is ready!</p>
        <span class="text-sm text-muted-foreground">It should be downloaded automatically.</span>
    </div>
    <div class="space-y-4">
        <Button onclick={handleDownload} class="flex items-center gap-4 px-24" variant="outline">
            <DownloadIcon class="size-4 mr-2" />
            <span>Download</span>
        </Button>
        <Button onclick={handleReset} variant="ghost">
            ...or create another
        </Button>
        
    </div>
</div> 