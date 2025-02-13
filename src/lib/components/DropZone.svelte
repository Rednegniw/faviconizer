<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Download, FileUp } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import LogoImage from './LogoImage.svelte';

	const { onfileSelected } = $props<{
		onfileSelected: (file: File) => void;
	}>();

	let dragActive = $state(false);

	const handleDrag = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		console.log('handleDrag', e.type);

		if (e.type === 'dragenter' || e.type === 'dragover') {
			/**
			 * If the user is dragging a file and the file is an image,
			 * we want to show an overlay.
			 */
			if (e.dataTransfer?.types.includes('Files')) {
				dragActive = true;
			}
		}
		if (e.type === 'dragleave') {
			dragActive = false;
		}
	};

	const handleDragEnd = () => {
		dragActive = false;
	};

	const handleDrop = async (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		dragActive = false;

		if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
			onfileSelected(e.dataTransfer.files[0]);
		}
	};

	const handleFileSelectClick = () => {
		const input = document.getElementById('file-input');

		if (input) {
			input.click();
		}
	};

	const handleFileSelectChange = (e: Event) => {
		if (e.target && e.target instanceof HTMLInputElement && e.target.files && e.target.files[0]) {
			onfileSelected(e.target.files[0]);
		}
	};
</script>

<div
	class={cn("px-4 fixed left-0 top-0 flex h-screen w-screen flex-col items-center justify-center gap-6", "md:p-0")}
	ondragenter={handleDrag}
	ondragover={handleDrag}
	ondragleave={handleDrag}
	ondragend={handleDragEnd}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
	aria-label="Drop zone for image upload"
>
	<div
		class={cn(
			'fixed left-0 top-0 -z-10 flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-background opacity-0 transition-opacity duration-100',
			dragActive && 'z-10 opacity-100'
		)}
	>
		<LogoImage size={100} />

		<div class="flex items-center justify-center gap-2">
			<Download class="size-7" />
			<h1 class="text-2xl font-bold">Drop your image anywhere</h1>
		</div>

		<div class="space-y-4 text-center">
			<p>If it's roughly square, it will be converted to a favicon automatically.</p>
			<p>Otherwise, you will be able to crop it to a square.</p>
		</div>
	</div>

	<LogoImage size={100} />

	<h1 class="text-3xl font-bold">Faviconizer</h1>

	<div class="space-y-4 text-center">
		<p>Drag your image anywhere to convert it to a favicon.</p>
	</div>

	<input
		type="file"
		accept="image/*"
		class="hidden"
		id="file-input"
		onchange={handleFileSelectChange}
		tabindex="-1"
	/>

	<Button onclick={handleFileSelectClick} variant="outline">
		<FileUp class="h-4 w-4" />
		<span>...or select an image from your computer.</span>
	</Button>
</div>
