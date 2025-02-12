<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { cn } from '$lib/utils';
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{
        fileSelected: File;
    }>();

    let dragActive = $state(false);

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            if (e.dataTransfer?.types.includes('Files')) {
                dragActive = true;
            }
        } else if (e.type === 'dragleave') {
            dragActive = false;
        }
    };

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragActive = false;

        if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
            dispatch('fileSelected', e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = async (e: Event) => {
        const input = e.target as HTMLInputElement;
        if (input.files?.[0]) {
            dispatch('fileSelected', input.files[0]);
        }
    };

    const handleClick = () => {
        document.getElementById('file-upload')?.click();
    };
</script>

<div 
    class={cn(
        "w-full max-w-2xl p-8 rounded-lg border-2 border-dashed transition-all duration-300",
        dragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5",
        "relative"
    )}
    role="button"
    tabindex="0"
    aria-label="Drop zone for image upload"
    ondragenter={handleDrag}
    ondragleave={handleDrag}
    ondragover={handleDrag}
    ondrop={handleDrop}
>
    <div class="text-center" in:fade>
        <div class="mb-4">
            <svg class={cn(
                "mx-auto h-12 w-12 transition-colors duration-200",
                dragActive ? "text-primary" : "text-muted-foreground"
            )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
            </svg>
        </div>
        <p class="text-lg mb-2 transition-opacity duration-200">
            {dragActive ? "Drop your image here to convert it to .ico" : "Drop your image here"}
        </p>
        <p class="text-sm text-muted-foreground mb-4">or click to select</p>
        <input
            type="file"
            accept="image/*"
            class="hidden"
            onchange={handleFileInput}
            id="file-upload"
        />
        <Button variant="outline" onclick={handleClick}>
            Select Image
        </Button>
    </div>
</div> 