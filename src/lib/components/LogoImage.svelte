<script lang="ts">
	import logo from '$lib/assets/logo-image.jpg';

	const { size = 100 } = $props();
</script>

<img
	src={logo}
	alt="Logo"
	class="aspect-square rounded-xl overflow-hidden object-cover shadow-md"
	width={size}
	height={size}
/>
