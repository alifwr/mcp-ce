<script lang="ts">
	import ToolManager from '$lib/components/ToolManager.svelte';
</script>

<div class="container mx-auto p-6">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-white">Tool Manager</h1>
		<p class="mt-1 text-zinc-400">Manage MCP tool wrappers and code generation</p>
	</div>

	<div class="grid gap-6">
		<!-- Tool Manager Component -->
		<div class="h-[calc(100vh-12rem)]">
			<ToolManager />
		</div>

		<!-- Documentation -->
		<div class="rounded-lg border border-zinc-700 bg-zinc-800 p-6">
			<h2 class="mb-4 text-lg font-semibold text-white">About MCP Tools</h2>
			<div class="prose prose-invert max-w-none text-sm text-zinc-400">
				<p class="mb-3">
					MCP (Model Context Protocol) tools are automatically generated TypeScript wrappers
					that allow you to interact with external MCP servers.
				</p>
				<p class="mb-3">
					When you click "Refresh Tools", the system will:
				</p>
				<ul class="mb-3 ml-5 list-disc space-y-1">
					<li>Connect to the configured MCP server</li>
					<li>Fetch all available tool definitions</li>
					<li>Generate TypeScript interfaces for inputs and outputs</li>
					<li>Create wrapper functions in <code class="text-zinc-300">server/tools/</code></li>
				</ul>
				<p>
					Each tool gets its own directory with a TypeScript file containing strongly-typed
					interfaces and a function that handles communication with the MCP server.
				</p>
			</div>
		</div>
	</div>
</div>
