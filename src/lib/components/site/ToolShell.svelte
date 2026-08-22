<script lang="ts">
	import type { Snippet } from 'svelte';
	import { base } from '$app/paths';
	import { tools, toolBySlug } from '$lib/data/tools';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { slug, children }: { slug: string; children: Snippet } = $props();

	const tool = $derived(toolBySlug(slug));
	const others = $derived.by(() => {
		const index = tools.findIndex((t) => t.slug === slug);
		if (index === -1) return tools.slice(0, 4);
		return [...tools.slice(index + 1), ...tools.slice(0, index)].slice(0, 4);
	});
</script>

<svelte:head>
	<title>{tool ? `${tool.name} at Wicked Softworks` : 'Tools at Wicked Softworks'}</title>
	{#if tool}
		<meta name="description" content={tool.blurb} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
	<a
		href="{base}/tools"
		class="group inline-flex items-center gap-1.5 rounded-sm text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
	>
		<ArrowLeft class="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
		All tools
	</a>

	{#if tool}
		<header class="mt-6 flex flex-col gap-3 border-b border-line pb-8">
			<h1 class="text-3xl font-semibold tracking-tight text-fg">{tool.name}</h1>
			<p class="max-w-2xl text-base leading-relaxed text-fg-muted">{tool.blurb}</p>
			{#if !tool.server}
				<p class="text-xs text-fg-subtle">
					Runs entirely in your browser. Nothing you type here is sent anywhere.
				</p>
			{/if}
		</header>
	{/if}

	<div class="py-8 sm:py-10">
		{@render children()}
	</div>

	<footer class="border-t border-line pt-8">
		<h2 class="mb-4 label">More tools</h2>
		<div class="ruled-fill-2 ruled sm:grid-cols-2">
			{#each others as other (other.slug)}
				{@const Icon = other.icon}
				<a
					href="{base}/tools/{other.slug}"
					class="flex items-start gap-3 p-4 transition-colors duration-150 hover:bg-surface-2"
				>
					<Icon class="mt-0.5 size-4 shrink-0 text-fg-subtle" />
					<span class="flex min-w-0 flex-col gap-1">
						<span class="text-sm font-medium text-fg">{other.name}</span>
						<span class="text-xs leading-relaxed text-fg-muted">{other.blurb}</span>
					</span>
				</a>
			{/each}
		</div>
	</footer>
</div>
