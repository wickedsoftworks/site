<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import { classify, isAddress } from './classify';
	import { readGpu, type GPU } from './gpu';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let client = $state<{ label: string; value: string }[]>([]);
	let gpu = $state<GPU | null>(null);

	let lookup = $state<{ v4: string; v6: string; done: boolean }>({ v4: '', v6: '', done: false });
	const addresses = $derived(
		[
			{ family: 'IPv6', value: lookup.v6 },
			{ family: 'IPv4', value: lookup.v4 }
		].filter((row) => row.value !== '')
	);
	const primary = $derived(addresses[0]?.value || data.address);

	async function request(url: string, json: boolean): Promise<string> {
		const response = await fetch(url, { signal: AbortSignal.timeout(6000), cache: 'no-store' });
		if (!response.ok) throw new Error(`${response.status}`);
		const address = json
			? (((await response.json()) as { ip?: string }).ip ?? '')
			: await response.text();
		return address.trim();
	}

	async function attempt(url: string, json = true): Promise<string> {
		try {
			const address = await request(url, json);
			return isAddress(address) ? address : '';
		} catch {
			return '';
		}
	}

	async function locate() {
		let [dialled, v4] = await Promise.all([
			attempt('https://api64.ipify.org?format=json'),
			attempt('https://api.ipify.org?format=json')
		]);

		if (!dialled && !v4) {
			dialled = await attempt('https://icanhazip.com', false);
		}

		const v6 = dialled.includes(':') ? dialled : '';
		lookup = { v4: v4 || (v6 ? '' : dialled), v6, done: true };
	}

	$effect(() => {
		void locate();
	});

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

	$effect(() => {
		gpu = readGpu();
	});
</script>

<ToolShell slug="ip">
	<div class="flex flex-col gap-10">
		<!-- The headline answer. -->
		<section class="flex flex-col gap-3">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="text-sm font-medium text-fg">Your address</h2>
				<CopyButton value={primary} label="Copy address" />
			</div>
			<div class="flex flex-col gap-4 panel p-5 sm:p-6">
				{#if addresses.length > 0}
					{#each addresses as row (row.family)}
						<div class="flex flex-col gap-1">
							<code class="font-mono text-xl break-all text-fg sm:text-2xl">{row.value}</code>
							<span class="text-sm text-fg-muted">{row.family} · {classify(row.value)}</span>
						</div>
					{/each}
				{:else if data.address}
					<div class="flex flex-col gap-1">
						<code class="font-mono text-xl break-all text-fg sm:text-2xl">{data.address}</code>
						<span class="text-sm text-fg-muted">{data.family} · {data.kind}</span>
					</div>
				{:else if !lookup.done}
					<span class="text-sm text-fg-subtle">Looking up your address…</span>
				{:else}
					<span class="text-sm text-fg-muted">
						Your address could not be determined. A VPN, an extension blocking outbound lookups, or
						a network that filters them will all do this.
					</span>
				{/if}
			</div>
			{#if addresses.length > 0}
				<p class="text-sm leading-relaxed text-fg-muted">
					Measured by asking an outside service what address your browser arrives from, so the CDN
					and hosting nodes in front of this site are not mistaken for you.
				</p>
			{:else if data.address && lookup.done}
				<p class="text-sm leading-relaxed text-fg-muted">
					The outside lookup did not answer, so this is the address our server was told about
					instead. A proxy between you and us can change it.
				</p>
			{/if}
		</section>

		{#if data.forwarding.length > 0 || data.peer}
			<section class="flex flex-col gap-3">
				<h2 class="text-sm font-medium text-fg">What our server saw</h2>
				<p class="text-sm leading-relaxed text-fg-muted">
					Your request passed through a proxy or CDN on the way here. These are the headers it
					added, and the edge node the connection actually landed on.
				</p>
				<dl class="ruled">
					{#each data.forwarding as row (row.name)}
						<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
							<dt class="font-mono text-xs text-fg-subtle">{row.name}</dt>
							<dd class="font-mono text-xs break-all text-fg-muted">{row.value}</dd>
						</div>
					{/each}
					{#if data.peer}
						<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
							<dt class="font-mono text-xs text-fg-subtle">connection peer</dt>
							<dd class="font-mono text-xs break-all text-fg-muted">{data.peer}</dd>
						</div>
					{/if}
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

		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium text-fg">What your GPU reports</h2>
			<p class="text-sm leading-relaxed text-fg-muted">
				The renderer string names your exact graphics card and the driver path it draws through. It
				separates you from other visitors far more sharply than anything else on this page —
				alongside your screen size and CPU count it comes close to unique. Read in your browser and
				never sent to us.
			</p>
			{#if gpu === null}
				<p class="text-sm text-fg-subtle">Requires JavaScript.</p>
			{:else if gpu.state === 'ok'}
				<dl class="ruled">
					<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
						<dt class="font-mono text-xs text-fg-subtle">vendor</dt>
						<dd class="font-mono text-xs break-all text-fg-muted">{gpu.vendor}</dd>
					</div>
					<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
						<dt class="font-mono text-xs text-fg-subtle">renderer</dt>
						<dd class="font-mono text-xs break-all text-fg-muted">{gpu.renderer}</dd>
					</div>
					<div class="grid gap-1 p-4 sm:grid-cols-[16rem_1fr] sm:gap-4">
						<dt class="font-mono text-xs text-fg-subtle">webgl</dt>
						<dd class="font-mono text-xs break-all text-fg-muted">{gpu.version}</dd>
					</div>
				</dl>
			{:else if gpu.state === 'masked'}
				<p class="text-sm leading-relaxed text-fg-muted">
					Your browser withholds it. WebGL itself works and reports
					<code class="font-mono text-xs text-fg">{gpu.version}</code>, but the extension that names
					the card is blocked — what Safari, Firefox in resist-fingerprinting mode, and Brave's
					shields all do.
				</p>
			{:else}
				<p class="text-sm leading-relaxed text-fg-muted">
					No WebGL context was available at all, so there is nothing to read. Hardware acceleration
					is off, or something is blocking it.
				</p>
			{/if}
		</section>
	</div>
</ToolShell>
