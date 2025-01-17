<script lang="ts">
	import type { UnitAreaOfStudy } from '$lib/types';

	const { aosData }: { aosData: UnitAreaOfStudy } = $props();
</script>

<div class="flex flex-col gap-1 font-serif">
	{#if aosData.points?.length}
		<div class="text-xl text-primary/90">This area of study covers:</div>
		{#each aosData.points as point}
			<span class="ml-4">• {point}</span>
		{/each}
	{:else if aosData.topics?.length}
		{#each aosData.topics as topic}
			<div class="text-xl mt-2">{topic.name}</div>
			{#each topic.points as point}
				<span class="ml-4 text-primary/85">• {point}</span>
			{/each}
		{/each}
	{/if}
</div>
