import { writable } from 'svelte/store';

export const faviconSize = writable(64);
export const faviconFormat = writable<'ico' | 'png' | 'jpg'>('ico'); 