<script lang="ts">
	import logo from '$lib/assets/logo-image.jpg';

	const { size = 100 } = $props();
</script>

<img
	src={logo}
	alt="Logo"
	class="aspect-square overflow-hidden rounded-xl object-cover shadow-md"
	width={size}
	height={size}
/>
