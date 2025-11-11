<script lang="ts">
	import FileBrowser from '$lib/components/FileBrowser.svelte';
	import FileEditor from '$lib/components/FileEditor.svelte';

	let selectedFile = $state<string | null>(null);
	let currentPath = $state('.');

	function handleFileSelect(filePath: string) {
		selectedFile = filePath;
	}
</script>

<div class="container mx-auto p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-white">File Manager</h1>
		<p class="mt-1 text-zinc-400">Browse and edit files in your project</p>
	</div>

	<div class="grid h-[calc(100vh-12rem)] gap-6 lg:grid-cols-2">
		<!-- File Browser -->
		<div class="flex flex-col">
			<FileBrowser bind:currentPath onFileSelect={handleFileSelect} />
		</div>

		<!-- File Editor -->
		<div class="flex flex-col">
			<FileEditor bind:filePath={selectedFile} />
		</div>
	</div>
</div>
