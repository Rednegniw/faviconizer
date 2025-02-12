<script lang="ts">
    import { fly } from 'svelte/transition';
    import { supabase } from '$lib/supabase';
    import DropZone from '$lib/components/DropZone.svelte';
    import ErrorMessage from '$lib/components/ErrorMessage.svelte';
    import ImageCropper from '$lib/components/ImageCropper.svelte';
    import FaviconResult from '$lib/components/FaviconResult.svelte';

    let file: File | null = $state(null);
    let processing = $state(false);
    let faviconUrl = $state('');
    let error = $state('');

    const processImage = async (imageData: HTMLCanvasElement | HTMLImageElement) => {
        try {
            processing = true;
            error = '';

            // Convert to blob
            const blob = await new Promise<Blob>((resolve) => {
                if (imageData instanceof HTMLCanvasElement) {
                    imageData.toBlob((b) => resolve(b!), 'image/png');
                } else {
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(imageData, 0, 0, 64, 64);
                    canvas.toBlob((b) => resolve(b!), 'image/png');
                }
            });

            // Upload to Supabase
            const fileName = `original-${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
                .from('favicons')
                .upload(fileName, blob);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('favicons')
                .getPublicUrl(fileName);

            // Process the image
            const response = await fetch('/api/process-favicon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: publicUrl })
            });

            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            faviconUrl = result.faviconUrl;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An error occurred';
        } finally {
            processing = false;
        }
    };

    const handleFile = async (uploadedFile: File) => {
        if (!uploadedFile.type.startsWith('image/')) {
            error = 'Please upload an image file';
            return;
        }
        error = '';

        // Check if image is square
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            if (img.width === img.height) {
                // If square, process immediately
                processImage(img);
            } else {
                // If not square, show cropper
                file = uploadedFile;
            }
        };
        img.src = URL.createObjectURL(uploadedFile);
    };

    const handleProcess = async ({ detail: { canvas } }: CustomEvent<{ canvas: HTMLCanvasElement }>) => {
        await processImage(canvas);
    };

    const handleReset = () => {
        file = null;
        faviconUrl = '';
        error = '';
    };
</script>

<svelte:head>
    <title>Faviconizer - Create Beautiful Favicons</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
    <h1 class="text-4xl font-bold text-center mb-8" in:fly={{ y: -20, duration: 500 }}>
        Faviconizer
    </h1>

    <ErrorMessage message={error} />

    {#if !file && !processing && !faviconUrl}
        <DropZone onfileSelected={e => handleFile(e.detail)} />
    {:else if file && !faviconUrl}
        <ImageCropper {file} {processing} oncancel={handleReset} onprocess={handleProcess} />
    {:else}
        <FaviconResult {faviconUrl} onreset={handleReset} />
    {/if}
</main>
