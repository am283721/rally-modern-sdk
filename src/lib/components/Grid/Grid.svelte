<script lang="ts">
	import { getFieldDisplayValue } from '$lib/utils/rally';
	import { onMount } from 'svelte';
	import { resizeColumn } from './actions';
	import { ColumnType, type Column } from './types.d';

	export let columns: Column[];
	export let data: any[];

	let currentSort: undefined | { column: Column; direction: 'ASC' | 'DESC' };
	const minWidth = 100;

	const columnTypeToRatioMap = {
		[ColumnType.numeric]: '1fr',
		[ColumnType.date]: '1.5fr',
		[ColumnType.textShort]: ' 1.67fr',
		[ColumnType.textLong]: '3.33fr',
		default: '1.67fr'
	};

	const refreshColumns = () => {
		columns = columns;
	};

	const toggleSortDirection = (column: Column) => {
		let direction: 'ASC' | 'DESC' = 'ASC';

		if (currentSort && column.dataIndex === currentSort.column.dataIndex) {
			direction = currentSort.direction === 'ASC' ? 'DESC' : 'ASC';
		}

		currentSort = { column, direction };
	};

	const sortColumn = (column: Column) => {
		if (!column.sortable) return;

		toggleSortDirection(column);

		data = data.sort((a, b) => {
			let val1 = a.cellDisplayValues[column.dataIndex];
			let val2 = b.cellDisplayValues[column.dataIndex];
			let sortVal = 0;

			if (column.sorterFn) {
				sortVal = column.sorterFn(val1, val2);
			} else if (!val1) {
				if (!val2) {
					sortVal = 0;
				}
				sortVal = -1;
			} else if (!val2) {
				sortVal = 1;
			} else {
				sortVal = val1 > val2 ? 1 : val1 < val2 ? -1 : 0;
			}

			return currentSort?.direction === 'DESC' ? sortVal * -1 : sortVal;
		});
	};

	const cacheCellRenderValues = () => {
		console.log('caching display values');
		data.forEach((item, rowIndex) => {
			item.cellDisplayValues = {};

			columns.forEach((column, columnIndex) => {
				item.cellDisplayValues[column.dataIndex] = getFieldDisplayValue(item, column.dataIndex);

				if (column.renderer) {
					item.cellDisplayValues[column.dataIndex] = column.renderer(item.cellDisplayValues[column.dataIndex], item, rowIndex, columnIndex);
				}
			});
		});
	};

	if (!columns.length) {
		throw new Error('No columns specified for Grid');
	}

	columns.forEach((c) => {
		c.width = c.width || columnTypeToRatioMap[c.columnType || 'default'] || columnTypeToRatioMap['default'];

		if (typeof c.sortable !== 'boolean') c.sortable = true;
	});
	columns.at(-1)!.isLast = true;

	$: data && cacheCellRenderValues();
	$: gridTemplateColumns = columns.map((c) => c.width).join(' ');

	onMount(() => {
		columns.forEach((c) => (c.width = `${c.el?.clientWidth}px`));
		columns.at(-1)!.width = `minmax(${columns.at(-1)!.width}, 1fr)`;
	});
</script>

<table style:grid-template-columns={gridTemplateColumns}>
	<thead>
		<tr>
			{#each columns as column}
				<th class:is-sortable={column.sortable} bind:this={column.el} on:click={() => sortColumn(column)}>
					<div class="header-content">{column.text}</div>

					{#if column.sortable}
						<div class="sort-icon" class:is-active-sort={column.sortable && column.dataIndex === currentSort?.column.dataIndex}>
							<svg aria-hidden="true" focusable="false" role="img" viewBox="0 0 16 16" style="height: 1.6rem; width: 1.6rem;"
								><title /><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
									><rect transform="translate(8.000000, 8.000000) scale(-1, 1) translate(-8.000000, -8.000000) " x="0" y="0" width="16" height="16" /><path
										d="M3.66666667,4.56461451 L2.44978391,5.80478205 C2.1943804,6.06507265 1.78028948,6.06507265 1.52488597,5.80478205 C1.26948245,5.54449144 1.26948245,5.12247699 1.52488597,4.86218638 L4.33333333,2 L7.1417807,4.86218638 C7.39718421,5.12247699 7.39718421,5.54449144 7.1417807,5.80478205 C6.88637718,6.06507265 6.47228627,6.06507265 6.21688275,5.80478205 L5,4.56461451 L5,14 L3.66666667,14 L3.66666667,4.56461451 Z M11,11.4353855 L11,2 L12.3333333,2 L12.3333333,11.4353855 L13.5502161,10.195218 C13.8056196,9.93492735 14.2197105,9.93492735 14.475114,10.195218 C14.7305175,10.4555086 14.7305175,10.877523 14.475114,11.1378136 L11.6666667,14 L8.8582193,11.1378136 C8.60281579,10.877523 8.60281579,10.4555086 8.8582193,10.195218 C9.11362282,9.93492735 9.52771373,9.93492735 9.78311725,10.195218 L11,11.4353855 Z"
										fill="currentColor"
									/></g
								></svg
							>
						</div>
					{/if}

					<div class="resize-handle" use:resizeColumn={{ column, minWidth, refreshColumns }} aria-hidden="true" /></th
				>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data as item}
			<tr>
				{#each columns as column}
					<td>{@html item.cellDisplayValues[column.dataIndex]}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table {
		display: grid;
		border-collapse: collapse;
		min-width: 100%;
		overflow-x: auto;
	}

	thead,
	tbody,
	tr {
		display: contents;
	}

	th,
	td {
		/* padding: 15px; */
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	th {
		position: sticky;
		z-index: 400;
		top: 0;
		background: white;
		text-align: left;
		font-weight: normal;
		font-size: 1.1rem;
		color: #333840;
		border-bottom: 2px solid #c8d1e0;
		user-select: none;
		line-height: 1.33;
		font-weight: bold;
		overflow: hidden !important;
		text-overflow: ellipsis !important;
		white-space: nowrap !important;
	}

	th.is-sortable {
		cursor: pointer;
	}

	.header-content {
		max-height: 12rem;
		min-height: 2.6rem;
		overflow: hidden;
		align-items: flex-end;
		display: flex;
		padding: 0.4rem;
		margin: 0;
		overflow-wrap: normal;
		position: relative;
		text-align: left;
		white-space: normal;
	}

	.sort-icon {
		background-color: #fff;
		height: 1.6rem;
		position: absolute;
		right: 0.8rem;
		bottom: 0.4rem;
	}

	.is-active-sort {
		color: #3272d9;
	}

	.resize-handle {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: none;
		width: 0.8rem;
		cursor: col-resize;
		border-right: 2px dashed #dde3ed;
	}

	:global(.header-being-resized .resize-handle) {
		width: 4px !important;
		border-right: 2px solid #3272d9 !important;
	}

	td {
		padding-top: 10px;
		padding-bottom: 10px;
		color: #808080;
	}

	tr:nth-child(even) td {
		background: #f8f6ff;
	}
</style>
