<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>MCP-CE Control Panel</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-zinc-950">
	<Navigation />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
