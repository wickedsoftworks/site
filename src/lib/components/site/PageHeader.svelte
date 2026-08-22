<script lang="ts">
	import type { Snippet } from 'svelte';

	let { title, lead, actions }: { title: string; lead: string; actions?: Snippet } = $props();
</script>

<header class="flex flex-col gap-6 border-b border-line pb-10 sm:pb-12">
	<div class="flex flex-col gap-4">
		<h1 class="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
			{title}
		</h1>
		<p class="max-w-2xl text-base leading-relaxed text-fg-muted">
			{lead}
		</p>
	</div>
	{#if actions}
		<div class="flex flex-wrap items-center gap-3">
			{@render actions()}
		</div>
	{/if}
</header>
