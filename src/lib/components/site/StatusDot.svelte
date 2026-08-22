<script lang="ts">
	import { STATUS_DOT, STATUS_LABEL, type ProjectStatus } from '$lib/data/site';

	let { status, class: className = '' }: { status: ProjectStatus; class?: string } = $props();
</script>

<span class="flex shrink-0 items-center gap-1.5 text-xs text-fg-muted {className}">
	<span
		class="size-1.5 shrink-0 rounded-full"
		style:background-color={STATUS_DOT[status]}
		aria-hidden="true"
	></span>
	{STATUS_LABEL[status]}
</span>
