<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import ArrowUpDown from '@lucide/svelte/icons/arrow-up-down';

	let mode = $state<'encode' | 'decode'>('encode');
	let urlSafe = $state(false);
	let input = $state('');

	/**
	 * btoa/atob only handle Latin-1, so anything outside it (emoji, accents,
	 * most of the world's writing) has to go through UTF-8 bytes first. This is
	 * the bug most hand-rolled Base64 helpers ship with.
	 */
	function encode(text: string): string {
		const bytes = new TextEncoder().encode(text);
		let binary = '';
		for (const byte of bytes) binary += String.fromCharCode(byte);
		const out = btoa(binary);
		return urlSafe ? out.replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '') : out;
	}

	function decode(text: string): string {
		let normalized = text.trim().replaceAll('-', '+').replaceAll('_', '/');
		// Restore stripped padding, which URL-safe encoders drop.
		if (normalized.length % 4 !== 0) {
			normalized = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), '=');
		}
		const binary = atob(normalized);
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	}

	const result = $derived.by(() => {
		if (!input.trim()) return { ok: true as const, value: '' };
		try {
			return { ok: true as const, value: mode === 'encode' ? encode(input) : decode(input) };
		} catch {
			return {
				ok: false as const,
				value:
					mode === 'decode'
						? 'Not valid Base64, or the bytes are not valid UTF-8 text.'
						: 'Could not encode this input.'
			};
		}
	});

	function swap() {
		if (result.ok && result.value) input = result.value;
		mode = mode === 'encode' ? 'decode' : 'encode';
	}

	const inputBytes = $derived(new TextEncoder().encode(input).length);
</script>

<ToolShell slug="base64">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-center gap-x-6 gap-y-3">
			<div class="flex items-center gap-1 rounded-md border border-line p-1">
				{#each [['encode', 'Encode'], ['decode', 'Decode']] as const as [value, label] (value)}
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

			<label class="flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
				<input
					type="checkbox"
					bind:checked={urlSafe}
					class="size-4 rounded-sm border-line-strong text-brand focus-visible:ring-brand"
				/>
				URL-safe alphabet
			</label>
		</div>

		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span class="label">{mode === 'encode' ? 'Plain text' : 'Base64'}</span>
					<span class="tnum text-xs text-fg-subtle">
						{input.length} chars · {inputBytes} bytes
					</span>
				</div>
				<textarea
					bind:value={input}
					rows="6"
					spellcheck="false"
					placeholder={mode === 'encode' ? 'Type or paste text…' : 'Paste Base64…'}
					class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
					       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
				></textarea>
			</div>

			<div class="flex justify-center">
				<button
					type="button"
					onclick={swap}
					class="inline-flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2
					       text-xs font-medium text-fg-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
				>
					<ArrowUpDown class="size-3.5" />
					Use result as input
				</button>
			</div>

			<div class="flex flex-col gap-2">
				<div class="flex items-center justify-between gap-4">
					<span class="label">{mode === 'encode' ? 'Base64' : 'Plain text'}</span>
					<CopyButton value={result.ok ? result.value : ''} />
				</div>
				<div
					class="min-h-[8.5rem] w-full rounded-md border p-3 font-mono text-sm break-all
					       {result.ok ? 'border-line bg-surface text-fg' : 'border-destructive/40 text-destructive'}"
					aria-live="polite"
				>
					{result.value}
				</div>
			</div>
		</div>
	</div>
</ToolShell>
