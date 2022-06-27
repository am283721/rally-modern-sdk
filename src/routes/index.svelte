<script lang="ts">
	import { Input, Combobox } from '$lib';
	import '../styles/normalize.css';
	import '../styles/variables.css';

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
</script>

<div class="container">
	<div class="input-or-combo-container">
		<Input icon="" bind:value={inputVal} placeholder="test" />
	</div>
	<div class="input-or-combo-container">
		<Input icon="" disabled={true} bind:value={disabledInputVal} placeholder="test" />
	</div>
	<div class="input-or-combo-container">
		<Combobox data={comboboxData} />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		padding: 2rem;
	}

	.container div {
		margin: 2rem;
	}

	.input-or-combo-container {
		max-width: 32rem;
	}
</style>
