<script lang="ts">
    import { fade } from 'svelte/transition';

    let { message = '' } = $props<{ message: string }>();
</script>

{#if message}
    <div class="text-destructive text-center mb-4" in:fade>
        {message}
    </div>
{/if} 