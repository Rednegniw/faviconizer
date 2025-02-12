<script lang="ts">
    import { fly } from 'svelte/transition';
    import DropZone from '$lib/components/DropZone.svelte';
    import ErrorMessage from '$lib/components/ErrorMessage.svelte';
    import ImageCropper from '$lib/components/ImageCropper.svelte';
    import FaviconResult from '$lib/components/FaviconResult.svelte';

    let file: File | null = $state(null);
    let processing = $state(false);
    let faviconUrl = $state('');
    let error = $state('');

    const processImage = async (imageData: HTMLCanvasElement | HTMLImageElement) => {
        console.log('🎯 Starting image processing', {
            type: imageData instanceof HTMLCanvasElement ? 'canvas' : 'image'
        });
        try {
            processing = true;
            error = '';
            // Clear file state immediately when processing starts
            file = null;

            // Convert to blob
            console.log('🔄 Converting to blob...');
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
            console.log('✅ Blob created, size:', `${(blob.size / 1024).toFixed(2)}KB`);

            // Create form data
            console.log('📝 Creating FormData...');
            const formData = new FormData();
            formData.append('image', blob, 'image.png');

            // Send to server for processing
            console.log('📤 Sending to server...');
            const response = await fetch('/api/process-favicon', {
                method: 'POST',
                body: formData
            });

            console.log('📥 Received server response:', response.status);
            const result = await response.json();
            
            if (!result.success) {
                console.error('❌ Server processing failed:', result.error);
                throw new Error(result.error);
            }

            console.log('✅ Processing complete, favicon URL:', result.faviconUrl);
            faviconUrl = result.faviconUrl;
        } catch (e) {
            console.error('❌ Error in processImage:', e);
            error = e instanceof Error ? e.message : 'An error occurred';
        } finally {
            processing = false;
        }
    };

    const handleFile = async (uploadedFile: File) => {
        console.log('📁 File received:', {
            type: uploadedFile.type,
            size: `${(uploadedFile.size / 1024).toFixed(2)}KB`
        });

        if (!uploadedFile.type.startsWith('image/')) {
            console.error('❌ Invalid file type:', uploadedFile.type);
            error = 'Please upload an image file';
            return;
        }
        error = '';

        // Check if image is square
        console.log('📐 Checking image dimensions...');
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            console.log('📏 Image dimensions:', { width: img.width, height: img.height });
            
            if (img.width === img.height) {
                console.log('✅ Image is square, processing immediately');
                processImage(img);
            } else {
                console.log('ℹ️ Image needs cropping, showing cropper');
                file = uploadedFile;
            }
        };
        img.src = URL.createObjectURL(uploadedFile);
    };

    const handleProcess = async ({ detail: { canvas } }: CustomEvent<{ canvas: HTMLCanvasElement }>) => {
        console.log('🖼️ Processing cropped image');
        await processImage(canvas);
    };

    const handleReset = () => {
        console.log('🔄 Resetting state');
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
        <DropZone on:fileSelected={(e) => {
            console.log('📁 File selected');
            handleFile(e.detail);
        }} />
    {:else if file && !faviconUrl}
        <ImageCropper {file} {processing} on:cancel={handleReset} on:process={handleProcess} />
    {:else}
        <FaviconResult {faviconUrl} on:reset={handleReset} />
    {/if}
</main>
