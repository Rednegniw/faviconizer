<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{
        reset: void;
    }>();

    let { faviconUrl } = $props<{
        faviconUrl: string;
    }>();

    const handleReset = () => {
        dispatch('reset');
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
</script>

<div class="text-center" in:fade>
    <img
        src={faviconUrl}
        alt="Generated favicon"
        class="w-16 h-16 mx-auto mb-4"
    />
    <p class="mb-4">Your favicon is ready!</p>
    <div class="flex justify-center gap-4">
        <Button onclick={handleReset}>
            Create Another
        </Button>
        <Button onclick={handleDownload}>
            Download Favicon
        </Button>
    </div>
</div> 