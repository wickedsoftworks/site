<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let client = $state<{ label: string; value: string }[]>([]);

	$effect(() => {
		const nav = navigator as Navigator & {
			deviceMemory?: number;
			userAgentData?: { platform?: string };
		};
		const rows: { label: string; value: string }[] = [
			{ label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Unknown' },
			{
				label: 'Languages',
				value: navigator.languages?.join(', ') || navigator.language || 'Unknown'
			},
			{ label: 'Screen', value: `${screen.width}×${screen.height} @ ${devicePixelRatio}×` },
			{ label: 'Viewport', value: `${innerWidth}×${innerHeight}` },
			{ label: 'Platform', value: nav.userAgentData?.platform || navigator.platform || 'Unknown' },
			{ label: 'CPU threads', value: String(navigator.hardwareConcurrency ?? 'Unknown') },
			{ label: 'Do Not Track', value: navigator.doNotTrack === '1' ? 'Enabled' : 'Not set' },
			{ label: 'Cookies', value: navigator.cookieEnabled ? 'Enabled' : 'Blocked' }
		];
		if (nav.deviceMemory) rows.push({ label: 'Device memory', value: `${nav.deviceMemory} GB` });
		client = rows;
	});
</script>

<ToolShell slug="ip">
	<div class="flex flex-col gap-10">
		<!-- The headline answer. -->
		<section class="flex flex-col gap-3">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-sm font-medium text-fg">Your address</h2>
				<CopyButton value={data.address} label="Copy address" />
			</div>
			<div class="flex flex-col gap-2 panel p-5 sm:p-6">
				{#if data.address}
					<code class="font-mono text-xl break-all text-fg sm:text-2xl">{data.address}</code>
					<span class="text-sm text-fg-muted">{data.family} · {data.kind}</span>
				{:else}
					<span class="text-sm text-fg-muted">
						This deployment could not determine your address. That usually means the site is being
						served statically, without a server runtime to read the connection.
					</span>
				{/if}
			</div>
		</section>

		{#if data.forwarding.length > 0}
			<section class="flex flex-col gap-3">
				<h2 class="text-sm font-medium text-fg">Proxy headers</h2>
				<p class="text-sm leading-relaxed text-fg-muted">
					Your request passed through a proxy or CDN. These headers are what it added, and they are
					where the address above came from.
				</p>
				<dl class="ruled">
					{#each data.forwarding as row (row.name)}
						<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
							<dt class="font-mono text-xs text-fg-subtle">{row.name}</dt>
							<dd class="font-mono text-xs break-all text-fg-muted">{row.value}</dd>
						</div>
					{/each}
				</dl>
			</section>
		{/if}

		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium text-fg">Request headers</h2>
			<dl class="ruled">
				<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
					<dt class="font-mono text-xs text-fg-subtle">protocol</dt>
					<dd class="font-mono text-xs break-all text-fg-muted">{data.protocol}</dd>
				</div>
				<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
					<dt class="font-mono text-xs text-fg-subtle">host</dt>
					<dd class="font-mono text-xs break-all text-fg-muted">{data.host}</dd>
				</div>
				{#each data.headers as row (row.name)}
					<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
						<dt class="font-mono text-xs text-fg-subtle">{row.name}</dt>
						<dd class="font-mono text-xs break-all text-fg-muted">{row.value}</dd>
					</div>
				{/each}
			</dl>
		</section>

		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium text-fg">What your browser reports</h2>
			<p class="text-sm leading-relaxed text-fg-muted">
				Read in your browser and never sent to us. Any site you visit can read all of it.
			</p>
			{#if client.length > 0}
				<dl class="ruled-fill-2 ruled sm:grid-cols-2">
					{#each client as row (row.label)}
						<div class="flex items-baseline justify-between gap-4 p-4">
							<dt class="text-xs text-fg-subtle">{row.label}</dt>
							<dd class="text-right font-mono text-xs break-all text-fg-muted">{row.value}</dd>
						</div>
					{/each}
				</dl>
			{:else}
				<p class="text-sm text-fg-subtle">Requires JavaScript.</p>
			{/if}
		</section>
	</div>
</ToolShell>
