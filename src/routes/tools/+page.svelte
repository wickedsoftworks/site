<script lang="ts">
	import { base } from '$app/paths';
	import { tools } from '$lib/data/tools';
	import PageHeader from '$lib/components/site/PageHeader.svelte';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
</script>

<svelte:head>
	<title>Tools at Wicked Softworks</title>
	<meta
		name="description"
		content="Small developer utilities: UUIDs, Base64, hashing, JWT decoding, QR codes and more. Free, no sign-up, and almost all of them run entirely in your browser."
	/>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
	<PageHeader
		title="Tools"
		lead="Small utilities we kept needing and got tired of looking up. No sign-up, no adverts, and every one of them except the IP lookup runs entirely in your browser, so nothing you paste is sent anywhere."
	/>

	<div class="ruled-fill-3 mt-12 ruled sm:grid-cols-2 lg:grid-cols-3">
		{#each tools as tool (tool.slug)}
			{@const Icon = tool.icon}
			<a
				href="{base}/tools/{tool.slug}"
				class="group flex flex-col gap-3 p-5 transition-colors duration-150 hover:bg-surface-2 sm:p-6"
			>
				<Icon
					class="size-5 text-fg-subtle transition-colors duration-150 group-hover:text-brand-text"
				/>
				<span class="flex items-center gap-1.5 text-[0.9375rem] font-medium text-fg">
					{tool.name}
					<ArrowUpRight
						class="size-3.5 shrink-0 text-fg-subtle transition-colors duration-150 group-hover:text-brand-text"
					/>
				</span>
				<span class="text-sm leading-relaxed text-fg-muted">{tool.blurb}</span>
			</a>
		{/each}
	</div>
</div>
