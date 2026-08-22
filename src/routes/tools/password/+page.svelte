<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';

	const SETS = {
		lower: 'abcdefghijklmnopqrstuvwxyz',
		upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		digits: '0123456789',
		symbols: '!@#$%^&*-_=+?'
	};
	const AMBIGUOUS = 'l1IO0o';

	let length = $state(20);
	let count = $state(5);
	let use = $state({ lower: true, upper: true, digits: true, symbols: true });
	let avoidAmbiguous = $state(false);
	let values = $state<string[]>([]);

	const alphabet = $derived.by(() => {
		let chars = '';
		for (const [key, set] of Object.entries(SETS)) {
			if (use[key as keyof typeof use]) chars += set;
		}
		if (avoidAmbiguous) {
			chars = [...chars].filter((c) => !AMBIGUOUS.includes(c)).join('');
		}
		return chars;
	});

	function pick(chars: string): string {
		const limit = Math.floor(256 / chars.length) * chars.length;
		const buffer = new Uint8Array(1);
		let value: number;
		do {
			crypto.getRandomValues(buffer);
			value = buffer[0];
		} while (value >= limit);
		return chars[value % chars.length];
	}

	function generate() {
		if (!alphabet) {
			values = [];
			return;
		}
		const size = Math.min(Math.max(Math.trunc(length) || 8, 4), 256);
		const n = Math.min(Math.max(Math.trunc(count) || 1, 1), 50);
		values = Array.from({ length: n }, () =>
			Array.from({ length: size }, () => pick(alphabet)).join('')
		);
	}

	const entropy = $derived(alphabet ? Math.round(length * Math.log2(alphabet.length)) : 0);
	const strength = $derived(
		entropy >= 128
			? { label: 'Excellent', color: 'var(--ok)' }
			: entropy >= 80
				? { label: 'Strong', color: 'var(--ok)' }
				: entropy >= 60
					? { label: 'Reasonable', color: 'var(--warn)' }
					: { label: 'Weak', color: 'var(--destructive)' }
	);

	$effect(() => {
		if (values.length === 0 && alphabet) generate();
	});
</script>

<ToolShell slug="password">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-end gap-x-6 gap-y-4">
			<label class="flex flex-col gap-2">
				<span class="label">Length</span>
				<input
					type="number"
					min="4"
					max="256"
					bind:value={length}
					oninput={generate}
					class="h-9 w-24 rounded-md border border-line bg-bg px-3 font-mono text-sm text-fg focus-visible:border-brand"
				/>
			</label>
			<label class="flex flex-col gap-2">
				<span class="label">How many</span>
				<input
					type="number"
					min="1"
					max="50"
					bind:value={count}
					oninput={generate}
					class="h-9 w-24 rounded-md border border-line bg-bg px-3 font-mono text-sm text-fg focus-visible:border-brand"
				/>
			</label>
			<div class="flex items-center gap-2">
				<Button variant="brand" size="lg" onclick={generate}>
					<RefreshCw />
					Generate
				</Button>
				<CopyButton value={values.join('\n')} label="Copy all" />
			</div>
		</div>

		<fieldset class="flex flex-wrap items-center gap-x-6 gap-y-3">
			<legend class="mb-2 w-full label">Characters</legend>
			{#each Object.keys(SETS) as key (key)}
				<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
					<input
						type="checkbox"
						checked={use[key as keyof typeof use]}
						onchange={(e) => {
							use = { ...use, [key]: e.currentTarget.checked };
							generate();
						}}
						class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
					/>
					{key[0].toUpperCase() + key.slice(1)}
				</label>
			{/each}
			<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
				<input
					type="checkbox"
					bind:checked={avoidAmbiguous}
					onchange={generate}
					class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
				/>
				Avoid lookalikes
				<span class="font-mono text-xs text-fg-subtle">l1IO0o</span>
			</label>
		</fieldset>

		{#if alphabet}
			<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 panel p-4">
				<span class="flex items-center gap-2 text-sm font-medium" style:color={strength.color}>
					<span class="size-1.5 rounded-full" style:background-color={strength.color}></span>
					{strength.label}
				</span>
				<span class="text-sm text-fg-muted">
					about <span class="font-mono tnum text-fg">{entropy}</span> bits of entropy, from an
					alphabet of <span class="font-mono tnum text-fg">{alphabet.length}</span> characters
				</span>
			</div>

			<div class="ruled">
				{#each values as value, i (i)}
					<div class="flex items-center justify-between gap-4 p-3 pl-4">
						<code class="font-mono text-sm break-all text-fg">{value}</code>
						<CopyButton {value} label="Copy" class="opacity-70 hover:opacity-100" />
					</div>
				{/each}
			</div>
		{:else}
			<p class="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
				Select at least one character set.
			</p>
		{/if}
	</div>
</ToolShell>
