<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { fade } from 'svelte/transition';
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.css';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{
        cancel: void;
        process: { canvas: HTMLCanvasElement };
    }>();

    let { file, processing = false } = $props<{
        file: File;
        processing?: boolean;
    }>();

    let cropper: Cropper | null = $state(null);
    let imageElement: HTMLImageElement;

    $effect(() => {
        if (imageElement && file) {
            cropper?.destroy();
            cropper = new Cropper(imageElement, {
                aspectRatio: 1,
                viewMode: 2,
                dragMode: 'move',
                background: false,
                autoCropArea: 1
            });
        }
    });

    const handleProcess = () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas({
            width: 64,
            height: 64
        });
        dispatch('process', { canvas });
    };
</script>

<div class="relative aspect-square max-w-md mx-auto" in:fade>
    <img
        bind:this={imageElement}
        src={URL.createObjectURL(file)}
        alt="Upload preview"
        class="max-w-full"
    />
    <div class="mt-4 flex justify-center gap-4">
        <Button 
            variant="outline" 
            onclick={() => {
                cropper?.destroy();
                dispatch('cancel');
            }}
        >
            Cancel
        </Button>
        <Button 
            onclick={handleProcess}
            disabled={processing}
        >
            {processing ? 'Processing...' : 'Create Favicon'}
        </Button>
    </div>
</div>

<style>
    :global(.cropper-view-box) {
        outline: none;
        border-radius: 8px;
    }
</style> 