<script lang="ts">
	import { resolve, base } from '$app/paths';
	import { projects, GITHUB_ORG } from '$lib/data/site';
	import { members } from '$lib/data/members';
	import { tools } from '$lib/data/tools';
	import ProjectCard from '$lib/components/site/ProjectCard.svelte';
	import Placeholder from '$lib/components/site/Placeholder.svelte';
	import Avatar from '$lib/components/site/Avatar.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Github from '$lib/components/site/GithubIcon.svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	const featured = $derived(projects.slice(0, 4));
	const featuredTools = $derived(tools.slice(0, 6));
</script>

<svelte:head>
	<title>Wicked Softworks: an open-source developer collective</title>
	<meta
		name="description"
		content="Wicked Softworks is an open-source developer collective. Everything we build is public: the projects, the people who make them, and the tools we use."
	/>
</svelte:head>

<section class="border-b border-line px-4 sm:px-6">
	<div class="mx-auto flex max-w-3xl flex-col items-center py-20 text-center sm:py-28">
		<img src="/logo.png" alt="" class="mb-8 size-16 object-contain sm:size-20" />

		<h1
			class="text-[clamp(2.25rem,7vw,4.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-fg"
		>
			We build software<br />
			<span class="brand-phrase">for everyone.</span>
		</h1>

		<p class="mt-6 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
			Wicked Softworks is a group of new developers focusing on providing useful and polished
			applications.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<Button href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" variant="brand" size="xl">
				<Github />
				View on GitHub
			</Button>
			<Button href={resolve('/projects')} variant="outline" size="xl">
				Browse projects
				<ArrowRight />
			</Button>
		</div>
	</div>
</section>

<div class="mx-auto max-w-6xl px-4 sm:px-6">
	<!-- ========================================================================
	     PROJECTS
	     ======================================================================== -->
	<section class="py-16 sm:py-20">
		<div class="mb-8 flex items-end justify-between gap-6">
			<div class="flex flex-col gap-2">
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Projects</h2>
				<p class="text-sm leading-relaxed text-fg-muted">
					What the collective is building, and where the code lives.
				</p>
			</div>
			<a
				href={resolve('/projects')}
				class="group flex shrink-0 items-center gap-1.5 rounded-sm text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
			>
				All projects
				<ArrowRight
					class="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="ruled-fill-2 ruled sm:grid-cols-2">
			{#each featured as project (project.name)}
				<ProjectCard {project} />
			{/each}
		</div>
	</section>

	<!-- ========================================================================
	     MEMBERS
	     ======================================================================== -->
	<section class="border-t border-line py-16 sm:py-20">
		<div class="mb-8 flex items-end justify-between gap-6">
			<div class="flex flex-col gap-2">
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Members</h2>
				<p class="text-sm leading-relaxed text-fg-muted">
					The people who build it. {members.length} and counting.
				</p>
			</div>
			<a
				href={resolve('/members')}
				class="group flex shrink-0 items-center gap-1.5 rounded-sm text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
			>
				All members
				<ArrowRight
					class="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<!-- Faces link straight to the directory; the profile dialog lives there
		     rather than being duplicated on the home page. -->
		<a
			href={resolve('/members')}
			class="flex flex-wrap items-center gap-x-3 gap-y-4 rounded-md px-1 py-2 transition-colors duration-150 hover:bg-surface-2"
		>
			{#each members as member (member.id)}
				<span class="flex flex-col items-center gap-2" style:width="7rem">
					<Avatar {member} size={56} />
					<span class="text-center text-xs text-balance text-fg-muted">{member.name}</span>
				</span>
			{/each}
		</a>
	</section>

	<!-- ========================================================================
	     TOOLS
	     ======================================================================== -->
	<section class="border-t border-line py-16 sm:py-20">
		<div class="mb-8 flex items-end justify-between gap-6">
			<div class="flex flex-col gap-2">
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Tools</h2>
				<p class="text-sm leading-relaxed text-fg-muted">
					Small utilities, free and without sign-up. Most run entirely in your browser.
				</p>
			</div>
			<a
				href={resolve('/tools')}
				class="group flex shrink-0 items-center gap-1.5 rounded-sm text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
			>
				All {tools.length}
				<ArrowRight
					class="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
				/>
			</a>
		</div>

		<div class="ruled-fill-3 ruled sm:grid-cols-2 lg:grid-cols-3">
			{#each featuredTools as tool (tool.slug)}
				{@const Icon = tool.icon}
				<a
					href="{base}/tools/{tool.slug}"
					class="group flex items-start gap-3 p-5 transition-colors duration-150 hover:bg-surface-2"
				>
					<Icon
						class="mt-0.5 size-4 shrink-0 text-fg-subtle transition-colors duration-150 group-hover:text-brand-text"
					/>
					<span class="flex min-w-0 flex-col gap-1">
						<span class="text-sm font-medium text-fg">{tool.name}</span>
						<span class="text-sm leading-relaxed text-fg-muted">{tool.blurb}</span>
					</span>
				</a>
			{/each}
		</div>
	</section>

	<!-- ========================================================================
	     CLOSE: the honest note about what is still standing in.
	     ======================================================================== -->
	<section class="border-t border-line py-16 sm:py-20">
		<div
			class="flex flex-col gap-6 panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
		>
			<div class="flex max-w-xl flex-col gap-2">
				<div class="flex flex-wrap items-center gap-3">
					<h2 class="text-lg font-semibold tracking-tight text-fg">Not real yet</h2>
					<Placeholder />
				</div>
				<p class="text-sm leading-relaxed text-fg-muted">
					Every project and member above is standing in for content that does not exist yet, and is
					marked as such. Projects live in
					<code class="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-fg"
						>src/lib/data/site.ts</code
					>
					and members in
					<code class="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-xs text-fg"
						>src/lib/data/members.json</code
					>. The tools are real and working.
				</p>
			</div>
			<Button href={resolve('/tools')} variant="outline" size="lg" class="shrink-0 self-start">
				Try the tools
				<ArrowRight />
			</Button>
		</div>
	</section>
</div>
