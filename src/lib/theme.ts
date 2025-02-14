import { writable } from 'svelte/store';

type Theme = 'dark' | 'light';

function createThemeStore() {
    // Initialize with the current theme from document class
    const initialTheme: Theme = typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const { subscribe, set } = writable<Theme>(initialTheme);

    return {
        subscribe,
        toggle: () => {
            if (typeof window !== 'undefined') {
                const d = document.documentElement;
                const currentTheme = d.classList.contains('dark') ? 'dark' : 'light';
                const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
                
                d.classList.remove('light', 'dark');
                d.classList.add(newTheme);
                set(newTheme);
                
                document.cookie = `theme=${newTheme};path=/;max-age=31536000`; // 1 year
            }
        },
        set: (theme: Theme) => {
            set(theme);
            if (typeof window !== 'undefined') {
                const d = document.documentElement;
                d.classList.remove('light', 'dark');
                d.classList.add(theme);
                document.cookie = `theme=${theme};path=/;max-age=31536000`; // 1 year
            }
        },
        initialize: () => {
            // We don't need to do the initial setup anymore since it's handled in app.html
            // Just sync the store with the current theme
            if (typeof window !== 'undefined') {
                const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                set(currentTheme);
            }
        }
    };
}

export const theme = createThemeStore(); 