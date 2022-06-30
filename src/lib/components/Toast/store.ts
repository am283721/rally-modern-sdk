import { writable } from 'svelte/store';
import type { ToastItem } from './types';

export const toast = (() => {
	const { subscribe, update } = writable(<ToastItem[]>[]);
	const defaultDuration = 5000;

	const addToast = (type: ToastItem['type'], msg: string, duration: number) => update((t) => [{ type, msg, duration, id: new Date().getTime() }, ...t]);

	return {
		subscribe,
		show: (msg: string, duration: number = defaultDuration) => {
			addToast('default', msg, duration);
		},
		showSuccess: (msg: string, duration: number = defaultDuration) => {
			addToast('success', msg, duration);
		},
		showWarning: (msg: string, duration: number = defaultDuration) => {
			addToast('warning', msg, duration);
		},
		showError: (msg: string, duration: number = defaultDuration) => {
			addToast('error', msg, duration);
		},
		hide: (id: number) => {
			update((t) => t.filter((toast) => toast.id !== id));
		}
	};
})();
