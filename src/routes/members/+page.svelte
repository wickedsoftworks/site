<script lang="ts">
	import { members } from '$lib/data/members';
	import type { MemberView } from '$lib/data/members';
	import { GITHUB_ORG } from '$lib/data/site';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import Avatar from '$lib/components/site/Avatar.svelte';
	import MemberDialog from '$lib/components/site/MemberDialog.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Github from '$lib/components/site/GithubIcon.svelte';

	let selected = $state<MemberView | null>(null);
	let open = $state(false);

	function show(member: MemberView) {
		selected = member;
		open = true;
	}
</script>

<svelte:head>
	<title>Members at Wicked Softworks</title>
	<meta name="description" content="The people who build Wicked Softworks." />
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
	<PageHeader
		title="Members"
		lead="The people who make up the collective. Select anyone to see what they work on and where to find them."
	>
		{#snippet actions()}
			<Button href={GITHUB_ORG} target="_blank" rel="noopener noreferrer" variant="brand" size="lg">
				<Github />
				GitHub organization
			</Button>
		{/snippet}
	</PageHeader>

	<!-- An avatar wall, not a ruled table: faces are the content here, and rules
	     between them would fight the circles. -->
	<ul class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-x-2 gap-y-6 py-12 sm:gap-y-8">
		{#each members as member (member.id)}
			<li>
				<button
					type="button"
					onclick={() => show(member)}
					class="group flex h-full w-full flex-col items-center gap-3 rounded-md px-2 py-3
					       transition-colors duration-150 hover:bg-surface-2"
				>
					<Avatar
						{member}
						size={64}
						class="transition-transform duration-150 group-hover:-translate-y-0.5"
					/>
					<!-- Names wrap rather than truncate: a directory whose whole job is
					     naming people should not cut the names off. -->
					<span class="flex w-full flex-col items-center gap-0.5">
						<span class="text-center text-sm font-medium text-balance text-fg">
							{member.name}
						</span>
						<span class="text-center text-xs text-balance text-fg-subtle">
							{member.role}
						</span>
					</span>
				</button>
			</li>
		{/each}
	</ul>

	<section
		class="flex flex-col gap-5 panel p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
	>
		<div class="flex max-w-lg flex-col gap-2">
			<h2 class="text-lg font-semibold tracking-tight text-fg">Want to join?</h2>
			<p class="text-sm leading-relaxed text-fg-muted">
				The collective runs in the open. Contributions arrive through the repositories, and people
				end up on this page by keeping at it.
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

<MemberDialog member={selected} bind:open />
