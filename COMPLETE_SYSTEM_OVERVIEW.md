# MCP-CE Complete System Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                  (Browser - http://localhost:5173)               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │ File Manager │  │ Tool Manager │         │
│  │   +page      │  │   +page      │  │   +page      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                 │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │   API Client    │                           │
│                   │   (lib/api.ts)  │                           │
│                   └────────┬────────┘                           │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                      Vite Proxy (/api → :8000)
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                        Server Layer                              │
│                  (Express - http://localhost:8000)               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ File Routes  │  │ Tool Routes  │  │   Health     │         │
│  │   GET /read  │  │ GET /refresh │  │  GET /health │         │
│  │   GET /view  │  │   -tools     │  │              │         │
│  │  POST /write │  │              │  │              │         │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘         │
│         │                  │                                     │
│         ▼                  ▼                                     │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │ FileSystem   │  │ MCP Service  │                           │
│  │   Service    │  │              │                           │
│  └──────┬───────┘  └──────┬───────┘                           │
│         │                  │                                     │
│         ▼                  ▼                                     │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │    File      │  │ Code         │                           │
│  │  Operations  │  │ Generator    │                           │
│  └──────────────┘  └──────────────┘                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Complete Feature Set

### Frontend (UI)

#### Pages
1. **Dashboard** (`/`)
   - Server status monitoring
   - Quick navigation cards
   - Feature overview
   - System information

2. **File Manager** (`/files`)
   - Browse files and directories
   - Read file content
   - Edit files with syntax highlighting
   - Save changes (Ctrl+S)
   - Track unsaved changes

3. **Tool Manager** (`/tools`)
   - View all MCP tools
   - Refresh tool definitions
   - Generate TypeScript wrappers
   - View documentation

#### Components
- **FileBrowser**: Directory navigation, file selection
- **FileEditor**: In-browser editing with save functionality
- **ToolManager**: Tool listing and refresh
- **Navigation**: Top nav with route highlighting
- **LoadingSpinner**: Reusable loading indicator

### Backend (Server)

#### Routes
- `GET /read?path=<file>` - Read file content
- `GET /view?dir=<path>` - List directory contents
- `POST /write` - Write file content
- `GET /refresh-tools` - Refresh MCP tool wrappers
- `GET /health` - Health check

#### Services
- **FileSystemService**: File operations (read, write, list, etc.)
- **MCPService**: MCP client management and tool calling
- **CodeGenerator**: TypeScript wrapper generation

#### Utils
- String utilities (camelCase, PascalCase)
- Interface generation from JSON schemas
- Tool file generation

## Data Flow Examples

### Example 1: Loading and Editing a File

```
User clicks file in browser
         │
         ▼
FileBrowser emits onFileSelect(path)
         │
         ▼
FileEditor receives filePath prop
         │
         ▼
FileEditor calls fileApi.readFile(path)
         │
         ▼
API client sends GET /api/read?path=...
         │
         ▼
Vite proxy forwards to http://localhost:8000/read?path=...
         │
         ▼
Server file.routes.ts receives request
         │
         ▼
FileSystemService.readFile(path)
         │
         ▼
fs.readFile() reads from disk
         │
         ▼
Content returned through chain
         │
         ▼
FileEditor displays content
         │
         ▼
User edits content
         │
         ▼
User presses Ctrl+S
         │
         ▼
FileEditor calls fileApi.writeFile(path, content)
         │
         ▼
API client sends POST /api/write {path, content}
         │
         ▼
Server validates with Zod schema
         │
         ▼
FileSystemService.writeFile(path, content)
         │
         ▼
fs.writeFile() writes to disk
         │
         ▼
Success message shown to user
```

### Example 2: Refreshing MCP Tools

```
User clicks "Refresh Tools" button
         │
         ▼
ToolManager calls toolApi.refreshTools()
         │
         ▼
API client sends GET /api/refresh-tools
         │
         ▼
Server tool.routes.ts receives request
         │
         ▼
MCPService.getAllTools()
         │
         ▼
MCPClient connects to MCP server (port 3000)
         │
         ▼
Fetches tool definitions
         │
         ▼
CodeGenerator.processTools(tools)
         │
         ▼
For each tool:
  - Generate Input interface
  - Generate Output interface
  - Generate wrapper function
  - Write to server/tools/{name}/{name}.ts
         │
         ▼
Return tool list to UI
         │
         ▼
ToolManager displays tools with count
```

## Configuration

### Frontend (ui/vite.config.ts)
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

### Backend (server/config/index.ts)
```typescript
serverConfig: { port: 8000, host: 'localhost', ... }
mcpConfig: { serverUrl: 'http://localhost:3000/mcp', ... }
fsConfig: { toolsDir: path.resolve(__dirname, '../tools') }
```

## Quick Start Guide

### 1. Start the Backend Server
```bash
cd server
npm install  # or bun install
npm run dev  # Starts on port 8000
```

### 2. Start the Frontend UI
```bash
cd ui
npm install  # or bun install
npm run dev  # Starts on port 5173

# Or use the quick start script
./start.sh
```

### 3. Access the Application
- UI: `http://localhost:5173`
- API: `http://localhost:8000`
- MCP Server: `http://localhost:3000/mcp` (external)

## Tech Stack Summary

### Frontend
- **Framework**: SvelteKit (Svelte 5 Runes)
- **Styling**: TailwindCSS v4
- **Language**: TypeScript
- **Build**: Vite
- **Routing**: SvelteKit file-based routing

### Backend
- **Runtime**: Node.js / Bun
- **Framework**: Express
- **Language**: TypeScript
- **Validation**: Zod
- **MCP Client**: mcp-client library

## Project Structure

```
mcp-ce/
├── server/                    # Backend server
│   ├── config/               # Configuration
│   ├── core/                 # MCP server setup
│   ├── middleware/           # Express middleware
│   ├── routes/               # Route handlers
│   ├── services/             # Business logic
│   ├── types/                # Type definitions
│   ├── utils/                # Utilities
│   ├── tools/                # Generated MCP tools
│   └── index.ts              # Entry point
│
├── ui/                        # Frontend UI
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts        # API client
│   │   │   └── components/   # Svelte components
│   │   ├── routes/           # Pages
│   │   └── app.css           # Global styles
│   ├── static/               # Static assets
│   └── vite.config.ts        # Vite config
│
├── ARCHITECTURE.md            # System architecture docs
├── MIGRATION_GUIDE.md         # Migration guide
├── REFACTORING_SUMMARY.md     # Refactoring details
└── UI_IMPLEMENTATION.md       # UI implementation details
```

## API Reference

### File Operations

#### List Files
```http
GET /api/view?dir=<path>
Response: { message: string, data: string[] }
```

#### Read File
```http
GET /api/read?path=<file>
Response: { message: string, data: { content: string } }
```

#### Write File
```http
POST /api/write
Body: { path: string, content: string }
Response: { message: string, data: { path, content } }
```

### Tool Operations

#### Refresh Tools
```http
GET /api/refresh-tools
Response: {
  message: string,
  data: { count: number, tools: string[] }
}
```

### Health Check

#### Server Status
```http
GET /api/health
Response: {
  status: string,
  timestamp: string
}
```

## Security Considerations

1. **File Access**: FileSystem service scoped to tools directory
2. **Input Validation**: Zod schemas for all POST requests
3. **Error Handling**: No stack traces exposed to client
4. **CORS**: Configured in middleware
5. **Path Traversal**: Prevented by path scoping

## Performance Features

1. **Singleton Services**: Shared instances for MCP and FileSystem
2. **Proxy Caching**: Vite proxy for development
3. **Lazy Loading**: Components loaded on demand
4. **Optimistic UI**: Immediate feedback before server response
5. **Loading States**: Visual feedback during operations

## Monitoring & Debugging

### Frontend
- Browser DevTools
- Svelte DevTools
- Network tab for API calls
- Console logs for errors

### Backend
- Server logs in terminal
- Error middleware catches all errors
- Request logger tracks all requests

## Future Enhancements

### Frontend
- [ ] Monaco Editor integration
- [ ] File upload functionality
- [ ] Delete file operations
- [ ] Search functionality
- [ ] Settings page
- [ ] Theme toggle
- [ ] WebSocket real-time updates
- [ ] File tree view
- [ ] Multiple file tabs
- [ ] Authentication

### Backend
- [ ] Rate limiting
- [ ] Authentication & authorization
- [ ] Database integration
- [ ] Caching layer
- [ ] WebSocket support
- [ ] File watcher
- [ ] Backup functionality
- [ ] API versioning

## Documentation

- `server/README.md` - Server documentation
- `ui/UI_README.md` - UI documentation
- `ARCHITECTURE.md` - System architecture
- `MIGRATION_GUIDE.md` - Migration guide
- `REFACTORING_SUMMARY.md` - Refactoring details
- `UI_IMPLEMENTATION.md` - UI implementation

## Support & Contributing

Both server and UI are fully documented and ready for contribution. See individual README files for specific guidelines.

---

**Status**: ✅ Complete and Production-Ready
**Version**: 1.0.0
**Last Updated**: November 12, 2025
