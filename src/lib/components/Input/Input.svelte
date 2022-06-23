<script lang="ts">
	let inputEl: HTMLInputElement;
	export let placeholder = '';
	export let value = '';
	export let icon: string;
	export let disabled = false;
	export const focus = () => inputEl.focus();
	export const clearInput = () => {
		value = '';
		focus();
	};
</script>

<div class="wrapper {disabled ? 'is-disabled' : ''}">
	{#if icon}
		<svg class="icon" focusable="false" role="img" style="height: 1.6rem; width: 1.6rem;" viewBox="0 0 16 16"
			><title /><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
				><rect x="0" y="0" width="16" height="16" /><path
					d="M14.2486522,13.8061334 C14.2186289,13.8921331 14.1692551,13.9728806 14.1005306,14.041605 C14.0417744,14.1003613 13.97423,14.1449733 13.9021286,14.175441 C13.5157778,14.4188876 12.9990857,14.3723511 12.6625661,14.0358315 L10.0222453,11.3955106 C7.94447042,12.8276321 5.07706829,12.6195406 3.22876383,10.7712362 C1.14596761,8.68843994 1.14596761,5.31156006 3.22876383,3.22876383 C5.31156006,1.14596761 8.68843994,1.14596761 10.7712362,3.22876383 C12.6051378,5.06266546 12.8242894,7.89984409 11.4286911,9.97352936 L14.0767797,12.621618 C14.3975562,12.9423944 14.454847,13.4268799 14.2486522,13.8061334 L14.2486522,13.8061334 Z M9.59843674,9.55748857 C11.0303591,8.12556617 11.0303591,5.80396124 9.59843674,4.37203884 C8.16651434,2.94011644 5.84490941,2.94011644 4.41298701,4.37203884 C2.98106461,5.80396124 2.98106461,8.12556617 4.41298701,9.55748857 C5.84490941,10.989411 8.16651434,10.989411 9.59843674,9.55748857 Z"
					fill="currentColor"
				/></g
			></svg
		>
	{/if}
	<input
		class={icon ? 'has-icon' : ''}
		{placeholder}
		{disabled}
		type="text"
		bind:value
		on:change
		on:input
		on:keydown
		on:keyup
		on:keypress
		bind:this={inputEl}
	/>
	{#if value && !disabled}
		<button class="clear-button" aria-label="Clear" tabindex="0" type="button" on:click={clearInput}>
			<div>
				<svg aria-hidden="false" class="smb-SvgIcon smb-SvgIcon--cancel" focusable="false" role="img" style="height: 1.6rem; width: 1.6rem;" viewBox="0 0 16 16"
					><title>Clear</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
						><rect x="0" y="0" width="16" height="16" /><path
							d="M12.2426407,10.8284271 C12.633165,11.2189514 12.633165,11.8521164 12.2426407,12.2426407 C11.8521164,12.633165 11.2189514,12.633165 10.8284271,12.2426407 L8,9.41421356 L5.17157288,12.2426407 C4.78104858,12.633165 4.1478836,12.633165 3.75735931,12.2426407 C3.36683502,11.8521164 3.36683502,11.2189514 3.75735931,10.8284271 L6.58578644,8 L3.75735931,5.17157288 C3.36683502,4.78104858 3.36683502,4.1478836 3.75735931,3.75735931 C4.1478836,3.36683502 4.78104858,3.36683502 5.17157288,3.75735931 L8,6.58578644 L10.8284271,3.75735931 C11.2189514,3.36683502 11.8521164,3.36683502 12.2426407,3.75735931 C12.633165,4.1478836 12.633165,4.78104858 12.2426407,5.17157288 L9.41421356,8 L12.2426407,10.8284271 Z"
							fill="currentColor"
						/></g
					></svg
				>
			</div>
		</button>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		align-items: center;
		padding: 0;
		position: relative;
		transition-duration: 0.15s;
		transition-property: border-color, box-shadow;
		transition-timing-function: ease-in-out;
		background-color: #fff;
		border: 1px solid #c8d1e0;
		border-radius: 3px;
		box-shadow: none;
		color: #333840;
		font-size: 1.3rem;
		line-height: 1.4;
		height: 2.4rem;
	}

	.wrapper.is-disabled {
		background-color: #ebeff5;
		border-color: #c8d1e0;
		color: #58606e;
		cursor: default;
	}

	.wrapper:not(.is-disabled):hover {
		background-color: #fff;
		border-color: #5691f0;
		outline: none;
		box-shadow: none;
	}

	.wrapper:not(.is-disabled) input:focus {
		background-color: #fff;
		border-color: #c8d1e0;
		box-shadow: 0 0 0 0.1rem #fff, 0 0 0 0.2rem #1d5bbf;
		outline: none;
	}

	.wrapper input {
		background-color: transparent;
		border: 0;
		border-radius: 3px;
		padding: 0 0.6rem;
		/* width: calc(100% - 4rem); */
		width: 100%;
		font-size: 1.2rem;
		height: 2.4rem;
	}

	.wrapper input:focus {
		outline: none;
	}

	.wrapper input:not(.is-disabled) {
		padding-right: 2.4rem;
	}

	.wrapper input.has-icon {
		padding-left: 2.4rem;
	}

	.wrapper input::placeholder {
		color: #8e99ab;
	}

	.icon {
		left: 0.3rem;
		right: auto;
		color: #3272d9;
		font-size: 1.6rem;
		line-height: 3rem;
		pointer-events: none;
		position: absolute;
		right: 0.8rem;
		top: 50%;
		transform: translateY(-50%);
		fill: currentColor;
	}

	.clear-button:not(.is-disabled) {
		border: none !important;
		padding: 0.1rem 0.4rem;
		height: 2.4rem;
		width: auto;
		color: #3272d9;
		cursor: pointer;
		background-color: transparent;
		position: absolute;
		right: 0.2rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.clear-button:not(.is-disabled):hover,
	.clear-button:not(.is-disabled):focus {
		background-color: #ebeff5;
		outline: none;
	}

	.clear-button > div {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.clear-button > div > svg {
		fill: currentColor;
	}
</style>
