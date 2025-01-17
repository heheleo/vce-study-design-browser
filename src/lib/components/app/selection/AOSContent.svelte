<script lang="ts">
	import type { UnitAreaOfStudy } from '$lib/types';
	import renderMathInElement from 'katex/contrib/auto-render';

	const { aosData }: { aosData: UnitAreaOfStudy } = $props();

	$effect(() => {
		aosData;

		const element = document.getElementById('content');
		if (element)
			renderMathInElement(element, {
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '$', right: '$', display: false }
				],
				errorCallback(msg, err) {
					console.error(`KaTeX rendering error: ${msg}`);
					console.error(err);
				}
			});
	});
</script>

<div class="flex flex-col gap-1 font-serif" id="content">
	{#if aosData.points?.length}
		<div class="text-xl">This area of study covers:</div>
		{#each aosData.points as point}
			<span class="rounded-sm pl-4 text-primary/85 transition-colors hover:bg-primary/20">
				• {point}
			</span>
		{/each}
	{:else if aosData.topics?.length}
		{#each aosData.topics as topic}
			<div class="mt-2 text-xl">{topic.name}</div>
			{#each topic.points as point}
				<span class="rounded-sm pl-4 text-primary/85 transition-colors hover:bg-primary/20">
					• {point}
				</span>
			{/each}
		{/each}
	{/if}
</div>
