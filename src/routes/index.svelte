<script lang="ts">
	import Combobox from '$lib/components/Combobox/Combobox.svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import Grid from '$lib/components/Grid/Grid.svelte';
	import { initRallyApp, query } from '$lib/utils/rally';
	import '../lib/styles/normalize.css';
	import '../lib/styles/variables.css';
	import type { Column } from '$lib/components/Grid/types';
	import App from '$lib/App.svelte';
	import type { RallyWSAPIStoreConfig } from '$lib/utils/rallySDKTypes';

	let gridData;
	let inputVal = 'test';
	let disabledInputVal = "I'm disabled";
	let comboboxData = [
		{ displayText: 'test 1', value: {} },
		{ displayText: 'test 2', value: {} },
		{ displayText: 'test 3', value: {} },
		{ displayText: 'test 4', value: {} },
		{ displayText: 'test 5', value: {} },
		{ displayText: 'test 6', value: {} },
		{ displayText: 'test 1', value: {} },
		{ displayText: 'test 2', value: {} },
		{ displayText: 'fdsg ggd 3', value: {} },
		{ displayText: 'test 4', value: {} },
		{ displayText: 'rgg g dfgr sljkdf sdkjf sdjfjdg g fadsf 5', value: {} },
		{ displayText: 'test 6', value: {} },
		{ displayText: 'test 1', value: {} },
		{ displayText: 'gfdsg ylkij j;lj  2', value: {} },
		{ displayText: 'test 3', value: {} },
		{ displayText: 'test 4', value: {} },
		{ displayText: 'test 5', value: {} },
		{ displayText: 'test 6', value: {} }
	];

	const sorterFn = (a: any, b: any) => {
		if (!a) {
			if (!b) {
				return 0;
			}
			return -1;
		}
		if (!b) {
			return 1;
		}
		return a > b ? 1 : a < b ? -1 : 0;
	};

	const gridFetch = ['FormattedID', 'Name', 'InProgressDate', 'Owner', 'Description', 'ScheduleState'];
	const gridColumns: Column[] = [
		{ text: 'ID', dataIndex: 'FormattedID', columnType: 'numeric' },
		{ text: 'Name', dataIndex: 'Name' },
		{ text: 'In Progress Date', dataIndex: 'InProgressDate' },
		{ text: 'Owner', dataIndex: 'Owner', sorterFn },
		{ text: 'Description', dataIndex: 'Description', sortable: false },
		{ text: 'State', dataIndex: 'ScheduleState', width: '100px', renderer: (value, record) => `<span style="color: blue;">${value}</span>` }
	];
	const promise = initRallyApp('test').then(
		async () =>
			(gridData = await query('Defect', {
				pageSize: 50,
				limit: 50,
				fetch: gridFetch
			}))
	);

	const comboboxStoreConfig: RallyWSAPIStoreConfig = {
		model: 'HierarchicalRequirement',
		pageSize: 50,
		fetch: gridFetch
	};
</script>

{#await promise then nothingToSeeHere}
	<App />

	<div class="container">
		<div class="input-or-combo-container">
			<Input icon="" bind:value={inputVal} placeholder="test" />
		</div>
		<div class="input-or-combo-container">
			<Input icon="" disabled={true} bind:value={disabledInputVal} placeholder="test" />
		</div>
		<div class="input-or-combo-container">
			<Combobox data={comboboxData} pageSize={10} displayField="displayText" />
		</div>
		<div class="input-or-combo-container">
			<Combobox storeConfig={comboboxStoreConfig} displayField="Name" />
		</div>
		<div class="grid-container">
			<Grid columns={gridColumns} data={gridData} />
		</div>
	</div>
{/await}

<style>
	.container {
		display: flex;
		flex-direction: column;
		padding: 2rem;
		height: 100vh;
		overflow-y: auto;
	}

	.container div {
		margin: 2rem;
	}

	.input-or-combo-container {
		max-width: 32rem;
	}

	.grid-container {
		max-height: 900px;
		overflow: hidden;
		overflow-y: scroll;
	}
</style>
