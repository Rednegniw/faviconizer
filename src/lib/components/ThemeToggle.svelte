<script lang="ts">
    import { Sun, Moon } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';
    import { theme } from '$lib/theme';
    import { cn } from '$lib/utils';

    let className = '';
    export { className as class };

    function handleClick() {
        theme.toggle();
    }
</script>

<div class="absolute top-4 right-4">
    <Button
        variant="ghost"
        size="icon"
        class={cn('h-9 w-9', className)}
        onclick={handleClick}
    >
        <Sun class="h-4 w-4 rotate-0 scale-100 transition-transform duration-200 dark:-rotate-90 dark:scale-0" />
        <Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-transform duration-200 dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
    </Button>
</div> 