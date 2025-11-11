/**
 * Barrel exports for easy importing of server modules
 * Usage: import { mcpService, fileSystemService } from './server'
 */

// Services
export { mcpService, createMCPClient, callMCPTool } from './services/mcp.service';
export { fileSystemService, listFiles, readFile, writeFile } from './services/filesystem.service';

// Utils
export { codeGenerator, processTools } from './utils/code-generator';

// Config
export { serverConfig, mcpConfig, fsConfig, codeGenConfig } from './config';

// Types
export type {
    WriteRequest,
    FileDetails,
    FileStats,
    ToolSchema,
    MCPToolResponse,
    ToolGenerationContext,
    ApiResponse
} from './types';

// Core
export { createMcpServer } from './core/mcp-server';

// Main server
export { createApp, startServer } from './index';
