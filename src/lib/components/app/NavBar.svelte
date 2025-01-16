<script lang="ts">
	import { GlobalStateStore } from '$lib/stores/globalStateStore';
	import SpinnerIcon from 'lucide-svelte/icons/loader-circle';
	import AppIcon from './AppIcon.svelte';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { getSubjectNames } from '$lib/data';

	const subjectNames = $derived($GlobalStateStore.isLoadingData ? [] : getSubjectNames());
	let open = $state<boolean>(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<div class="flex w-full items-center text-white">
	<div class="flex items-center justify-center gap-3">
		<AppIcon class="size-12" />
		<div class="flex w-52 items-center justify-center font-default text-xl">
			VCE Study Design Browser
		</div>

		<Popover.Root bind:open>
			<Popover.Trigger bind:ref={triggerRef}>
				{#snippet child({ props })}
					<Button
						variant="outline"
						class="justify-between bg-primary/20 hover:bg-primary/40"
						{...props}
						role="combobox"
						aria-expanded={open}
					>
						{$GlobalStateStore.selectedSubject || 'Select a VCE subject...'}
						<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="mt-1 w-[200px] p-0">
				<Command.Root>
					<Command.Input placeholder="Search subject..." />
					<Command.List>
						<Command.Empty>No subject found.</Command.Empty>
						<Command.Group>
							{#each subjectNames as name}
								<Command.Item
									value={name}
									onSelect={() => {
										GlobalStateStore.setSelectedSubject(name);
										closeAndFocusTrigger();
									}}
								>
									<Check
										class={cn(
											'mr-2 size-4',
											$GlobalStateStore.selectedSubject !== name && 'text-transparent'
										)}
									/>
									{name}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="ml-auto flex items-center justify-center">
		{#if $GlobalStateStore.isLoadingData}
			<div class="flex gap-2">
				<SpinnerIcon class="animate-spin" />
				Loading study design data...
			</div>
		{/if}
	</div>
</div>
