<script lang="ts" module>
	export { default as Navbar } from './Navbar.svelte';
</script>

<script lang="ts">
	import ModeToggle from './ModeToggle.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { GITHUB_ORG } from '$lib/data/site';
	import Github from '$lib/components/site/GithubIcon.svelte';

	// `as const` keeps the hrefs as literal route types, which is what
	// SvelteKit's typed `resolve` expects.
	const sections = [
		{ href: '/projects', label: 'Projects' },
		{ href: '/members', label: 'Members' },
		{ href: '/tools', label: 'Tools' }
	] as const;

	const current = $derived(page.url.pathname);
	const isActive = (href: string) => current.startsWith(href);
</script>

<!-- Sticky, hairline-ruled, translucent over the content it covers. The only
     chrome on the page is this one line. -->
<header
	class="sticky top-0 z-50 border-b border-line bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/65"
>
	<div class="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
		<a
			href={resolve('/')}
			class="flex shrink-0 items-center gap-2.5 rounded-sm"
			aria-label="Wicked Softworks home"
		>
			<img src="/logo.png" alt="" class="size-6 shrink-0 object-contain" />
			<span class="hidden text-sm font-semibold tracking-tight text-fg sm:inline">
				Wicked Softworks
			</span>
		</a>

		<nav aria-label="Sections" class="flex min-w-0 flex-1 items-center gap-1">
			{#each sections as section (section.href)}
				{@const on = isActive(section.href)}
				<a
					href={resolve(section.href)}
					aria-current={on ? 'page' : undefined}
					class="relative rounded-sm px-2 py-1.5 text-sm transition-colors duration-150 sm:px-2.5
					       {on ? 'text-fg' : 'text-fg-muted hover:text-fg'}"
				>
					{section.label}
					{#if on}
						<!-- Sits on the header's own bottom rule rather than floating. -->
						<span
							class="absolute inset-x-2 -bottom-[13px] h-0.5 rounded-full bg-brand sm:inset-x-2.5"
							aria-hidden="true"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="flex shrink-0 items-center gap-1">
			<a
				href={GITHUB_ORG}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub organization"
				class="grid size-8 place-items-center rounded-md text-fg-muted transition-colors duration-150 hover:bg-surface-2 hover:text-fg"
			>
				<Github class="size-4" />
			</a>
			<ModeToggle />
		</div>
	</div>
</header>
