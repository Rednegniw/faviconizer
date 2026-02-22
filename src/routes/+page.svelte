<script lang="ts">
	import DropZone from '$lib/components/DropZone.svelte';
	import ImageCropper from '$lib/components/ImageCropper.svelte';
	import FaviconResult from '$lib/components/FaviconResult.svelte';
	import { toast } from 'svelte-sonner';
	import autoAnimate from '@formkit/auto-animate';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { faviconSize, faviconFormat } from '$lib/stores';
	import LoadingState from '$lib/components/LoadingState.svelte';

	const SQUARE_TOLERANCE = 0.1;

	let file: File | null = $state(null);
	let faviconUrl = $state('');
	let status = $state<'beforeupload' | 'cropping' | 'processing' | 'success' | 'error'>(
		'beforeupload'
	);

	const processImage = async (imageData: HTMLCanvasElement | HTMLImageElement) => {
		try {
			status = 'processing';

			const blob = await new Promise<Blob>((resolve) => {
				if (imageData instanceof HTMLCanvasElement) {
					imageData.toBlob((b) => resolve(b!), 'image/png');
				} else {
					const canvas = document.createElement('canvas');
					const size = $faviconSize;
					canvas.width = size;
					canvas.height = size;
					const ctx = canvas.getContext('2d')!;
					ctx.drawImage(imageData, 0, 0, size, size);
					canvas.toBlob((b) => resolve(b!), 'image/png');
				}
			});

			const formData = new FormData();
			formData.append('image', blob, 'image.png');
			formData.append('size', $faviconSize.toString());
			formData.append('format', $faviconFormat);

			const response = await fetch('/api/process-favicon', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error);
			}

			faviconUrl = result.faviconUrl;
			status = 'success';
		} catch (e) {
			status = 'error';
			toast.error('An error occurred. Please try again.');
		}
	};

	const handleFileUpload = async (uploadedFile: File) => {
		if (!uploadedFile.type.startsWith('image/')) {
			toast.error('Please upload an image file');
			return;
		}

		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(img.src);

			const aspectRatio = img.height / img.width;
			const isRoughlySquare =
				aspectRatio >= 1 - SQUARE_TOLERANCE && aspectRatio <= 1 + SQUARE_TOLERANCE;

			if (isRoughlySquare) {
				processImage(img);
			} else {
				file = uploadedFile;
				status = 'cropping';
			}
		};

		img.src = URL.createObjectURL(uploadedFile);
	};

	const handleReset = () => {
		file = null;
		faviconUrl = '';
		status = 'beforeupload';
	};
</script>

<svelte:head>
	<title>Faviconizer - Convert your image to a favicon</title>
</svelte:head>

<main
	class="bg-background flex min-h-screen flex-col items-center justify-center p-4"
	use:autoAnimate
>
	{#if status === 'beforeupload'}
		<DropZone onFileSelected={handleFileUpload} />
	{:else if status === 'cropping'}
		<ImageCropper onCancel={handleReset} onProcess={processImage} {file} />
	{:else if status === 'processing'}
		<LoadingState {file} />
	{:else if status === 'success'}
		<FaviconResult {faviconUrl} onReset={handleReset} />
	{/if}
	<ThemeToggle />
</main>
