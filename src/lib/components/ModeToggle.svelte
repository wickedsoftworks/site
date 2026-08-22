<script module>
	export { default as ModeToggle } from './ModeToggle.svelte';
</script>

<script lang="ts">
	import { resetMode, setMode, mode, userPrefersMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Monitor from '@lucide/svelte/icons/monitor';

	const options = [
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'system', label: 'System', icon: Monitor }
	] as const;

	const preference = $derived(userPrefersMode.current ?? 'system');

	function select(value: (typeof options)[number]['value']) {
		if (value === 'system') resetMode();
		else setMode(value);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		aria-label="Colour theme"
		title="Colour theme"
		class="grid size-8 cursor-pointer place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
	>
		<!-- The icon reports what is on screen, not what was chosen: under
		     "System" the user wants to see the resolved theme. -->
		{#if mode.current === 'dark'}
			<Moon class="size-4" />
		{:else}
			<Sun class="size-4" />
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="min-w-36">
		{#each options as option (option.value)}
			{@const Icon = option.icon}
			<DropdownMenu.Item onSelect={() => select(option.value)} class="gap-2">
				<Icon class="size-3.5 text-fg-muted" />
				{option.label}
				{#if preference === option.value}
					<span class="ml-auto size-1.5 rounded-full bg-brand" aria-hidden="true"></span>
					<span class="sr-only">(selected)</span>
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
