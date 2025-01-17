<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { getUnitStatistics } from '$lib/data';
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import { cn } from '$lib/utils';

	const { unit }: { unit: string } = $props();

	const FORMATTED_UNITS: Record<string, string> = {
		1: 'Unit 1',
		2: 'Unit 2',
		34: 'Units 3 & 4'
	};

	const selectedUnit = $derived($GlobalStateStore.selectedUnit);
	const statistics = $derived(getUnitStatistics($GlobalStateStore.selectedSubject ?? "", unit));
</script>

<button
	class={cn(
		'group flex flex-col rounded-md border border-transparent bg-primary/5 px-6 py-4 font-display transition-colors',
		{
			'hover:border-primary/20 hover:bg-primary/10': unit !== selectedUnit,
			'border-primary/20 bg-primary/20': unit === selectedUnit
		}
	)}
	onclick={() => {
		if($GlobalStateStore.selectedUnit !== unit) {
			GlobalStateStore.setSelectedUnit(unit as '1' | '2' | '34');
			GlobalStateStore.setSelectedAOS(null);
		}
	}}
>
	<span class="flex">
		<Badge
			class={cn('transition-color bg-primary/50 group-hover:bg-primary', {
				'bg-primary': unit === selectedUnit
			})}
		>
			{FORMATTED_UNITS[unit]}
		</Badge>
	</span>
	<span>{$GlobalStateStore.selectedSubject}</span>
	<span class="flex text-sm text-primary/50">{statistics.totalAOS} areas of study</span>
</button>
