<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { fade } from 'svelte/transition';
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.css';
    import { faviconSize } from '$lib/stores';

    const { onCancel, onProcess, file, processing = false } = $props<{
        file: File | null;
        processing?: boolean;
        onCancel: () => void;
        onProcess: (canvas: HTMLCanvasElement) => void;
    }>();

    let cropper: Cropper | null = $state(null);
    let imageElement: HTMLImageElement;

    $effect(() => {
        if (!cropper) {
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
        const size = $faviconSize;
        const canvas = cropper.getCroppedCanvas({
            width: size,
            height: size
        });
        onProcess(canvas);
    };
</script>

<div class="relative aspect-square max-w-md mx-auto" in:fade>
    <img
        bind:this={imageElement}
        src={file ? URL.createObjectURL(file) : ''}
        alt="Upload preview"
        class="max-w-full"
    />
    <div class="mt-4 flex justify-center gap-4">
        <Button 
            variant="outline" 
            onclick={() => {
                cropper?.destroy();
                onCancel();
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