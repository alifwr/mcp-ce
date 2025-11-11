<script lang="ts">
	import { onMount } from 'svelte';
	import { toolApi } from '$lib/api';

	let tools: string[] = $state([]);
	let toolCount = $state(0);
	let loading = $state(false);
	let refreshing = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	async function refreshTools() {
		refreshing = true;
		error = null;
		successMessage = null;
		try {
			const result = await toolApi.refreshTools();
			tools = result.tools;
			toolCount = result.count;
			successMessage = `Successfully refreshed ${result.count} tools!`;
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to refresh tools';
		} finally {
			refreshing = false;
		}
	}

	onMount(() => {
		refreshTools();
	});
</script>

<div class="flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-800">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
		<div class="flex items-center gap-3">
			<h2 class="text-lg font-semibold text-white">MCP Tools</h2>
			{#if toolCount > 0}
				<span class="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white">
					{toolCount} {toolCount === 1 ? 'tool' : 'tools'}
				</span>
			{/if}
		</div>
		<button
			onclick={refreshTools}
			disabled={refreshing}
			class="flex items-center gap-2 rounded bg-green-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
		>
			{#if refreshing}
				<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
			{:else}
				<span>🔄</span>
			{/if}
			{refreshing ? 'Refreshing...' : 'Refresh Tools'}
		</button>
	</div>

	<!-- Messages -->
	{#if error}
		<div class="border-b border-zinc-700 bg-red-900/20 px-4 py-2">
			<p class="text-sm text-red-400">{error}</p>
		</div>
	{/if}
	{#if successMessage}
		<div class="border-b border-zinc-700 bg-green-900/20 px-4 py-2">
			<p class="text-sm text-green-400">{successMessage}</p>
		</div>
	{/if}

	<!-- Tool List -->
	<div class="flex-1 overflow-y-auto p-4">
		{#if loading}
			<div class="flex items-center justify-center py-8">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		{:else if tools.length === 0}
			<div class="py-8 text-center text-zinc-500">
				<p class="text-lg">No tools available</p>
				<p class="mt-2 text-sm">Click "Refresh Tools" to load MCP tools from the server</p>
			</div>
		{:else}
			<div class="grid gap-2">
				{#each tools as tool}
					<div
						class="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 transition hover:border-zinc-600"
					>
						<span class="text-2xl">🔧</span>
						<div class="flex-1">
							<p class="font-mono text-sm font-medium text-zinc-200">{tool}</p>
							<p class="mt-1 text-xs text-zinc-500">
								Generated wrapper available at: <code class="text-zinc-400">server/tools/{tool}/{tool}.ts</code>
							</p>
						</div>
						<span class="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white">Active</span>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Info Footer -->
	<div class="border-t border-zinc-700 bg-zinc-900 px-4 py-3">
		<div class="text-xs text-zinc-400">
			<p>
				<strong class="text-zinc-300">MCP Tool Manager:</strong> Refresh tools to sync with the MCP server
				and generate TypeScript wrappers.
			</p>
			<p class="mt-1">
				Tools are automatically generated in <code class="text-zinc-300">server/tools/</code>
			</p>
		</div>
	</div>
</div>
