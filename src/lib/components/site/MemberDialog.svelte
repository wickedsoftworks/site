<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { MemberView } from '$lib/data/members';
	import Avatar from './Avatar.svelte';
	import Placeholder from './Placeholder.svelte';
	import Github from './GithubIcon.svelte';
	import Link from '@lucide/svelte/icons/link';
	import Mail from '@lucide/svelte/icons/mail';
	import MapPin from '@lucide/svelte/icons/map-pin';

	let { member, open = $bindable(false) }: { member: MemberView | null; open?: boolean } = $props();

	const outbound = $derived(
		member
			? [
					{
						label: member.handle ? `@${member.handle}` : 'GitHub',
						href: member.links.github,
						icon: Github
					},
					{ label: 'Website', href: member.links.website, icon: Link },
					{
						label: 'Email',
						href: member.links.email ? `mailto:${member.links.email}` : '',
						icon: Mail
					}
				].filter((link) => link.href)
			: []
	);
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 p-0 sm:max-w-xl">
		{#if member}
			<div class="flex flex-col gap-5 p-6">
				<div class="flex items-start gap-4 pr-6">
					<Avatar {member} size={72} />
					<div class="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
						<Dialog.Title
							class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-lg leading-tight text-balance"
						>
							{member.name}
							{#if member.pronouns}
								<span class="text-sm font-normal text-fg-subtle">{member.pronouns}</span>
							{/if}
						</Dialog.Title>
						<Dialog.Description class="text-sm text-fg-muted">
							{member.role}
						</Dialog.Description>
						{#if member.location}
							<span class="flex items-center gap-1.5 text-xs text-fg-subtle">
								<MapPin class="size-3" />
								{member.location}
							</span>
						{/if}
					</div>
				</div>

				{#if member.bio}
					<p class="text-sm leading-relaxed text-fg-muted">{member.bio}</p>
				{/if}
			</div>

			{#if outbound.length > 0}
				<div class="flex flex-wrap items-center gap-2 border-t border-line p-4">
					{#each outbound as link (link.label)}
						{@const Icon = link.icon}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm text-fg-muted
							       transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
						>
							<Icon class="size-3.5" />
							{link.label}
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	</Dialog.Content>
</Dialog.Root>
