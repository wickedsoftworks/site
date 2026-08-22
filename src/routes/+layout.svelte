<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '@/components/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { resolve } from '$app/paths';
	import { GITHUB_ORG } from '$lib/data/site';

	let { children } = $props();

	const columns = [
		{
			heading: 'Site',
			links: [
				{ label: 'Projects', href: resolve('/projects'), external: false },
				{ label: 'Members', href: resolve('/members'), external: false },
				{ label: 'Tools', href: resolve('/tools'), external: false }
			]
		},
		{
			heading: 'Code',
			links: [{ label: 'GitHub organization', href: GITHUB_ORG, external: true }]
		}
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-line">
		<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
			<div class="flex flex-col gap-10 sm:flex-row sm:justify-between sm:gap-16">
				<div class="flex max-w-xs flex-col gap-3">
					<div class="flex items-center gap-2.5">
						<img src="/logo.png" alt="" class="size-6 shrink-0 object-contain" />
						<span class="text-sm font-semibold tracking-tight text-fg">Wicked Softworks</span>
					</div>
					<p class="text-sm leading-relaxed text-fg-muted">
						An open-source developer collective. Everything we build is public.
					</p>
				</div>

				<div class="flex gap-12 sm:gap-16">
					{#each columns as column (column.heading)}
						<div class="flex flex-col gap-3">
							<h2 class="label">{column.heading}</h2>
							<ul class="flex flex-col gap-2.5">
								{#each column.links as link (link.label)}
									<li>
										<a
											href={link.href}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noopener noreferrer' : undefined}
											class="rounded-sm text-sm text-fg-muted transition-colors duration-150 hover:text-fg"
										>
											{link.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>

			<div class="mt-12 border-t border-line pt-6">
				<p class="font-mono text-xs text-fg-subtle">Wicked Softworks © 2026</p>
			</div>
		</div>
	</footer>
</div>
