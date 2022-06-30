<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { toast } from './store';
	import ToastItem from './ToastItem.svelte';
</script>

<div class="toast-container">
	{#each $toast as item (item.id)}
		<div in:fly={{ y: -200 }} out:fade animate:flip={{ duration: 200 }}>
			<ToastItem {item} />
		</div>
	{/each}
</div>

<style>
	.toast-container {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 1.25rem;
		bottom: auto;
		align-items: center;
		width: 32rem;
		max-width: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
	}

	.toast-container > div {
		width: 100%;
	}
</style>
