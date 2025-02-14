<script lang="ts">
    import DropZone from '$lib/components/DropZone.svelte';
    import ImageCropper from '$lib/components/ImageCropper.svelte';
    import FaviconResult from '$lib/components/FaviconResult.svelte';
	import { toast } from 'svelte-sonner';
    import autoAnimate from '@formkit/auto-animate';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import { faviconSize } from '$lib/stores';
	import LoadingState from '$lib/components/LoadingState.svelte';

    let file: File | null = $state(null);
    let faviconUrl = $state('');
    let status = $state<'beforeupload' | 'cropping' | 'processing' | 'success' | 'error'>('beforeupload');

    const processImage = async (imageData: HTMLCanvasElement | HTMLImageElement) => {
        console.log('🎯 Starting image processing', {
            type: imageData instanceof HTMLCanvasElement ? 'canvas' : 'image'
        });
        try {
            status = 'processing'
            
            // Convert to blob
            console.log('🔄 Converting to blob...');
            const blob = await new Promise<Blob>((resolve) => {
                if (imageData instanceof HTMLCanvasElement) {
                    console.log('🔄 Converting canvas to blob...');
                    imageData.toBlob((b) => resolve(b!), 'image/png');
                } else {
                    console.log('🔄 Converting image to blob...');
                    const canvas = document.createElement('canvas');
                    const size = $faviconSize;
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext('2d')!;
                    ctx.drawImage(imageData, 0, 0, size, size);
                    canvas.toBlob((b) => resolve(b!), 'image/png');
                }
            });

            console.log('✅ Blob created, size:', `${(blob.size / 1024).toFixed(2)}KB`);

            // Create form data
            console.log('📝 Creating FormData...');
            const formData = new FormData();
            formData.append('image', blob, 'image.png');
            formData.append('size', $faviconSize.toString());

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

            status = 'success';
        } catch (e) {
            console.error('❌ Error in processImage:', e);

            status = 'error';
            toast.error('An error occurred. Please try again.');
        }
    };

    const handleFileUpload = async (uploadedFile: File) => {
        console.log('📁 File received:', {
            type: uploadedFile.type,
            size: `${(uploadedFile.size / 1024).toFixed(2)}KB`
        });

        if (!uploadedFile.type.startsWith('image/')) {
            console.error('❌ Invalid file type:', uploadedFile.type);
            toast.error('Please upload an image file');
            return;
        }

        console.log('📐 Checking image dimensions...');
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            console.log('📏 Image dimensions:', { width: img.width, height: img.height });
            
            const aspectRatio = img.height / img.width;

            /**
             * Allow 10% deviation from square.
             * This is to account for some images being slightly non-square.
             */
            const isRoughlySquare = aspectRatio >= 0.9 && aspectRatio <= 1.1;
            
            if (isRoughlySquare) {
                console.log('✅ Image is roughly square (within 10% tolerance), processing immediately');
                processImage(img);
            } else {
                console.log('ℹ️ Image needs cropping, showing cropper');
                file = uploadedFile;
                status = 'cropping';
            }
        };

        img.src = URL.createObjectURL(uploadedFile);
    };

    const handleReset = () => {
        console.log('🔄 Resetting state');
        file = null;
        faviconUrl = '';
        status = 'beforeupload';
    };
</script>

<svelte:head>
    <title>Faviconizer - Convert your image to a favicon</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-center p-4 bg-background" use:autoAnimate>
    {#if status === 'beforeupload'}
        <DropZone onfileSelected={handleFileUpload} />
    {:else if status === 'cropping'}
        <ImageCropper onCancel={handleReset} onProcess={processImage} file={file} />
    {:else if status === 'processing'}
        <LoadingState file={file} />
    {:else if status === 'success'}
        <FaviconResult {faviconUrl} onReset={handleReset} />
    {/if}
    <ThemeToggle />
</main>
