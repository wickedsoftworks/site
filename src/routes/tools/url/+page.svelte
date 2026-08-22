<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';

	let mode = $state<'encode' | 'decode' | 'inspect'>('encode');
	let input = $state('');
	/** Component encoding escapes &, =, ? and /; full-URI encoding leaves them. */
	let component = $state(true);

	const converted = $derived.by(() => {
		if (!input) return { ok: true as const, value: '' };
		try {
			if (mode === 'encode') {
				return {
					ok: true as const,
					value: component ? encodeURIComponent(input) : encodeURI(input)
				};
			}
			return {
				ok: true as const,
				value: component ? decodeURIComponent(input) : decodeURI(input)
			};
		} catch {
			return { ok: false as const, value: 'Malformed percent-encoding. Check for a stray %.' };
		}
	});

	const parsed = $derived.by(() => {
		if (mode !== 'inspect' || !input.trim()) return null;
		try {
			const url = new URL(input.trim());
			return {
				parts: [
					{ label: 'protocol', value: url.protocol.replace(':', '') },
					{ label: 'username', value: url.username },
					{ label: 'password', value: url.password ? '••••••' : '' },
					{ label: 'hostname', value: url.hostname },
					{ label: 'port', value: url.port },
					{ label: 'pathname', value: url.pathname },
					{ label: 'hash', value: url.hash.replace('#', '') }
				].filter((part) => part.value),
				query: [...url.searchParams.entries()].map(([key, value]) => ({ key, value }))
			};
		} catch {
			return { error: 'Not a valid absolute URL. Include the scheme, e.g. https://' };
		}
	});
</script>

<ToolShell slug="url">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
			<div class="flex items-center gap-1 rounded-md border border-line p-1">
				{#each [['encode', 'Encode'], ['decode', 'Decode'], ['inspect', 'Inspect']] as const as [value, label] (value)}
					<button
						type="button"
						onclick={() => (mode = value)}
						aria-pressed={mode === value}
						class="cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors duration-150
						       {mode === value
							? 'bg-brand text-brand-fg'
							: 'text-fg-muted hover:bg-surface-2 hover:text-fg'}"
					>
						{label}
					</button>
				{/each}
			</div>

			{#if mode !== 'inspect'}
				<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
					<input
						type="checkbox"
						bind:checked={component}
						class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
					/>
					Component mode
					<span class="text-xs text-fg-subtle">(escapes &amp; = ? /)</span>
				</label>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<span class="label">{mode === 'inspect' ? 'URL' : 'Input'}</span>
			<textarea
				bind:value={input}
				rows="4"
				spellcheck="false"
				placeholder={mode === 'inspect' ? 'https://example.com/path?a=1&b=2' : 'Text or URL…'}
				class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
				       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
			></textarea>
		</div>

		{#if mode === 'inspect'}
			{#if parsed && 'error' in parsed}
				<p class="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
					{parsed.error}
				</p>
			{:else if parsed}
				<div class="flex flex-col gap-2">
					<span class="label">Parts</span>
					<dl class="ruled">
						{#each parsed.parts as part (part.label)}
							<div class="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
								<dt class="font-mono text-xs text-fg-subtle">{part.label}</dt>
								<dd class="font-mono text-xs break-all text-fg-muted">{part.value}</dd>
							</div>
						{/each}
					</dl>
				</div>
				{#if parsed.query.length > 0}
					<div class="flex flex-col gap-2">
						<span class="label">Query parameters</span>
						<dl class="ruled">
							{#each parsed.query as param, i (i)}
								<div class="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
									<dt class="font-mono text-xs text-fg-subtle">{param.key}</dt>
									<dd class="font-mono text-xs break-all text-fg-muted">{param.value}</dd>
								</div>
							{/each}
						</dl>
					</div>
				{/if}
			{/if}
		{:else}
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span class="label">Result</span>
					<CopyButton value={converted.ok ? converted.value : ''} />
				</div>
				<div
					class="min-h-24 w-full rounded-md border p-3 font-mono text-sm break-all
					       {converted.ok ? 'border-line bg-surface text-fg' : 'border-destructive/40 text-destructive'}"
					aria-live="polite"
				>
					{converted.value}
				</div>
			</div>
		{/if}
	</div>
</ToolShell>
