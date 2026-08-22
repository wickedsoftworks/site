<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import RefreshCw from '@lucide/svelte/icons/refresh-cw';

	type Version = 'v4' | 'v7';

	let version = $state<Version>('v4');
	let count = $state(5);
	let uppercase = $state(false);
	let hyphens = $state(true);
	let values = $state<string[]>([]);

	/** Random v4, from the platform generator where available. */
	function v4(): string {
		if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return format(bytes);
	}

	/**
	 * v7: 48-bit big-endian Unix milliseconds, then version/variant bits, then
	 * random. Sorts lexicographically by creation time, which is why it is worth
	 * having next to v4, because it makes a far better database key.
	 */
	function v7(): string {
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		const ms = BigInt(Date.now());
		for (let i = 0; i < 6; i++) {
			bytes[i] = Number((ms >> BigInt(8 * (5 - i))) & 0xffn);
		}
		bytes[6] = (bytes[6] & 0x0f) | 0x70;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		return format(bytes);
	}

	function format(bytes: Uint8Array): string {
		const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
		return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	}

	function generate() {
		const n = Math.min(Math.max(Math.trunc(count) || 1, 1), 1000);
		values = Array.from({ length: n }, () => (version === 'v4' ? v4() : v7()));
	}

	const shown = $derived(
		values.map((value) => {
			const withHyphens = hyphens ? value : value.replaceAll('-', '');
			return uppercase ? withHyphens.toUpperCase() : withHyphens;
		})
	);
	const all = $derived(shown.join('\n'));

	// A page that opens empty makes you press a button to see what it does.
	$effect(() => {
		if (values.length === 0) generate();
	});
</script>

<ToolShell slug="uuid">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-end gap-x-6 gap-y-4">
			<fieldset class="flex flex-col gap-2">
				<legend class="mb-2 label">Version</legend>
				<div class="flex items-center gap-1 rounded-md border border-line p-1">
					{#each ['v4', 'v7'] as const as option (option)}
						<button
							type="button"
							onclick={() => {
								version = option;
								generate();
							}}
							aria-pressed={version === option}
							class="cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors duration-150
							       {version === option
								? 'bg-brand text-brand-fg'
								: 'text-fg-muted hover:bg-surface-2 hover:text-fg'}"
						>
							{option}
						</button>
					{/each}
				</div>
			</fieldset>

			<label class="flex flex-col gap-2">
				<span class="label">How many</span>
				<input
					type="number"
					min="1"
					max="1000"
					bind:value={count}
					oninput={generate}
					class="h-9 w-28 rounded-md border border-line bg-bg px-3 font-mono text-sm text-fg
					       focus-visible:border-brand"
				/>
			</label>

			<label class="flex cursor-pointer items-center gap-2 pb-2 text-sm text-fg-muted">
				<input
					type="checkbox"
					bind:checked={hyphens}
					class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
				/>
				Hyphens
			</label>

			<label class="flex cursor-pointer items-center gap-2 pb-2 text-sm text-fg-muted">
				<input
					type="checkbox"
					bind:checked={uppercase}
					class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
				/>
				Uppercase
			</label>

			<div class="flex items-center gap-2 pb-0.5">
				<Button variant="brand" size="lg" onclick={generate}>
					<RefreshCw />
					Generate
				</Button>
				<CopyButton value={all} label="Copy all" />
			</div>
		</div>

		<p class="text-sm leading-relaxed text-fg-muted">
			{#if version === 'v4'}
				Version 4 is 122 random bits. Use it when you want an identifier that reveals nothing.
			{:else}
				Version 7 puts a millisecond timestamp in the leading bits, so these sort in creation order
				as plain text. That makes them far kinder to database indexes than v4.
			{/if}
		</p>

		<div class="ruled">
			{#each shown as value, i (i)}
				<div class="flex items-center justify-between gap-4 p-3 pl-4">
					<code class="font-mono text-sm break-all text-fg">{value}</code>
					<CopyButton {value} label="Copy" class="opacity-70 hover:opacity-100" />
				</div>
			{/each}
		</div>
	</div>
</ToolShell>
