<script lang="ts">
	import { fileApi } from '$lib/api';

	let { filePath = $bindable(null) }: { filePath: string | null } = $props();

	let content = $state('');
	let originalContent = $state('');
	let loading = $state(false);
	let saving = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	$effect(() => {
		if (filePath) {
			loadFile(filePath);
		} else {
			content = '';
			originalContent = '';
		}
	});

	async function loadFile(path: string) {
		loading = true;
		error = null;
		successMessage = null;
		try {
			const fileContent = await fileApi.readFile(path);
			content = fileContent;
			originalContent = fileContent;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load file';
			content = '';
		} finally {
			loading = false;
		}
	}

	async function saveFile() {
		if (!filePath) return;

		saving = true;
		error = null;
		successMessage = null;
		try {
			await fileApi.writeFile(filePath, content);
			originalContent = content;
			successMessage = 'File saved successfully!';
			setTimeout(() => {
				successMessage = null;
			}, 3000);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save file';
		} finally {
			saving = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') {
			e.preventDefault();
			saveFile();
		}
	}

	$effect(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	let hasChanges = $derived(content !== originalContent);
</script>

<div class="flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-800">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
		<div class="flex items-center gap-3">
			<h2 class="text-lg font-semibold text-white">File Editor</h2>
			{#if filePath}
				<code class="rounded bg-zinc-900 px-2 py-1 text-sm text-zinc-300">{filePath}</code>
			{/if}
			{#if hasChanges}
				<span class="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white">
					Unsaved changes
				</span>
			{/if}
		</div>
		<div class="flex gap-2">
			{#if filePath}
				<button
					onclick={() => loadFile(filePath!)}
					disabled={loading || !hasChanges}
					class="rounded border border-zinc-600 px-3 py-1 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700 disabled:opacity-30"
				>
					Revert
				</button>
				<button
					onclick={saveFile}
					disabled={saving || !hasChanges}
					class="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-30"
				>
					{saving ? 'Saving...' : 'Save'}
					<span class="ml-1 text-xs opacity-75">(Ctrl+S)</span>
				</button>
			{/if}
		</div>
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

	<!-- Editor -->
	<div class="flex-1 overflow-hidden">
		{#if !filePath}
			<div class="flex h-full items-center justify-center text-zinc-500">
				<div class="text-center">
					<p class="text-lg">No file selected</p>
					<p class="mt-2 text-sm">Select a file from the browser to start editing</p>
				</div>
			</div>
		{:else if loading}
			<div class="flex h-full items-center justify-center">
				<div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
			</div>
		{:else}
			<textarea
				bind:value={content}
				class="h-full w-full resize-none bg-zinc-900 p-4 font-mono text-sm text-zinc-100 focus:outline-none"
				placeholder="File content will appear here..."
			></textarea>
		{/if}
	</div>

	<!-- Footer -->
	<div class="border-t border-zinc-700 px-4 py-2 text-xs text-zinc-500">
		{#if filePath}
			<span>
				Lines: {content.split('\n').length} | Characters: {content.length}
			</span>
		{/if}
	</div>
</div>
