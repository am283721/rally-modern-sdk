<script lang="ts">
	import { toast } from './store';
	import type { ToastItem } from './types';
	import { onDestroy } from 'svelte';

	export let item: ToastItem;

	let timeout: number | undefined;

	if (item.duration) {
		timeout = Number(setTimeout(() => toast.hide(item.id), item.duration));
	}

	onDestroy(() => {
		if (timeout) {
			clearTimeout(timeout);
		}
	});
</script>

<div class={`toast ${item.type}`}>
	<div class="message">
		{item.msg}
	</div>
	<button class="close" on:click={() => toast.hide(item.id)}>
		<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z"
			/>
		</svg>
	</button>
</div>

<style>
	.toast {
		display: flex;
		width: 100%;
		height: auto;
		padding: 0.4rem 0.75rem;
		margin-bottom: 1rem;
		border-radius: 0.375rem;
		color: white;
		align-items: center;
		background-color: rgb(71 85 105);
	}

	.success {
		background-color: #155724;
	}

	.warning {
		background-color: #f6a900;
	}

	.error {
		background-color: #cd0000;
	}

	.message {
		flex: 1;
	}

	.close {
		cursor: pointer;
		border: none;
		color: white;
		background-color: transparent;
	}

	.close:hover {
		color: #d1d1d1;
	}
</style>
