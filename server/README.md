# Server Directory Structure

This directory contains a refactored, modular server implementation with clear separation of concerns.

## Directory Structure

```
server/
├── config/              # Configuration files
│   └── index.ts        # Server, MCP, and filesystem configuration
├── core/               # Core server components
│   └── mcp-server.ts   # MCP server initialization and tool registration
├── middleware/         # Express middleware
│   └── index.ts        # Error handling, logging, and CORS middleware
├── routes/             # Route handlers
│   ├── file.routes.ts  # File operation endpoints (/read, /view, /write)
│   └── tool.routes.ts  # Tool management endpoints (/refresh-tools)
├── services/           # Business logic services
│   ├── filesystem.service.ts  # File system operations
│   └── mcp.service.ts         # MCP client interactions
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types and schemas
├── utils/              # Utility functions
│   └── code-generator.ts  # MCP tool wrapper code generation
├── tools/              # Generated MCP tool wrappers
│   ├── add/
│   ├── subtract/
│   └── ...
└── index.ts            # Main server entry point

## Legacy Files (to be removed)
├── ce-wrapper.ts       # Replaced by utils/code-generator.ts
├── filesystem.ts       # Replaced by services/filesystem.service.ts
├── fs-tools.ts         # Empty file
├── mcp.ts              # Replaced by services/mcp.service.ts
└── schemas.ts          # Replaced by types/index.ts
```

## Module Responsibilities

### Config (`config/`)
- Centralized configuration for server, MCP client, filesystem, and code generation
- All constants and settings in one place
- Easy to modify without touching business logic

### Core (`core/`)
- MCP server setup and tool registration
- Core server components that rarely change
- Isolated from route and business logic

### Middleware (`middleware/`)
- `errorHandler`: Catches and formats errors
- `requestLogger`: Logs HTTP requests
- `corsMiddleware`: Handles CORS headers

### Routes (`routes/`)
- **file.routes.ts**: Handles file operations
  - `GET /read` - Read file content
  - `GET /view` - List directory contents
  - `POST /write` - Write to file
  
- **tool.routes.ts**: Handles tool operations
  - `GET /refresh-tools` - Refresh MCP tool wrappers

### Services (`services/`)
- **filesystem.service.ts**: Abstraction over file system operations
  - Methods: readFile, writeFile, listFiles, deleteFile, etc.
  - Singleton pattern for consistent access
  
- **mcp.service.ts**: MCP client management
  - Connection handling
  - Tool calling
  - Response parsing
  - Singleton pattern with connection pooling

### Types (`types/`)
- Centralized TypeScript type definitions
- Request/response schemas
- Shared interfaces across modules

### Utils (`utils/`)
- **code-generator.ts**: Generates TypeScript wrappers for MCP tools
  - String utilities (camelCase, PascalCase conversion)
  - Interface generation from schemas
  - Function wrapper generation
  - File system operations for code generation

## Key Improvements

### 1. **Separation of Concerns**
- Each module has a single, well-defined responsibility
- Easy to locate and modify specific functionality

### 2. **Singleton Pattern**
- Services use singleton pattern for shared state
- Backward compatible helper functions for gradual migration

### 3. **Type Safety**
- Centralized type definitions
- Proper use of TypeScript type imports

### 4. **Error Handling**
- Centralized error handling middleware
- Consistent error responses across all endpoints

### 5. **Testability**
- Modular structure makes unit testing easier
- Services can be mocked in tests
- Routes can be tested independently

### 6. **Maintainability**
- Clear file naming conventions
- Comprehensive documentation
- Easy to extend with new features

### 7. **Configuration Management**
- All configuration in one place
- Easy to switch between environments
- No hardcoded values in business logic

## Usage

### Starting the Server

```typescript
import { startServer } from './server';

startServer();
```

### Using Services

```typescript
import { fileSystemService } from './server/services/filesystem.service';
import { mcpService } from './server/services/mcp.service';

// File operations
const content = await fileSystemService.readFile('path/to/file');
await fileSystemService.writeFile('path/to/file', 'content');

// MCP operations
const tools = await mcpService.getAllTools();
const result = await mcpService.callTool('toolName', { arg: 'value' });
```

### Adding New Routes

1. Create a new route file in `routes/`
2. Import required services
3. Define route handlers
4. Export default router
5. Import and use in `index.ts`

## Migration Notes

The refactored code maintains backward compatibility through helper functions exported from services. Old imports will continue to work:

```typescript
// Still works
import { createMCPClient, callMCPTool } from './mcp';
import { readFile, writeFile } from './filesystem';

// New, preferred way
import { mcpService } from './services/mcp.service';
import { fileSystemService } from './services/filesystem.service';
```

## Next Steps

1. Update tool imports to use new service paths
2. Remove legacy files (ce-wrapper.ts, filesystem.ts, mcp.ts, schemas.ts)
3. Add unit tests for services
4. Add integration tests for routes
5. Add API documentation (Swagger/OpenAPI)
