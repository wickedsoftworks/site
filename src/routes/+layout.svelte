<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from "@/components/Navbar.svelte";
	import { ModeWatcher } from "mode-watcher"
	
	let { children } = $props();
</script>

<!-- Add the color mode / dark mode toggle element -->
<ModeWatcher />

<!-- Add the navbar globally no matter what page the user is on -->
<Navbar />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div style="padding-top: calc(10vh + 1.25rem); /* 1.25rem = 20px top offset */">
	{@render children()}
</div>