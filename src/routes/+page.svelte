<script lang="ts">
	import NavBar from '$lib/components/app/NavBar.svelte';
	import { fetchStudyDesignData, getSubjectNames } from '$lib/data';
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import { onMount } from 'svelte';
	
	onMount(async () => {
		// Load the study design data:
		GlobalStateStore.setLoadingData(true);
		await fetchStudyDesignData();

		// Data has finished loading:
		console.log(`Successfully fetched ${getSubjectNames().length} subjects.`);
		GlobalStateStore.setLoadingData(false);
	});
</script>

<div class="flex h-screen w-screen flex-col gap-4 p-4">
	<NavBar />

	<div class="bg-primary/20 flex-1 rounded-md">
		<div></div>
	</div>
</div>
