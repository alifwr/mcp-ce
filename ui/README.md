# MCP-CE UI

A modern web interface for managing the MCP-CE (Model Context Protocol - Code Editor) server built with SvelteKit and TailwindCSS.

## Features

### 📁 File Manager
- **File Browser**: Navigate through directories with breadcrumb support
- **File Editor**: In-browser code editor with syntax highlighting
- **Read/Write Operations**: View and modify files directly
- **Auto-save detection**: Visual indicators for unsaved changes
- **Keyboard shortcuts**: Ctrl+S / Cmd+S to save files

### 🔧 Tool Manager
- **MCP Tool Discovery**: Automatically fetch tools from MCP server
- **Code Generation**: Generate TypeScript wrappers for MCP tools
- **Tool Listing**: View all available tools with their status
- **One-click Refresh**: Update tools with a single click

### 🏠 Dashboard
- **Server Status**: Real-time server health monitoring
- **Quick Actions**: Direct links to key features
- **Feature Overview**: See all available capabilities
- **Server Information**: View server configuration

## Technology Stack

- **Framework**: SvelteKit (Svelte 5 with Runes)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Build Tool**: Vite
- **API Communication**: Fetch API with custom wrapper

## Project Structure

```
ui/
├── src/
│   ├── lib/
│   │   ├── api.ts                    # API client for server communication
│   │   └── components/
│   │       ├── FileBrowser.svelte    # Directory and file browser
│   │       ├── FileEditor.svelte     # Code editor with save functionality
│   │       ├── Navigation.svelte     # Top navigation bar
│   │       └── ToolManager.svelte    # MCP tool management interface
│   ├── routes/
│   │   ├── +layout.svelte           # Main layout with navigation
│   │   ├── +page.svelte             # Dashboard/home page
│   │   ├── files/
│   │   │   └── +page.svelte         # File manager page
│   │   └── tools/
│   │       └── +page.svelte         # Tool manager page
│   ├── app.css                      # Global styles and Tailwind imports
│   └── app.html                     # HTML template
├── static/                          # Static assets
├── vite.config.ts                   # Vite configuration with proxy
└── package.json                     # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Running MCP-CE server on `http://localhost:8000`

### Installation

```bash
# Navigate to ui directory
cd ui

# Install dependencies (using npm, pnpm, or bun)
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The UI will be available at `http://localhost:5173`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## API Integration

The UI communicates with the server through a proxy configuration in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

All API requests are made through `/api/*` which proxies to the server.

### Available Endpoints

- `GET /api/view?dir=<path>` - List files in directory
- `GET /api/read?path=<file>` - Read file content
- `POST /api/write` - Write file content
- `GET /api/refresh-tools` - Refresh MCP tools
- `GET /api/health` - Server health check

## Components

### FileBrowser

Displays directories and files in a tree-like structure.

**Props:**
- `currentPath` (bindable): Current directory path
- `onFileSelect`: Callback when file is selected

**Features:**
- Directory navigation
- Back/Up navigation
- File type icons (folder vs file)
- Loading and error states

### FileEditor

In-browser code editor with save functionality.

**Props:**
- `filePath` (bindable): Path to the file being edited

**Features:**
- Syntax highlighting via `<textarea>` with mono font
- Auto-save detection
- Keyboard shortcuts (Ctrl+S)
- Character and line count
- Loading and error states

### ToolManager

Manages MCP tool wrappers.

**Features:**
- Displays all available tools
- Refresh button to regenerate wrappers
- Tool count badge
- Success/error notifications

### Navigation

Top navigation bar with route links.

**Features:**
- Active route highlighting
- Server status indicator
- Responsive design

## Styling

### Color Scheme

Built with a dark theme using Tailwind's zinc color palette:

- **Background**: `zinc-950`
- **Cards**: `zinc-800`
- **Borders**: `zinc-700`
- **Text**: `white`, `zinc-400`, `zinc-500`
- **Accent**: `blue-600` (primary), `green-600` (success), `red-600` (error)

### Custom Scrollbars

Styled scrollbars for better visual consistency:
- Thin scrollbars (8px width)
- Dark background with lighter thumb
- Hover effects

## Development

### Code Style

- TypeScript for type safety
- Svelte 5 runes mode (`$state`, `$derived`, `$effect`, `$props`)
- Functional components where possible
- Clear prop interfaces

### Best Practices

1. **Error Handling**: All API calls wrapped in try-catch
2. **Loading States**: Visual feedback during async operations
3. **Success Messages**: User confirmation for actions
4. **Accessibility**: Semantic HTML and ARIA labels
5. **Responsive Design**: Mobile-friendly layouts

## Customization

### Changing Server URL

Update the `API_BASE` in `src/lib/api.ts`:

```typescript
const API_BASE = 'http://your-server:port';
```

Or configure the proxy in `vite.config.ts`.

### Theme Colors

Modify color classes in components or extend Tailwind config.

### Adding New Pages

1. Create `src/routes/your-page/+page.svelte`
2. Add route to `Navigation.svelte`
3. Component will be automatically routed by SvelteKit

## Troubleshooting

### Server Connection Issues

- Ensure server is running on `http://localhost:8000`
- Check browser console for CORS errors
- Verify proxy configuration in `vite.config.ts`

### Build Errors

- Clear `.svelte-kit` directory
- Delete `node_modules` and reinstall
- Check for TypeScript errors with `npm run check`

### File Operations Failing

- Check server logs for errors
- Verify file permissions on server
- Ensure paths are relative to server's tools directory

## License

Part of the MCP-CE project.

## Contributing

Contributions welcome! Please ensure:
- TypeScript types are properly defined
- Components are documented
- Error handling is implemented
- Code follows existing patterns
