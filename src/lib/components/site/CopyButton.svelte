<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';

	let {
		value,
		label = 'Copy',
		disabled = false,
		class: className = ''
	}: { value: string; label?: string; disabled?: boolean; class?: string } = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	async function copy() {
		if (!value) return;
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Clipboard is unavailable over plain HTTP and in some embedded
			// browsers. Fall back to a selection the user can copy by hand.
			const area = document.createElement('textarea');
			area.value = value;
			area.style.position = 'fixed';
			area.style.opacity = '0';
			document.body.append(area);
			area.select();
			document.execCommand('copy');
			area.remove();
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 1600);
	}
</script>

<button
	type="button"
	onclick={copy}
	disabled={disabled || !value}
	class="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-line px-2.5
	       text-xs font-medium text-fg-muted transition-colors duration-150
	       hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 {className}"
>
	{#if copied}
		<Check class="size-3.5 text-ok" />
		Copied
	{:else}
		<Copy class="size-3.5" />
		{label}
	{/if}
</button>
