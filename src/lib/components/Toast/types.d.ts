export interface ToastItem {
	msg: string;
	type: 'default' | 'success' | 'warning' | 'error';
	duration: number;
	id: number;
}
