<script lang="ts">
	import NavBar from '$lib/components/app/NavBar.svelte';
	import Subject from '$lib/components/app/Subject.svelte';
	import { fetchStudyDesignData, getSubjectNames } from '$lib/data';
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import { onMount } from 'svelte';
	import CircleHelpIcon from 'lucide-svelte/icons/circle-help';

	onMount(async () => {
		// Load the study design data:
		GlobalStateStore.setLoadingData(true);
		await fetchStudyDesignData();

		// Data has finished loading:
		console.log(`Successfully fetched ${getSubjectNames().length} subjects.`);
		GlobalStateStore.setLoadingData(false);
	});
</script>

<div class="flex h-screen min-h-0 w-screen flex-col gap-4 p-6">
	<NavBar />

	{#if $GlobalStateStore.selectedSubject}
		<div class="flex h-full min-h-0 gap-2">
			<Subject />
		</div>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<CircleHelpIcon class="mr-2 size-4" />
			Select a subject to get started.
		</div>
	{/if}
</div>
