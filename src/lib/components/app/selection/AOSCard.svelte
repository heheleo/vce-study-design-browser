<script lang="ts">
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import type { UnitAreaOfStudy } from '$lib/types';
	import { cn, plural } from '$lib/utils';

	const { aos }: { aos: UnitAreaOfStudy } = $props();

	const selectedAOS = $derived($GlobalStateStore.selectedAOS);
</script>

<button
	class={cn(
		'group flex flex-col rounded-md border border-transparent bg-primary/5 px-6 py-4 font-display transition-colors',
		{
			'hover:border-primary/20 hover:bg-primary/10': aos.number !== selectedAOS,
			'border-primary/20 bg-primary/20': aos.number === selectedAOS
		}
	)}
	onclick={() => {
		GlobalStateStore.setSelectedAOS(aos.number);
	}}
>
	<span class="flex">{aos.name}</span>
	<span class="flex text-sm text-primary/50">
		{#if aos.points?.length}
			{aos.points.length} {plural('point', aos.points.length > 1)}
		{:else if aos.topics?.length}
			{aos.topics.length} {plural('topic', aos.topics.length > 1)}
		{/if}
	</span>
</button>
