<script lang="ts">
	import { Keys } from '$lib/utils/keyboard';

	import type { ComboboxItem } from 'src/types';

	import Input from '../Input/Input.svelte';

	// export let pagination = true;
	// export let pageSize = 10;
	export let data: ComboboxItem[] = [];
	export let selectedItem: ComboboxItem | undefined = undefined;
	export let hasSearch = true;

	let filteredData = data;
	let searchInput: Input;
	let comboContainer: HTMLDivElement;
	let comboButton: HTMLDivElement;
	let expanded = false;
	let searchValue = '';
	let activeItem: ComboboxItem | undefined = undefined;

	$: hasSearch && expanded && searchInput && searchInput.focus();
	$: filteredData = searchValue === '' ? data : data.filter((d) => d.displayText.indexOf(searchValue) > -1);

	const setSelectedItem = (item: ComboboxItem) => {
		selectedItem = item;
		comboButton.focus();
	};

	const closeCombo = () => {
		activeItem = undefined;
		searchValue = '';
		comboButton.focus();
	};

	const toggleCombo = () => {
		if (expanded) closeCombo();
		else expanded = true;
	};

	const handleButtonKeyDown = (e: KeyboardEvent) => {
		console.log(e);
		switch (e.key) {
			// Ref: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
			case Keys.Space:
			case Keys.Enter:
			case Keys.ArrowDown:
				e.preventDefault();
				expanded = true;
				break;
		}
	};

	const handleSpaceKeyUp = (e: KeyboardEvent) => {
		// Required for firefox, event.preventDefault() in handleKeyDown for
		// the Space key doesn't cancel the handleKeyUp, which in turn
		// triggers a *click*.
		if (e.key === Keys.Space) e.preventDefault();
	};

	const handleSearchKeydown = (e: KeyboardEvent) => {
		if (e.key === Keys.Escape) {
			e.preventDefault();
			closeCombo();
		}
	};

	const handleItemKeyDown = (item: ComboboxItem, index: number) => {
		const handler = (e: KeyboardEvent) => {
			let newEl;
			const target = e.target as HTMLLIElement;
			switch (e.key) {
				case Keys.Space:
				case Keys.Enter:
					e.preventDefault();
					setSelectedItem(item);
					break;
				case Keys.ArrowDown:
					e.preventDefault();
					activeItem = filteredData.at(index + 1);
					newEl = (target.nextSibling || target.parentNode?.firstChild) as HTMLLIElement;
					if (newEl) newEl.focus();
					break;
				case Keys.ArrowUp:
					e.preventDefault();
					activeItem = filteredData.at(index - 1);
					newEl = (target.previousSibling || target.parentNode?.lastChild) as HTMLLIElement;
					if (newEl) newEl.focus();
					break;
				case Keys.Escape:
					e.preventDefault();
					closeCombo();
					break;
			}
		};

		return handler;
	};

	const handleItemClick = (item: ComboboxItem) => {
		selectedItem = item;
		closeCombo();
	};

	const handleGlobalMousedown = (event: MouseEvent) => {
		if (!expanded) return;
		if (!comboContainer?.contains(event.target as HTMLElement)) closeCombo();
	};
</script>

<svelte:window on:mousedown={handleGlobalMousedown} />

<div class="wrapper" tabindex="-1" bind:this={comboContainer}>
	<div
		class="button-wrapper"
		aria-haspopup="listbox"
		tabindex="0"
		bind:this={comboButton}
		on:mousedown|preventDefault={toggleCombo}
		on:keydown={handleButtonKeyDown}
		on:keyup={handleSpaceKeyUp}
		on:focus={() => (expanded = false)}
	>
		<span>
			<span class="selected-value-text">{(selectedItem && selectedItem.displayText) || ''}</span>
			<span class="selected-value-subtext">{(selectedItem && selectedItem.displaySubText) || ''}</span>
		</span>
		<svg class="icon" focusable="false" role="img" style="height: 1.6rem; width: 1.6rem;" viewBox="0 0 16 16"
			><title>Dropdown</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
				><rect x="0" y="0" width="16" height="16" /><path
					d="M8.01535196,11.3038244 L8.01524617,11.303722 L7.98464804,11.3333333 L3.24538346,6.7469161 C2.91820551,6.43029006 2.91820551,5.91693783 3.24538346,5.60031179 C3.5725614,5.28368575 4.10302166,5.28368575 4.4301996,5.60031179 L7.98475383,9.04022709 L11.5698004,5.57080286 C11.8969783,5.25417682 12.4274386,5.25417682 12.7546165,5.57080286 C13.0817945,5.8874289 13.0817945,6.40078113 12.7546165,6.71740717 L8.01535196,11.3038244 Z"
					fill="currentColor"
				/></g
			></svg
		>
	</div>
	{#if expanded}
		<div class="combobox-wrapper" role="listbox" aria-expanded="true">
			<div role="tooltip" hidden>You are inside a dropdown, to navigate items in the dropdown use the up and down arrow keys</div>

			{#if hasSearch}
				<div class="search-wrapper" tabindex="-1">
					<Input placeholder="Search" icon="search" bind:value={searchValue} bind:this={searchInput} on:keydown={handleSearchKeydown} />
				</div>
			{/if}

			<ul tabindex="-1">
				{#each filteredData as item, i}
					<li
						tabindex="0"
						on:click={() => handleItemClick(item)}
						on:mouseenter={() => (activeItem = item)}
						on:mouseleave={() => (activeItem = undefined)}
						on:focus={() => (activeItem = item)}
						on:blur={() => (activeItem = undefined)}
						on:keydown={handleItemKeyDown(item, i)}
						class="{activeItem === item ? 'is-active' : ''} {selectedItem === item ? 'is-selected' : ''}"
					>
						<div aria-label="{item.displayText} is {selectedItem === item ? '' : 'not'} selected ({i + 1} of {data.length})">
							<span class="item-text" aria-hidden="true">{item.displayText}</span>
							<span class="item-subtext" aria-hidden="true">{item.displaySubText || ''}</span>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		position: relative;
	}

	.button-wrapper {
		display: flex;
		align-items: center;
		padding: 0 0.8rem;
		position: relative;
		justify-content: flex-start;
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
		cursor: pointer;
		text-align: left;
		white-space: nowrap;
		user-select: none;
		min-width: 16rem;
	}

	.button-wrapper:hover {
		background-color: #fff;
		border-color: #5691f0;
		outline: none;
		box-shadow: none;
	}

	.button-wrapper:focus {
		background-color: #fff;
		border-color: #c8d1e0;
		box-shadow: 0 0 0 0.1rem #fff, 0 0 0 0.2rem #1d5bbf;
		outline: none;
	}

	.button-wrapper span {
		align-items: center;
		display: flex;
		height: 100%;
		/* margin-right: 2rem; */
		width: calc(100% - 1.6rem);
		flex: 1;
	}

	.button-wrapper span span.selected-value-text {
		margin-right: 0.4rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.button-wrapper span span.selected-value-subtext {
		font-size: 1.1rem;
		color: #58606e;
		margin-left: auto;
		margin-right: 0.4rem;
	}

	.icon {
		pointer-events: none;
		fill: currentColor;
	}

	.combobox-wrapper {
		position: absolute;
		top: 2.4rem;
		left: 0;
		background-color: #fff;
		box-shadow: 0 0.2rem 0.4rem 0 rgba(0, 0, 0, 0.1);
		display: block;
		border: 0 solid #c8d1e0;
		border-bottom-color: rgb(200, 209, 224);
		border-bottom-style: solid;
		border-bottom-width: 0px;
		border-radius: 0.3rem;
		border-bottom: #c8d1e0 solid 1px;
		margin: 0.3rem 0;
		z-index: 1000;
	}

	.search-wrapper {
		border-radius: 0.3rem;
		margin-bottom: 0.4rem;
		padding: 0;
		position: relative;
	}

	.combobox-wrapper ul {
		max-height: calc(40vh - 5.2rem);
		background-clip: padding-box;
		border-radius: 0.3rem;
		display: block;
		font-size: 1.4rem;
		left: 0;
		list-style: none;
		margin-bottom: 0;
		margin-top: 0rem;
		max-height: 40vh;
		max-width: 56rem;
		min-width: 16rem;
		overflow-y: auto;
		padding: 0 0 0 0;
		position: relative;
		width: 100%;
	}

	.combobox-wrapper ul li {
		font-size: 1.2rem;
		background-color: #fff;
		height: auto;
		align-items: center;
		border-radius: 0;
		color: #333840;
		cursor: pointer;
		display: flex;
		font-size: 1.4rem;
		font-stretch: normal;
		font-style: normal;
		font-weight: normal;
		/* height: 4rem; */
		letter-spacing: normal;
		line-height: 1.43;
		padding: 0.6rem 1.2rem;
		text-align: left;
		vertical-align: middle;
		white-space: nowrap;
	}

	.combobox-wrapper ul li:focus:not(.is-disabled) {
		outline: none;
	}

	/* .combobox-wrapper ul li:not(:last-child) {
		margin-bottom: 0;
	} */

	.combobox-wrapper ul li.is-selected {
		background-color: #c8d1e0;
	}

	.combobox-wrapper ul li.is-active:not(.is-disabled) {
		background-color: #ebeff5;
	}

	.combobox-wrapper ul li div {
		align-items: center;
		display: flex;
		line-height: 1;
		width: 100%;
	}

	.combobox-wrapper ul li div span {
		max-width: 34.4rem;
		display: inline-block;
		line-height: normal;
	}

	.combobox-wrapper ul li div span.item-text {
		margin-right: 0.8rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.combobox-wrapper ul li div span.item-subtext {
		color: #58606e;
		margin-left: auto;
	}
</style>
