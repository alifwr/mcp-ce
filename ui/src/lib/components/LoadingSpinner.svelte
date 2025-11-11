<script lang="ts">
	let { size = 'md', color = 'blue' }: { size?: 'sm' | 'md' | 'lg'; color?: string } = $props();

	const sizeClasses = {
		sm: 'h-4 w-4 border-2',
		md: 'h-8 w-8 border-4',
		lg: 'h-12 w-12 border-4'
	};

	const colorClass = `border-${color}-500`;
</script>

<div
	class="{sizeClasses[size]} {colorClass} animate-spin rounded-full border-t-transparent"
	role="status"
	aria-label="Loading"
></div>
