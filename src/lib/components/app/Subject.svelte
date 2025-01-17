<script lang="ts">
	import { getStudyDesignBySubject } from '$lib/data';
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import AOSCard from './selection/AOSCard.svelte';
	import AOSContent from './selection/AOSContent.svelte';
	import UnitCard from './selection/UnitCard.svelte';

	const selectedUnit = $derived($GlobalStateStore.selectedUnit);
	const subjectData = $derived(getStudyDesignBySubject($GlobalStateStore.selectedSubject || ''));
	const unitData = $derived(subjectData[selectedUnit || '1']);
	const aosData = $derived(
		unitData.aos.find((aos) => aos.number === $GlobalStateStore.selectedAOS)
	);

	const contentsMetadataInfo = $derived.by(() => {
		if (!aosData) return '';
		if (aosData.points?.length) {
			return `${aosData.points.length} points`;
		} else if (aosData.topics?.length) {
			return `${aosData.topics.length} topics`;
		}

		return '';
	});
</script>

<!-- Unit selection -->
<div class="flex h-full flex-col gap-2 rounded-md bg-primary/5 p-4">
	<div class="font-default text-xl">Units</div>
	{#each Object.keys(subjectData) as unit}
		<UnitCard {unit} />
	{/each}
</div>

<!-- AOS selection -->
<div class="flex h-full flex-col gap-2 rounded-md bg-primary/5 p-4">
	<div class="font-default text-xl">Areas Of Study</div>
	{#each unitData.aos as aos}
		<AOSCard {aos} />
	{/each}
</div>

{#if aosData}
	<div class="flex h-full min-h-0 flex-1 flex-col gap-4 rounded-md bg-primary/5 p-4">
		<div class="font-default text-xl">
			Contents
			<span class="ml-2 text-sm text-primary/50">
				{contentsMetadataInfo}
			</span>
		</div>

		<ScrollArea class="overflow-y-auto rounded-md">
			<AOSContent {aosData} />
		</ScrollArea>
	</div>
{/if}
