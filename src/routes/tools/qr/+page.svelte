<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';
	import Download from '@lucide/svelte/icons/download';

	let text = $state('https://github.com/wickedsoftworks');
	let size = $state(512);
	let level = $state<'L' | 'M' | 'Q' | 'H'>('M');
	let margin = $state(2);

	let dataUrl = $state('');
	let error = $state('');

	// qrcode is the only third-party library on the site, so it is loaded on
	// demand rather than shipped to every visitor of every other page.
	$effect(() => {
		const value = text;
		const options = { width: size, margin, errorCorrectionLevel: level };
		let cancelled = false;

		if (!value) {
			dataUrl = '';
			error = '';
			return;
		}

		import('qrcode')
			.then((QR) =>
				QR.toDataURL(value, { ...options, color: { dark: '#000000', light: '#ffffff' } })
			)
			.then((url) => {
				if (cancelled) return;
				dataUrl = url;
				error = '';
			})
			.catch((e: Error) => {
				if (cancelled) return;
				dataUrl = '';
				error = e.message.includes('too long')
					? 'Too much data for a QR code at this error-correction level. Shorten the text or drop to level L.'
					: e.message;
			});

		return () => {
			cancelled = true;
		};
	});

	const LEVELS = [
		['L', 'Low', '~7% recoverable'],
		['M', 'Medium', '~15% recoverable'],
		['Q', 'Quartile', '~25% recoverable'],
		['H', 'High', '~30% recoverable']
	] as const;

	const filename = $derived(
		(text
			.replace(/^https?:\/\//, '')
			.replace(/[^a-z0-9]+/gi, '-')
			.slice(0, 40) || 'qr') + '.png'
	);
</script>

<ToolShell slug="qr">
	<div class="flex flex-col gap-6 lg:flex-row lg:gap-10">
		<div class="flex flex-1 flex-col gap-5">
			<label class="flex flex-col gap-2">
				<span class="label">Text or URL</span>
				<textarea
					bind:value={text}
					rows="4"
					spellcheck="false"
					placeholder="https://example.com"
					class="w-full resize-y rounded-md border border-line bg-bg p-3 font-mono text-sm
					       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
				></textarea>
			</label>

			<div class="flex flex-wrap items-end gap-4">
				<label class="flex flex-col gap-2">
					<span class="label">Size</span>
					<input
						type="number"
						min="128"
						max="2048"
						step="64"
						bind:value={size}
						class="h-9 w-28 rounded-md border border-line bg-bg px-3 font-mono text-sm text-fg focus-visible:border-brand"
					/>
				</label>
				<label class="flex flex-col gap-2">
					<span class="label">Quiet zone</span>
					<input
						type="number"
						min="0"
						max="10"
						bind:value={margin}
						class="h-9 w-24 rounded-md border border-line bg-bg px-3 font-mono text-sm text-fg focus-visible:border-brand"
					/>
				</label>
			</div>

			<fieldset class="flex flex-col gap-2">
				<legend class="mb-2 label">Error correction</legend>
				<div class="flex flex-wrap items-center gap-1 rounded-md border border-line p-1">
					{#each LEVELS as [value, label] (value)}
						<button
							type="button"
							onclick={() => (level = value)}
							aria-pressed={level === value}
							class="cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors duration-150
							       {level === value
								? 'bg-brand text-brand-fg'
								: 'text-fg-muted hover:bg-surface-2 hover:text-fg'}"
						>
							{label}
						</button>
					{/each}
				</div>
				<p class="text-xs text-fg-subtle">
					{LEVELS.find(([v]) => v === level)?.[2]}. Higher levels survive damage and let you cover
					more of the code, at the cost of density.
				</p>
			</fieldset>
		</div>

		<div class="flex flex-col items-center gap-4 lg:w-80 lg:shrink-0">
			{#if error}
				<p class="w-full rounded-md border border-destructive/40 p-3 text-sm text-destructive">
					{error}
				</p>
			{:else if dataUrl}
				<!-- White plate regardless of theme: a QR code on a dark ground does
				     not scan on most readers. -->
				<div class="w-full rounded-md border border-line bg-white p-4">
					<img src={dataUrl} alt="QR code for the text entered above" class="w-full" />
				</div>
				<div class="flex w-full items-center gap-2">
					<a
						href={dataUrl}
						download={filename}
						class="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-md bg-brand px-3
						       text-sm font-medium text-brand-fg transition-colors duration-150 hover:bg-brand/90"
					>
						<Download class="size-4" />
						Download PNG
					</a>
					<CopyButton value={text} label="Copy text" class="h-9" />
				</div>
			{:else}
				<div
					class="grid aspect-square w-full place-items-center rounded-md border border-dashed border-line-strong text-sm text-fg-subtle"
				>
					Enter some text
				</div>
			{/if}
		</div>
	</div>
</ToolShell>
