<script lang="ts" module>
    import { Button } from '@/components/ui/button';
	import ModeToggle from './ModeToggle.svelte';
    import { resolve } from "$app/paths";
    import GitBranch from "@lucide/svelte/icons/git-branch";
    
    export { default as Navbar } from './Navbar.svelte';
</script>

<nav
	class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur shadow-lg border border-border flex items-center px-6 rounded-2xl"
	style="height: 10vh; min-height: 48px; max-height: 80px; width: min(96vw, 1200px);"
>
	<div class="flex items-center gap-3 h-full min-w-0" style="flex:1 1 0;">
		<img src="/logo.png" alt="Logo" class="h-3/4 max-h-12 aspect-square object-contain" style="max-height: 48px;" />
		<a href="{resolve('/')}" class="font-bold text-lg tracking-tight select-none whitespace-nowrap transition-colors hover:text-primary">Wicked Softworks</a>
	</div>
	<div class="flex items-center justify-center h-full min-w-0" style="flex:1 1 0;">
		<nav class="flex gap-6">
			<a href="{resolve('/projects')}" class="text-base font-medium hover:underline">Projects</a>
			<a href="{resolve('/members')}" class="text-base font-medium hover:underline">Members</a>
			<a href="{resolve('/tools')}" class="text-base font-medium hover:underline">Tools</a>
		</nav>
	</div>
	<div class="flex items-center gap-2 h-full min-w-0 justify-end" style="flex:1 1 0;">
		<Button href="https://github.com/wickedsoftworks" target="_blank" rel="noopener noreferrer">
			<GitBranch /> GitHub
		</Button>
		<ModeToggle />
	</div>
</nav>