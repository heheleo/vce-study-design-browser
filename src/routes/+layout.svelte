<script lang="ts">
	import '../app.css';
	import 'katex/dist/katex.css';
	import { ModeWatcher, setMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(() => {
		setMode("dark");
	})

	let { children } = $props();
</script>

<ModeWatcher defaultMode="light" />

{@render children()}
