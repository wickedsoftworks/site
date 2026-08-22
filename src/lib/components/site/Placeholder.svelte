<script lang="ts">
	let { class: className = '' }: { class?: string } = $props();
</script>

<!-- Absent content is marked, quietly but unmistakably. Dashed, because the
     outline of something missing should not look like a finished chip. -->
<span
	class="inline-flex shrink-0 items-center rounded-sm border border-dashed border-line-strong px-1.5 py-0.5
	       text-[0.6875rem] leading-none font-medium tracking-wide text-fg-subtle uppercase {className}"
	title="Standing in for content that does not exist yet"
>
	Placeholder
</span>
