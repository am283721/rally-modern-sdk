<script lang="ts">
	import { Keys } from '$lib/utils/keyboard';
	import Input from '../Input/Input.svelte';
	type ComboboxItem = { displayText: string; displaySubText?: string; value: any };

	export let limit = 50;
	export let pagination = false;
	export let pageSize = 20;
	export let data: ComboboxItem[] = [];
	export let selectedItem: ComboboxItem | undefined = undefined;
	export let hasSearch = true;

	let searchInput: Input;
	let comboContainer: HTMLDivElement;
	let comboButton: HTMLDivElement;
	let expanded = false;
	let searchValue = '';
	let activeItem: ComboboxItem | undefined = undefined;
	let currentPage = 0;

	$: hasSearch && expanded && searchInput && searchInput.focus();
	$: filteredData = (searchValue && data.filter((d) => d.displayText.toLowerCase().indexOf(searchValue.toLowerCase()) > -1)) || data;
	$: dropdownItems = (() => {
		let filtered = filteredData;

		if (shouldPaginate()) {
			filtered = filtered.slice(currentPage * pageSize, currentPage * pageSize + pageSize);
		}

		if (shouldShowLimit()) {
			filtered = filtered.slice(0, limit);
		}

		return filtered;
	})();

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
					activeItem = dropdownItems.at(index + 1);
					newEl = (target.nextSibling || target.parentNode?.firstChild) as HTMLLIElement;
					if (newEl) newEl.focus();
					break;
				case Keys.ArrowUp:
					e.preventDefault();
					activeItem = dropdownItems.at(index - 1);
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

	const shouldPaginate = () => pagination && filteredData.length > pageSize;
	const shouldShowLimit = () => !pagination && limit && hasSearch && data.length > limit;
	const nextPage = () => currentPage++;
	const previousPage = () => currentPage--;
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
					<Input
						placeholder="Search"
						icon="search"
						bind:value={searchValue}
						bind:this={searchInput}
						on:input={() => (currentPage = 0)}
						on:keydown={handleSearchKeydown}
					/>
				</div>
			{/if}

			<ul tabindex="-1">
				{#each dropdownItems as item, i}
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
			{#if shouldPaginate()}
				{@const minCount = currentPage * pageSize + 1}
				{@const rawMaxCount = currentPage * pageSize + pageSize}
				{@const filteredTotal = filteredData.length}
				{@const maxCount = rawMaxCount < filteredTotal ? rawMaxCount : filteredTotal}
				<div class="footer pagination">
					<button class="button pagination-button" disabled={currentPage === 0} on:click={previousPage}>
						<svg
							aria-hidden="false"
							class="smb-SvgIcon smb-SvgIcon--leftFull"
							focusable="false"
							role="img"
							style="height: 1.6rem; width: 1.6rem;"
							viewBox="0 0 16 16"
							><title>Previous</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
								><rect x="0" y="0" width="16" height="16" /><path
									d="M5,7.97401547 L9.87204383,3.19002089 C9.99602537,3.06827998 10.1633593,3 10.3377284,3 C10.7034909,3 11,3.29440772 11,3.65757806 L11,12.3424219 C11,12.5167863 10.9302541,12.6840121 10.8060996,12.8073259 C10.5475076,13.0641669 10.1281804,13.0642331 9.86950613,12.8074738 L5,7.97401547 Z"
									fill="currentColor"
								/></g
							></svg
						>
					</button>
					<div class="pagination-text">
						<span>{`Showing results ${filteredTotal ? minCount : 0}-${maxCount} of ${filteredTotal}`}</span>
					</div>
					<button class="button pagination-button" disabled={rawMaxCount > filteredTotal} on:click={nextPage}>
						<svg aria-hidden="false" focusable="false" role="img" style="height: 1.6rem; width: 1.6rem;" viewBox="0 0 16 16"
							><title>Next</title><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
								><rect x="0" y="0" width="16" height="16" /><path
									d="M11,7.97401547 L6.13049387,12.8074738 C5.87181959,13.0642331 5.45249242,13.0641669 5.1939004,12.8073259 C5.06974593,12.6840121 5,12.5167863 5,12.3424219 L5,3.65757806 C5,3.29440772 5.29650909,3 5.6622716,3 C5.83664074,3 6.00397463,3.06827998 6.12795617,3.19002089 L11,7.97401547 Z"
									fill="currentColor"
								/></g
							></svg
						>
					</button>
				</div>
			{/if}
			{#if shouldShowLimit()}
				<div class="footer limit">
					<span>{`Showing ${dropdownItems.length} of ${data.length} items. Search to narrow results`}</span>
				</div>
			{/if}
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
		border-color: var(--hover-border-color);
		outline: none;
		box-shadow: none;
	}

	.button-wrapper:focus {
		background-color: #fff;
		border-color: #c8d1e0;
		box-shadow: var(--focus-box-shadow);
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

	.pagination {
		display: flex;
		flex-direction: row;
		height: 2rem;
		/* border-top: 1px solid #58606e; */
	}

	.pagination .pagination-text {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
		text-align: center;
		/* font-size: 0.9rem; */
		/* line-height: 1.2; */
	}

	.pagination .pagination-button {
		height: auto;
		font-size: 1.4rem;
		border-radius: 0;
	}

	.pagination .pagination-button:disabled {
		background-color: #ebeff5;
		border-color: #c8d1e0;
		color: #58606e;
		cursor: default;
	}

	.footer {
		background-color: #f0f5fc;
		border-bottom-left-radius: 0.4rem;
		border-bottom-right-radius: 0.4rem;
		border-top: 1px solid #c8d1e0;
		color: #434a54;
		display: flex;
		font-weight: bold;
		width: 100%;
		user-select: none;
	}

	.limit {
		padding: 0.3rem 2rem 0.3rem 1rem;
	}
</style>
