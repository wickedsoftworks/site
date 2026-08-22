<script lang="ts">
	import {
		projects,
		STATUS_LABEL,
		STATUS_DOT,
		GITHUB_ORG,
		type ProjectStatus
	} from '$lib/data/site';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import ProjectCard from '$lib/components/site/ProjectCard.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Github from '$lib/components/site/GithubIcon.svelte';
	const order: ProjectStatus[] = ['active', 'seeking', 'paused', 'shipped', 'planned'];

	const ordered = $derived(
		[...projects].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
	);

	const counts = $derived(
		order
			.map((status) => ({
				status,
				label: STATUS_LABEL[status],
				count: projects.filter((p) => p.status === status).length
			}))
			.filter((row) => row.count > 0)
	);
</script>

<svelte:head>
	<title>Projects @ Wicked Softworks</title>
	<meta
		name="description"
		content="All our projects, their status, and where the code lives."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
	<PageHeader
		title="Projects"
		lead="All of our projects. Projects stay listed through their whole life, whether they are active, looking for contributors, paused or shipped."
	>
		{#snippet actions()}
			<Button href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" variant="brand" size="lg">
				<Github />
				GitHub organization
			</Button>
		{/snippet}
	</PageHeader>

	<div class="flex flex-wrap items-center gap-x-6 gap-y-3 py-8">
		{#each counts as row (row.status)}
			<div class="flex items-center gap-2">
				<span
					class="size-1.5 shrink-0 rounded-full"
					style:background-color={STATUS_DOT[row.status]}
					aria-hidden="true"
				></span>
				<span class="tnum text-sm font-medium text-fg">{row.count}</span>
				<span class="text-sm text-fg-muted">{row.label}</span>
			</div>
		{/each}
	</div>

	<div class="ruled-fill-2 ruled sm:grid-cols-2">
		{#each ordered as project (project.name)}
			<ProjectCard {project} />
		{/each}
	</div>

	<section
		class="mt-16 flex flex-col gap-5 panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
	>
		<div class="flex max-w-lg flex-col gap-2">
			<h2 class="text-lg font-semibold tracking-tight text-fg">Want to pick something up?</h2>
			<p class="text-sm leading-relaxed text-fg-muted">
				Anything marked <span class="text-fg">Seeking contributors</span> is open. Start on GitHub, or
				propose something new.
			</p>
		</div>
		<Button
			href={GITHUB_ORG}
			target="_blank"
			rel="noopener noreferrer"
			variant="brand"
			size="lg"
			class="shrink-0 self-start"
		>
			<Github />
			Open GitHub
		</Button>
	</section>
</div>
