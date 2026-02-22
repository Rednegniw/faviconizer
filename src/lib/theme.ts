import { writable } from 'svelte/store';

type Theme = 'dark' | 'light';

function createThemeStore() {
	const initialTheme: Theme =
		typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
			? 'dark'
			: 'light';
	const { subscribe, set } = writable<Theme>(initialTheme);

	return {
		subscribe,
		toggle: () => {
			if (typeof window !== 'undefined') {
				const root = document.documentElement;
				const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
				const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';

				root.classList.remove('light', 'dark');
				root.classList.add(newTheme);
				set(newTheme);

				document.cookie = `theme=${newTheme};path=/;max-age=31536000`; // 1 year
			}
		},
		set: (theme: Theme) => {
			set(theme);
			if (typeof window !== 'undefined') {
				const root = document.documentElement;
				root.classList.remove('light', 'dark');
				root.classList.add(theme);
				document.cookie = `theme=${theme};path=/;max-age=31536000`; // 1 year
			}
		},
		initialize: () => {
			if (typeof window !== 'undefined') {
				const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
				set(currentTheme);
			}
		}
	};
}

export const theme = createThemeStore();
