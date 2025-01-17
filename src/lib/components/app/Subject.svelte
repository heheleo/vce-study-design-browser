<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getStudyDesignBySubject } from '$lib/data';
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import { aosToString, copyContent } from '$lib/utils';
	import CopyIcon from 'lucide-svelte/icons/clipboard';
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

	let isCopyDialogOpen = $state<boolean>(false);
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
	<div class="flex h-full min-h-0 flex-1 flex-col gap-2 rounded-md bg-primary/5 p-4">
		<div class="flex w-full font-default text-xl">
			<div class="flex justify-center items-center">
				<span>Contents</span>
				<span class="ml-2 text-sm text-primary/50">
					{contentsMetadataInfo}
				</span>
			</div>

			<div class="ml-auto">
				<Button
					size="icon"
					variant="ghost"
					onclick={() => {
						copyContent(aosToString(aosData))
							.then(() => {
								isCopyDialogOpen = true;
							})
							.catch((error) => {
								console.error('Failed to copy text:');
								console.error(error);
							});
					}}
				>
					<CopyIcon />
				</Button>
			</div>
		</div>

		<ScrollArea class="overflow-y-auto rounded-md">
			<AOSContent {aosData} />
		</ScrollArea>
	</div>
{/if}

<AlertDialog.Root bind:open={isCopyDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center">
				<CopyIcon class="mr-2 size-4" />
				Copied
			</AlertDialog.Title>
			<AlertDialog.Description>
				I have successfully copied this area of study into your clipboard.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Close</AlertDialog.Cancel>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
