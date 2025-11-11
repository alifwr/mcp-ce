<script lang="ts">
	import { onMount } from 'svelte';
	import { fileApi } from '$lib/api';

	let {
		currentPath = $bindable('.'),
		onFileSelect = () => {}
	}: { currentPath?: string; onFileSelect?: (path: string) => void } = $props();

	let files: string[] = $state([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let pathHistory: string[] = $state([]);

	async function loadFiles(path: string) {
		loading = true;
		error = null;
		try {
			files = await fileApi.listFiles(path);
			currentPath = path;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load files';
			files = [];
		} finally {
			loading = false;
		}
	}

	function isLikelyDirectory(filename: string): boolean {
		// If it doesn't have an extension, assume it's a folder
		return !filename.includes('.');
	}

	async function handleItemClick(item: string) {
		const fullPath = currentPath === '.' ? item : `${currentPath}/${item}`;
		const isDir = isLikelyDirectory(item);
		
		if (isDir) {
			// It's a directory - navigate into it
			navigateToDirectory(item);
		} else {
			// It's a file - select it for editing
			onFileSelect(fullPath);
		}
	}

	function navigateToDirectory(dir: string) {
		pathHistory = [...pathHistory, currentPath];
		const newPath = currentPath === '.' ? dir : `${currentPath}/${dir}`;
		loadFiles(newPath);
	}

	function navigateUp() {
		if (currentPath === '.') return;
		const parts = currentPath.split('/');
		parts.pop();
		const newPath = parts.length === 0 ? '.' : parts.join('/');
		loadFiles(newPath);
	}

	function goBack() {
		if (pathHistory.length > 0) {
			const previousPath = pathHistory[pathHistory.length - 1];
			pathHistory = pathHistory.slice(0, -1);
			loadFiles(previousPath);
		}
	}

	onMount(() => {
		loadFiles(currentPath);
	});
</script>

<div class="flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-800">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
		<div class="flex items-center gap-2">
			<h2 class="text-lg font-semibold text-white">File Browser</h2>
			<button
				onclick={goBack}
				disabled={pathHistory.length === 0}
				class="rounded px-2 py-1 text-sm text-zinc-400 transition hover:bg-zinc-700 hover:text-white disabled:opacity-30"
				title="Go back"
			>
				← Back
			</button>
		</div>
		<button
			onclick={() => loadFiles(currentPath)}
			class="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-blue-700"
		>
			Refresh
		</button>
	</div>

	<!-- Path -->
	<div class="border-b border-zinc-700 bg-zinc-900 px-4 py-2">
		<div class="flex items-center gap-2 text-sm">
			<span class="text-zinc-500">Path:</span>
			<code class="rounded bg-zinc-800 px-2 py-1 font-mono text-zinc-300">{currentPath}</code>
			{#if currentPath !== '.'}
				<button
					onclick={navigateUp}
					class="rounded px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
				>
					↑ Up
				</button>
			{/if}
		</div>
	</div>

	<!-- File List -->
	<div class="flex-1 overflow-y-auto p-4">
		{#if loading}
			<div class="flex items-center justify-center py-8">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		{:else if error}
			<div class="rounded-lg border border-red-800 bg-red-900/20 p-4 text-red-400">
				<p class="font-medium">Error</p>
				<p class="mt-1 text-sm">{error}</p>
			</div>
		{:else if files.length === 0}
			<div class="py-8 text-center text-zinc-500">No files found</div>
		{:else}
			<div class="space-y-1">
				{#each files as file}
					{@const isDir = isLikelyDirectory(file)}
					<button
						onclick={() => handleItemClick(file)}
						class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-zinc-700"
						title={isDir ? 'Click to open folder' : 'Click to open file'}
					>
						<span class="text-xl">
							{#if isDir}
								🗂️
							{:else}
								📝
							{/if}
						</span>
						<span class="font-mono text-sm text-zinc-200">{file}</span>
						{#if isDir}
							<span class="ml-auto text-xs text-zinc-500">→</span>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>
