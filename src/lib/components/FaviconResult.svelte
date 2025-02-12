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
        <a href={faviconUrl} download="favicon.ico">
            <Button>
                Download Favicon
            </Button>
        </a>
    </div>
</div> 