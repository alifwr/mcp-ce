<script lang="ts">
	import { page } from '$app/stores';

	const navItems = [
		{ path: '/', label: 'Dashboard', icon: '🏠' },
		{ path: '/files', label: 'Files', icon: '📁' },
		{ path: '/tools', label: 'Tools', icon: '🔧' }
	];
</script>

<nav class="flex items-center justify-between border-b border-zinc-700 bg-zinc-900 px-6 py-4">
	<div class="flex items-center gap-3">
		<h1 class="text-xl font-bold text-white">MCP-CE</h1>
		<span class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">Control Panel</span>
	</div>

	<div class="flex gap-2">
		{#each navItems as item}
			<a
				href={item.path}
				class="flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition
					{$page.url.pathname === item.path
					? 'bg-blue-600 text-white'
					: 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}"
			>
				<span>{item.icon}</span>
				<span>{item.label}</span>
			</a>
		{/each}
	</div>

	<div class="flex items-center gap-2">
		<div class="flex items-center gap-2 rounded bg-zinc-800 px-3 py-2 text-sm text-zinc-400">
			<div class="h-2 w-2 rounded-full bg-green-500"></div>
			<span>Server Connected</span>
		</div>
	</div>
</nav>
