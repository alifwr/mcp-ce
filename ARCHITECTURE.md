# Server Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Express Application                         │
│                           (server/index.ts)                          │
└───────────────┬─────────────────────────────────────────────────────┘
                │
                ├─► Middleware Layer
                │   ├── CORS Middleware
                │   ├── JSON Parser
                │   ├── Request Logger
                │   └── Error Handler
                │
                ├─► Routes Layer
                │   │
                │   ├── File Routes (/read, /view, /write)
                │   │   └─► FileSystemService
                │   │
                │   └── Tool Routes (/refresh-tools)
                │       ├─► MCPService
                │       └─► CodeGenerator
                │
                └─► Services Layer
                    │
                    ├── MCPService (Singleton)
                    │   ├── connect()
                    │   ├── callTool()
                    │   ├── getAllTools()
                    │   └── parseToolResponse()
                    │
                    └── FileSystemService (Singleton)
                        ├── readFile()
                        ├── writeFile()
                        ├── listFiles()
                        ├── deleteFile()
                        └── ... (10+ methods)

┌─────────────────────────────────────────────────────────────────────┐
│                         Supporting Modules                           │
└─────────────────────────────────────────────────────────────────────┘

Config Module                Types Module              Utils Module
├── serverConfig            ├── WriteRequest          └── CodeGenerator
├── mcpConfig              ├── FileDetails                ├── generateToolFile()
├── fsConfig               ├── FileStats                  ├── processTools()
└── codeGenConfig          ├── ToolSchema                 └── StringUtils
                           ├── MCPToolResponse                ├── toCamelCase()
                           └── ApiResponse                    └── toPascalCase()

┌─────────────────────────────────────────────────────────────────────┐
│                         Request Flow Example                         │
└─────────────────────────────────────────────────────────────────────┘

GET /refresh-tools
     │
     ├─► Middleware: CORS → JSON Parser → Logger
     │
     ├─► Route: tool.routes.ts
     │    │
     │    ├─► MCPService.getAllTools()
     │    │    └─► Connects to MCP Server
     │    │         └─► Returns tool definitions
     │    │
     │    └─► CodeGenerator.processTools(tools)
     │         │
     │         ├─► For each tool:
     │         │    ├── Generate TypeScript interfaces
     │         │    ├── Generate wrapper function
     │         │    └── Write to server/tools/{name}/{name}.ts
     │         │
     │         └─► Return success response
     │
     └─► Middleware: Error Handler (if needed)


POST /write
     │
     ├─► Middleware: CORS → JSON Parser → Logger
     │
     ├─► Route: file.routes.ts
     │    │
     │    ├─► Validate request with Zod schema
     │    │
     │    └─► FileSystemService.writeFile(path, content)
     │         └─► fs.writeFile() with error handling
     │
     └─► Response: { message: "File written successfully", data: {...} }


┌─────────────────────────────────────────────────────────────────────┐
│                    Dependency Graph                                  │
└─────────────────────────────────────────────────────────────────────┘

index.ts
  ├── requires: config
  ├── requires: middleware
  ├── requires: routes/file.routes
  └── requires: routes/tool.routes

routes/*.routes.ts
  ├── requires: services/mcp.service
  ├── requires: services/filesystem.service
  ├── requires: utils/code-generator
  └── requires: types

services/*.service.ts
  ├── requires: config
  └── requires: types

utils/code-generator.ts
  ├── requires: config
  ├── requires: types
  └── requires: services/mcp.service


┌─────────────────────────────────────────────────────────────────────┐
│                  Tool Generation Flow                                │
└─────────────────────────────────────────────────────────────────────┘

External MCP Server
     │
     ├─► Provides tool definitions:
     │   { name: "add", inputSchema: {...}, outputSchema: {...} }
     │
     └─► MCPService.getAllTools()
          │
          └─► CodeGenerator.processTools()
               │
               ├─► Generate Input Interface
               │   interface AddInput { a: number; b: number; }
               │
               ├─► Generate Output Interface
               │   interface AddOutput { result: number; }
               │
               ├─► Generate Wrapper Function
               │   export async function add(input: AddInput): Promise<AddOutput> {
               │     const response = await callMCPTool('add', input);
               │     return JSON.parse(response.content[0].text);
               │   }
               │
               └─► Write to server/tools/add/add.ts


┌─────────────────────────────────────────────────────────────────────┐
│                    Error Handling Flow                               │
└─────────────────────────────────────────────────────────────────────┘

Request
  │
  ├─► Route Handler (try-catch)
  │    │
  │    ├─► Service Call
  │    │    │
  │    │    └─► Error thrown
  │    │         │
  │    │         ├─► ZodError → 400 Bad Request
  │    │         │    { error: "Validation failed", details: [...] }
  │    │         │
  │    │         └─► Other Error → 500 Internal Server Error
  │    │              { error: "...", message: "..." }
  │    │
  │    └─► Caught by errorHandler middleware
  │
  └─► Response with appropriate status code and error message
```

## Key Design Patterns

### 1. Singleton Pattern
```typescript
// Services are singletons
export const mcpService = new MCPService();
export const fileSystemService = new FileSystemService();
export const codeGenerator = new CodeGenerator();
```

### 2. Dependency Injection
```typescript
// Config injected into services
class FileSystemService {
    constructor() {
        this.toolsDir = fsConfig.toolsDir;
    }
}
```

### 3. Factory Pattern
```typescript
// createApp creates configured Express instance
export function createApp() {
    const app = express();
    // Configure middleware, routes, etc.
    return app;
}
```

### 4. Middleware Pattern
```typescript
// Composable middleware functions
app.use(corsMiddleware);
app.use(express.json());
app.use(requestLogger);
app.use(errorHandler);
```

### 5. Service Layer Pattern
```typescript
// Business logic separated from routes
router.get('/read', async (req, res) => {
    const content = await fileSystemService.readFile(path);
    res.send({ data: content });
});
```
