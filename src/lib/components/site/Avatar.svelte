<script lang="ts">
	import type { MemberView } from '$lib/data/members';

	let {
		member,
		size = 64,
		class: className = ''
	}: { member: MemberView; size?: number; class?: string } = $props();
	let failed = $state(false);
	const showImage = $derived(!failed);
</script>

<span
	class="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 select-none {className}"
	style:width="{size}px"
	style:height="{size}px"
>
	{#if showImage}
		<img
			src={member.avatarSrc}
			alt=""
			width={size}
			height={size}
			loading="lazy"
			decoding="async"
			class="size-full object-cover"
			onerror={() => (failed = true)}
		/>
	{:else}
		<span
			class="font-medium text-fg-subtle"
			style:font-size="{Math.max(11, Math.round(size * 0.36))}px"
			aria-hidden="true"
		>
			{member.initials}
		</span>
	{/if}
</span>
