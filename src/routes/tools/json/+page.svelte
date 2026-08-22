<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import Check from '@lucide/svelte/icons/check';

	let input = $state('');
	let indent = $state<'2' | '4' | 'tab' | 'min'>('2');
	let sortKeys = $state(false);

	function sortDeep(value: unknown): unknown {
		if (Array.isArray(value)) return value.map(sortDeep);
		if (value && typeof value === 'object') {
			return Object.fromEntries(
				Object.entries(value as Record<string, unknown>)
					.sort(([a], [b]) => a.localeCompare(b))
					.map(([key, inner]) => [key, sortDeep(inner)])
			);
		}
		return value;
	}

	const result = $derived.by(() => {
		const raw = input.trim();
		if (!raw) return null;
		try {
			const parsed = JSON.parse(raw);
			const value = sortKeys ? sortDeep(parsed) : parsed;
			const space = indent === 'tab' ? '\t' : indent === 'min' ? 0 : Number(indent);
			return { ok: true as const, value: JSON.stringify(value, null, space), parsed };
		} catch (error) {
			return { ok: false as const, message: (error as Error).message };
		}
	});

	/** A quick shape summary is more useful than a bare "valid" tick. */
	const summary = $derived.by(() => {
		if (!result?.ok) return '';
		const value = result.parsed;
		if (Array.isArray(value)) return `Array · ${value.length} items`;
		if (value === null) return 'null';
		if (typeof value === 'object') return `Object · ${Object.keys(value).length} keys`;
		return typeof value;
	});
</script>

<ToolShell slug="json">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
			<div class="flex items-center gap-1 rounded-md border border-line p-1">
				{#each [['2', '2 spaces'], ['4', '4 spaces'], ['tab', 'Tabs'], ['min', 'Minify']] as const as [value, label] (value)}
					<button
						type="button"
						onclick={() => (indent = value)}
						aria-pressed={indent === value}
						class="cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors duration-150
						       {indent === value
							? 'bg-brand text-brand-fg'
							: 'text-fg-muted hover:bg-surface-2 hover:text-fg'}"
					>
						{label}
					</button>
				{/each}
			</div>

			<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
				<input
					type="checkbox"
					bind:checked={sortKeys}
					class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
				/>
				Sort keys
			</label>
		</div>

		<div class="flex flex-col gap-2">
			<span class="label">Input</span>
			<textarea
				bind:value={input}
				rows="10"
				spellcheck="false"
				placeholder={'{ "hello": "world" }'}
				class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
				       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
			></textarea>
		</div>

		{#if result && !result.ok}
			<div class="flex flex-col gap-1 rounded-md border border-destructive/40 p-4">
				<span class="text-sm font-medium text-destructive">Invalid JSON</span>
				<span class="font-mono text-xs text-fg-muted">{result.message}</span>
			</div>
		{:else if result}
			<div class="flex flex-col gap-2">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<span class="flex items-center gap-2 text-sm text-fg-muted">
						<Check class="size-4 text-ok" />
						Valid · {summary}
					</span>
					<CopyButton value={result.value} label="Copy output" />
				</div>
				<pre
					class="max-h-[32rem] overflow-auto rounded-md border border-line bg-surface p-3 font-mono text-xs text-fg">{result.value}</pre>
			</div>
		{/if}
	</div>
</ToolShell>
