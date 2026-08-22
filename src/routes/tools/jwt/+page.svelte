<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';

	let token = $state('');

	function decodeSegment(segment: string): unknown {
		let normalized = segment.replaceAll('-', '+').replaceAll('_', '/');
		if (normalized.length % 4 !== 0) {
			normalized = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), '=');
		}
		const binary = atob(normalized);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes));
	}

	/** Claims that carry a Unix timestamp, so they can be shown as real dates. */
	const TIME_CLAIMS = new Set(['exp', 'iat', 'nbf', 'auth_time', 'updated_at']);

	const decoded = $derived.by(() => {
		const raw = token.trim();
		if (!raw) return null;
		const parts = raw.split('.');
		if (parts.length !== 3) {
			return { error: 'A JWT has three dot-separated parts. This has ' + parts.length + '.' };
		}
		try {
			return {
				header: decodeSegment(parts[0]) as Record<string, unknown>,
				payload: decodeSegment(parts[1]) as Record<string, unknown>,
				signature: parts[2]
			};
		} catch {
			return { error: 'The header or payload is not valid Base64url-encoded JSON.' };
		}
	});

	const claims = $derived.by(() => {
		if (!decoded || 'error' in decoded) return [];
		return Object.entries(decoded.payload).map(([key, value]) => {
			const isTime = TIME_CLAIMS.has(key) && typeof value === 'number';
			return {
				key,
				value: typeof value === 'object' ? JSON.stringify(value) : String(value),
				when: isTime ? new Date((value as number) * 1000).toISOString().replace('T', ' ') : '',
				expired: key === 'exp' && typeof value === 'number' && value * 1000 < Date.now()
			};
		});
	});

	const pretty = (value: unknown) => JSON.stringify(value, null, 2);
</script>

<ToolShell slug="jwt">
	<div class="flex flex-col gap-6">
		<div
			class="flex items-start gap-3 rounded-md border border-warn/40 bg-warn/5 p-4 text-sm leading-relaxed text-fg-muted"
		>
			<TriangleAlert class="mt-0.5 size-4 shrink-0 text-warn" />
			<p>
				This decodes a token; it does <span class="text-fg">not</span> verify the signature. Anyone can
				read a JWT's contents, so never put a secret in one, and never trust a payload you have not verified
				server-side.
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<span class="label">Token</span>
			<textarea
				bind:value={token}
				rows="5"
				spellcheck="false"
				placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…"
				class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
				       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
			></textarea>
		</div>

		{#if decoded && 'error' in decoded}
			<p class="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
				{decoded.error}
			</p>
		{:else if decoded}
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-4">
						<span class="label">Header</span>
						<CopyButton value={pretty(decoded.header)} />
					</div>
					<pre
						class="overflow-x-auto rounded-md border border-line bg-surface p-3 font-mono text-xs text-fg">{pretty(
							decoded.header
						)}</pre>
				</div>
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between gap-4">
						<span class="label">Payload</span>
						<CopyButton value={pretty(decoded.payload)} />
					</div>
					<pre
						class="overflow-x-auto rounded-md border border-line bg-surface p-3 font-mono text-xs text-fg">{pretty(
							decoded.payload
						)}</pre>
				</div>
			</div>

			{#if claims.length > 0}
				<div class="flex flex-col gap-2">
					<span class="label">Claims</span>
					<dl class="ruled">
						{#each claims as claim (claim.key)}
							<div class="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
								<dt class="font-mono text-xs text-fg-subtle">{claim.key}</dt>
								<dd class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<span class="font-mono text-xs break-all text-fg-muted">{claim.value}</span>
									{#if claim.when}
										<span class="text-xs {claim.expired ? 'text-destructive' : 'text-fg-subtle'}">
											{claim.when} UTC{claim.expired ? ' · expired' : ''}
										</span>
									{/if}
								</dd>
							</div>
						{/each}
					</dl>
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<span class="label">Signature</span>
				<code
					class="rounded-md border border-line bg-surface p-3 font-mono text-xs break-all text-fg-muted"
				>
					{decoded.signature}
				</code>
			</div>
		{/if}
	</div>
</ToolShell>
