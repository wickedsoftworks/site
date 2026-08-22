<script lang="ts">
	import type { Project } from '$lib/data/site';
	import StatusDot from './StatusDot.svelte';
	import Placeholder from './Placeholder.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';

	let { project }: { project: Project } = $props();
</script>

<!-- A cell in a ruled grid, not a floating card: the parent draws the hairlines
     so a list of projects reads as one table rather than a scatter of boxes. -->
<svelte:element
	this={project.repo ? 'a' : 'div'}
	href={project.repo ?? undefined}
	target={project.repo ? '_blank' : undefined}
	rel={project.repo ? 'noopener noreferrer' : undefined}
	class="group relative flex flex-col gap-3 p-5 transition-colors duration-150 sm:p-6
	       {project.repo ? 'hover:bg-surface-2' : ''}"
>
	<!-- Stacked on a phone: a long status like "Seeking contributors" beside a
	     wrapping title squeezed both into slivers. -->
	<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
		<h3 class="text-[0.9375rem] leading-snug font-medium text-fg">
			{project.name}
			{#if project.repo}
				<ArrowUpRight
					class="ml-0.5 inline size-3.5 shrink-0 -translate-y-px text-fg-subtle
					       transition-colors duration-150 group-hover:text-brand-text"
				/>
			{/if}
		</h3>
		<StatusDot status={project.status} class="mt-0.5" />
	</div>

	<p class="max-w-prose text-sm leading-relaxed text-fg-muted">
		{project.summary}
	</p>

	<div class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
		{#each project.tech as tech (tech)}
			<span class="font-mono text-xs text-fg-subtle">{tech}</span>
		{/each}
		{#if project.placeholder}
			<Placeholder class="ml-auto" />
		{/if}
	</div>
</svelte:element>
