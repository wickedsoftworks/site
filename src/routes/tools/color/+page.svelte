<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';

	let input = $state('#0891b2');

	type RGB = { r: number; g: number; b: number; a: number };

	const NAMED_FALLBACK = /^[a-z]+$/i;

	function parse(text: string): RGB | null {
		const value = text.trim();
		if (!value) return null;
		if (typeof document === 'undefined') return null;
		const probe = document.createElement('canvas').getContext('2d');
		if (!probe) return null;
		probe.fillStyle = '#000';
		const before = probe.fillStyle;
		probe.fillStyle = value;
		if (probe.fillStyle === before && !/^(#000000|#000|black|rgb\(0, ?0, ?0\))$/i.test(value)) {
			if (!NAMED_FALLBACK.test(value)) return null;
			return null;
		}
		probe.fillRect(0, 0, 1, 1);
		const [r, g, b, a] = probe.getImageData(0, 0, 1, 1).data;
		return { r, g, b, a: Math.round((a / 255) * 100) / 100 };
	}

	function toHex({ r, g, b, a }: RGB): string {
		const hex = (n: number) => n.toString(16).padStart(2, '0');
		return `#${hex(r)}${hex(g)}${hex(b)}${a < 1 ? hex(Math.round(a * 255)) : ''}`;
	}

	function toHsl({ r, g, b, a }: RGB): string {
		const [rd, gd, bd] = [r / 255, g / 255, b / 255];
		const max = Math.max(rd, gd, bd);
		const min = Math.min(rd, gd, bd);
		const l = (max + min) / 2;
		let h = 0;
		let s = 0;
		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			if (max === rd) h = ((gd - bd) / d + (gd < bd ? 6 : 0)) * 60;
			else if (max === gd) h = ((bd - rd) / d + 2) * 60;
			else h = ((rd - gd) / d + 4) * 60;
		}
		const round = (n: number) => Math.round(n * 10) / 10;
		return `hsl(${round(h)} ${round(s * 100)}% ${round(l * 100)}%${a < 1 ? ` / ${a}` : ''})`;
	}

	function toOklch({ r, g, b, a }: RGB): string {
		const lin = (c: number) => {
			const v = c / 255;
			return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		};
		const [R, G, B] = [lin(r), lin(g), lin(b)];
		const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
		const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
		const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
		const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
		const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
		const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
		const C = Math.sqrt(A * A + Bb * Bb);
		let H = (Math.atan2(Bb, A) * 180) / Math.PI;
		if (H < 0) H += 360;
		const round = (n: number, p = 3) => Math.round(n * 10 ** p) / 10 ** p;
		return `oklch(${round(L * 100, 1)}% ${round(C)} ${round(H, 1)}${a < 1 ? ` / ${a}` : ''})`;
	}

	const parsed = $derived(parse(input));

	const formats = $derived.by(() => {
		if (!parsed) return [];
		const { r, g, b, a } = parsed;
		return [
			{ label: 'Hex', value: toHex(parsed) },
			{ label: 'RGB', value: a < 1 ? `rgb(${r} ${g} ${b} / ${a})` : `rgb(${r} ${g} ${b})` },
			{ label: 'HSL', value: toHsl(parsed) },
			{ label: 'OKLCH', value: toOklch(parsed) }
		];
	});

	const contrast = $derived.by(() => {
		if (!parsed) return null;
		const channel = (c: number) => {
			const v = c / 255;
			return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		};
		const L = 0.2126 * channel(parsed.r) + 0.7152 * channel(parsed.g) + 0.0722 * channel(parsed.b);
		return {
			white: Math.round((1.05 / (L + 0.05)) * 100) / 100,
			black: Math.round(((L + 0.05) / 0.05) * 100) / 100
		};
	});
</script>

<ToolShell slug="color">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-end gap-4">
			<label class="flex min-w-56 flex-1 flex-col gap-2">
				<span class="label">Colour</span>
				<input
					bind:value={input}
					spellcheck="false"
					placeholder="#0891b2, rebeccapurple, rgb(8 145 178), oklch(60% 0.1 220)"
					class="h-10 w-full rounded-md border border-line bg-bg px-3 font-mono text-sm
					       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
				/>
			</label>
			<label class="flex flex-col gap-2">
				<span class="label">Pick</span>
				<input
					type="color"
					value={parsed ? toHex(parsed).slice(0, 7) : '#000000'}
					oninput={(e) => (input = e.currentTarget.value)}
					class="h-10 w-16 cursor-pointer rounded-md border border-line bg-bg p-1"
				/>
			</label>
		</div>

		{#if parsed}
			<div
				class="h-28 w-full rounded-md border border-line"
				style:background-color={toHex(parsed)}
				aria-hidden="true"
			></div>

			<dl class="ruled-fill-2 ruled sm:grid-cols-2">
				{#each formats as format (format.label)}
					<div class="flex items-center justify-between gap-3 p-4">
						<div class="flex min-w-0 flex-col gap-1">
							<dt class="label">{format.label}</dt>
							<dd class="font-mono text-sm break-all text-fg">{format.value}</dd>
						</div>
						<CopyButton value={format.value} label="" class="shrink-0 px-2" />
					</div>
				{/each}
			</dl>

			{#if contrast}
				<div class="flex flex-col gap-2">
					<span class="label">Contrast</span>
					<div class="ruled-fill-2 ruled sm:grid-cols-2">
						{#each [['On white', contrast.white], ['On black', contrast.black]] as const as [label, ratio] (label)}
							<div class="flex items-baseline justify-between gap-3 p-4">
								<span class="text-sm text-fg-muted">{label}</span>
								<span class="flex items-baseline gap-2">
									<span class="font-mono tnum text-sm text-fg">{ratio}:1</span>
									<span
										class="text-xs"
										style:color={ratio >= 4.5
											? 'var(--ok)'
											: ratio >= 3
												? 'var(--warn)'
												: 'var(--destructive)'}
									>
										{ratio >= 4.5 ? 'AA body' : ratio >= 3 ? 'AA large only' : 'Fails'}
									</span>
								</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{:else if input.trim()}
			<p class="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
				Not a colour the browser recognizes.
			</p>
		{/if}
	</div>
</ToolShell>
