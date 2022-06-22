<script lang="ts">
	export let placeholder = '';
</script>

<div class="wrapper">
	<input {placeholder} />
</div>

<style>
	.wrapper {
		width: 100%;
		max-width: 20rem;
		margin: 0.75rem auto;
	}

	.wrapper input {
		position: relative;
		width: 100%;
		padding: 0.5rem 2.5rem 0.5rem 0.75rem;
		text-align: left;
	}
</style>
