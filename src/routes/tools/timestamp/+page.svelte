<script lang="ts">
	import ToolShell from '$lib/components/site/ToolShell.svelte';
	import CopyButton from '$lib/components/site/CopyButton.svelte';

	let raw = $state('');
	let now = $state(Date.now());

	$effect(() => {
		const id = setInterval(() => (now = Date.now()), 1000);
		return () => clearInterval(id);
	});

	const parsed = $derived.by(() => {
		const text = raw.trim();
		if (!text) return null;

		if (/^-?\d+$/.test(text)) {
			const digits = text.replace('-', '').length;
			const value = Number(text);
			let ms: number;
			let unit: string;
			if (digits <= 10) {
				ms = value * 1000;
				unit = 'seconds';
			} else if (digits <= 13) {
				ms = value;
				unit = 'milliseconds';
			} else if (digits <= 16) {
				ms = value / 1000;
				unit = 'microseconds';
			} else {
				ms = value / 1_000_000;
				unit = 'nanoseconds';
			}
			const date = new Date(ms);
			if (Number.isNaN(date.getTime())) return { error: 'Out of range.' };
			return { date, note: `Read as ${unit}` };
		}

		const date = new Date(text);
		if (Number.isNaN(date.getTime())) {
			return { error: 'Not a number or a date string the browser understands.' };
		}
		return { date, note: 'Read as a date string' };
	});

	function relative(date: Date): string {
		const diff = date.getTime() - now;
		const abs = Math.abs(diff);
		const units: [number, Intl.RelativeTimeFormatUnit][] = [
			[31_536_000_000, 'year'],
			[2_592_000_000, 'month'],
			[604_800_000, 'week'],
			[86_400_000, 'day'],
			[3_600_000, 'hour'],
			[60_000, 'minute'],
			[1000, 'second']
		];
		const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
		for (const [ms, unit] of units) {
			if (abs >= ms) return formatter.format(Math.round(diff / ms), unit);
		}
		return 'now';
	}

	const rows = $derived.by(() => {
		if (!parsed || 'error' in parsed) return [];
		const { date } = parsed;
		return [
			{ label: 'Unix seconds', value: String(Math.floor(date.getTime() / 1000)) },
			{ label: 'Unix milliseconds', value: String(date.getTime()) },
			{ label: 'ISO 8601', value: date.toISOString() },
			{ label: 'UTC', value: date.toUTCString() },
			{ label: 'Local', value: date.toString() },
			{ label: 'Relative', value: relative(date) }
		];
	});
</script>

<ToolShell slug="timestamp">
	<div class="flex flex-col gap-6">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<label class="flex flex-1 flex-col gap-2">
				<span class="label">Timestamp or date</span>
				<input
					bind:value={raw}
					spellcheck="false"
					placeholder="1700000000, 1700000000000, or 2026-08-16T12:00:00Z"
					class="h-10 w-full rounded-md border border-line bg-bg px-3 font-mono text-sm
					       text-fg placeholder:text-fg-subtle focus-visible:border-brand"
				/>
			</label>
			<button
				type="button"
				onclick={() => (raw = String(Math.floor(Date.now() / 1000)))}
				class="h-10 shrink-0 cursor-pointer rounded-md border border-line px-3 text-sm
				       text-fg-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
			>
				Use now
			</button>
		</div>

		<div class="flex items-baseline justify-between gap-4 panel p-4">
			<span class="text-sm text-fg-muted">Current Unix time</span>
			<code class="font-mono tnum text-sm text-fg">{Math.floor(now / 1000)}</code>
		</div>

		{#if parsed && 'error' in parsed}
			<p class="rounded-md border border-destructive/40 p-3 text-sm text-destructive">
				{parsed.error}
			</p>
		{:else if parsed}
			<div class="flex flex-col gap-2">
				<span class="label">{parsed.note}</span>
				<dl class="ruled">
					{#each rows as row (row.label)}
						<div class="flex flex-wrap items-center justify-between gap-3 p-4">
							<dt class="text-sm text-fg-muted">{row.label}</dt>
							<dd class="flex items-center gap-3">
								<code class="font-mono text-xs break-all text-fg">{row.value}</code>
								<CopyButton value={row.value} label="" class="px-2" />
							</dd>
						</div>
					{/each}
				</dl>
			</div>
		{/if}
	</div>
</ToolShell>
