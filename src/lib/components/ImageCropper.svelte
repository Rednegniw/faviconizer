<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { fade } from 'svelte/transition';
	import type Cropper from 'cropperjs';
	import { faviconSize } from '$lib/stores';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';

	const {
		onCancel,
		onProcess,
		file,
		processing = false
	} = $props<{
		file: File | null;
		processing?: boolean;
		onCancel: () => void;
		onProcess: (canvas: HTMLCanvasElement) => void;
	}>();

	let cropper: Cropper | null = $state(null);
	let imageElement: HTMLImageElement;
	let previewUrl = $state<string | null>(null);

	$effect(() => {
		if (file) {
			previewUrl = URL.createObjectURL(file);
		}
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});

	$effect(() => {
		if (!cropper && imageElement) {
			import('cropperjs')
				.then(({ default: CropperClass }) => {
					cropper = new CropperClass(imageElement);

					const selection = cropper.getCropperSelection();

					if (selection) {
						selection.aspectRatio = 1;
						selection.initialCoverage = 1;
					}

					const canvas = cropper.getCropperCanvas();

					if (canvas) {
						canvas.background = false;
					}
				})
				.catch(() => {
					toast.error('Failed to load the image cropper. Please refresh and try again.');
				});
		}
	});

	const handleProcess = async () => {
		if (!cropper) return;
		const size = $faviconSize;
		const selection = cropper.getCropperSelection();
		if (!selection) return;
		const canvas = await selection.$toCanvas({
			width: size,
			height: size
		});
		onProcess(canvas);
	};
</script>

<div class={cn('relative mx-auto aspect-square max-w-full', 'md:max-w-md')} in:fade>
	<img bind:this={imageElement} src={previewUrl ?? ''} alt="Upload preview" class="max-w-full" />
	<div class="mt-8 flex justify-center gap-4">
		<Button
			variant="outline"
			onclick={() => {
				cropper?.destroy();
				onCancel();
			}}
		>
			Cancel
		</Button>
		<Button onclick={handleProcess} disabled={processing}>
			{processing ? 'Processing...' : 'Create Favicon'}
		</Button>
	</div>
</div>
