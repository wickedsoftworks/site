<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';

	const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

	let input = $state('');
	let uppercase = $state(false);
	let digests = $state<{ algorithm: string; hex: string }[]>([]);

	async function hash(algorithm: string, text: string): Promise<string> {
		const bytes = new TextEncoder().encode(text);
		const buffer = await crypto.subtle.digest(algorithm, bytes);
		return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	$effect(() => {
		const text = input;
		let cancelled = false;
		if (!text) {
			digests = [];
			return;
		}
		Promise.all(
			ALGORITHMS.map(async (algorithm) => ({ algorithm, hex: await hash(algorithm, text) }))
		).then((result) => {
			if (!cancelled) digests = result;
		});
		return () => {
			cancelled = true;
		};
	});

	const shown = $derived(
		digests.map((d) => ({ ...d, hex: uppercase ? d.hex.toUpperCase() : d.hex }))
	);
</script>

<ToolShell slug="hash">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between gap-4">
				<span class="label">Input</span>
				<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
					<input
						type="checkbox"
						bind:checked={uppercase}
						class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
					/>
					Uppercase
				</label>
			</div>
			<textarea
				bind:value={input}
				rows="6"
				spellcheck="false"
				placeholder="Type or paste anything…"
				class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
				       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
			></textarea>
		</div>

		{#if shown.length > 0}
			<div class="flex flex-col gap-3">
				{#each shown as digest (digest.algorithm)}
					<div class="flex flex-col gap-2 panel p-4">
						<div class="flex items-center justify-between gap-4">
							<span class="font-mono text-xs font-medium text-fg">{digest.algorithm}</span>
							<CopyButton value={digest.hex} />
						</div>
						<code class="font-mono text-sm break-all text-fg-muted">{digest.hex}</code>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-sm text-fg-subtle">Digests appear as you type.</p>
		{/if}

		<p class="max-w-2xl text-sm leading-relaxed text-fg-muted">
			SHA-1 is here because you will still meet it in Git and in old systems. It is
			<span class="text-fg">broken for anything security-related</span>, so do not use it to sign or
			verify anything new.
		</p>
	</div>
</ToolShell>
