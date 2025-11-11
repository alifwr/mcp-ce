<script lang="ts">
	import { onMount } from 'svelte';
	import { healthApi } from '$lib/api';

	let serverStatus = $state<{ status: string; timestamp: string } | null>(null);
	let loading = $state(true);

	onMount(async () => {
		try {
			serverStatus = await healthApi.check();
		} catch (error) {
			console.error('Failed to fetch server status:', error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto p-6">
	<!-- Welcome Section -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-white">Welcome to MCP-CE Control Panel</h1>
		<p class="mt-2 text-zinc-400">
			Manage your Model Context Protocol server with ease
		</p>
	</div>

	<!-- Status Card -->
	<div class="mb-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
		<h2 class="mb-4 text-xl font-semibold text-white">Server Status</h2>
		{#if loading}
			<div class="flex items-center gap-3 text-zinc-400">
				<div class="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
				<span>Checking server status...</span>
			</div>
		{:else if serverStatus}
			<div class="flex items-center gap-3">
				<div class="h-3 w-3 rounded-full bg-green-500"></div>
				<span class="text-green-400 font-medium">Server Online</span>
				<span class="text-zinc-500 text-sm">
					Last checked: {new Date(serverStatus.timestamp).toLocaleTimeString()}
				</span>
			</div>
		{:else}
			<div class="flex items-center gap-3">
				<div class="h-3 w-3 rounded-full bg-red-500"></div>
				<span class="text-red-400 font-medium">Server Offline</span>
			</div>
		{/if}
	</div>

	<!-- Quick Actions -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<a
			href="/files"
			class="group rounded-lg border border-zinc-700 bg-zinc-800 p-6 transition hover:border-blue-500 hover:bg-zinc-700"
		>
			<div class="mb-3 text-4xl">📁</div>
			<h3 class="mb-2 text-lg font-semibold text-white">File Manager</h3>
			<p class="text-sm text-zinc-400">
				Browse, read, and edit files in your project
			</p>
		</a>

		<a
			href="/tools"
			class="group rounded-lg border border-zinc-700 bg-zinc-800 p-6 transition hover:border-green-500 hover:bg-zinc-700"
		>
			<div class="mb-3 text-4xl">🔧</div>
			<h3 class="mb-2 text-lg font-semibold text-white">Tool Manager</h3>
			<p class="text-sm text-zinc-400">
				Manage and refresh MCP tool wrappers
			</p>
		</a>

		<div
			class="rounded-lg border border-zinc-700 bg-zinc-800 p-6"
		>
			<div class="mb-3 text-4xl">📊</div>
			<h3 class="mb-2 text-lg font-semibold text-white">Server Info</h3>
			<div class="space-y-1 text-sm text-zinc-400">
				<p><span class="text-zinc-500">Name:</span> demo-server</p>
				<p><span class="text-zinc-500">Version:</span> 1.0.0</p>
				<p><span class="text-zinc-500">Port:</span> 8000</p>
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="mt-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6">
		<h2 class="mb-4 text-xl font-semibold text-white">Features</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="flex gap-3">
				<span class="text-2xl">✅</span>
				<div>
					<h4 class="font-medium text-white">File Operations</h4>
					<p class="text-sm text-zinc-400">Read, write, and list files</p>
				</div>
			</div>
			<div class="flex gap-3">
				<span class="text-2xl">✅</span>
				<div>
					<h4 class="font-medium text-white">MCP Tool Integration</h4>
					<p class="text-sm text-zinc-400">Automatic TypeScript wrapper generation</p>
				</div>
			</div>
			<div class="flex gap-3">
				<span class="text-2xl">✅</span>
				<div>
					<h4 class="font-medium text-white">Modular Architecture</h4>
					<p class="text-sm text-zinc-400">Clean, maintainable codebase</p>
				</div>
			</div>
			<div class="flex gap-3">
				<span class="text-2xl">✅</span>
				<div>
					<h4 class="font-medium text-white">REST API</h4>
					<p class="text-sm text-zinc-400">Well-documented endpoints</p>
				</div>
			</div>
		</div>
	</div>
</div>
