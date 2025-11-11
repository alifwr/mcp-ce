import * as path from 'path';

/**
 * Server configuration
 */
export const serverConfig = {
    port: 8000,
    host: 'localhost',
    name: 'demo-server',
    version: '1.0.0',
};

/**
 * MCP configuration
 */
export const mcpConfig = {
    clientName: 'Test',
    clientVersion: '1.0.0',
    serverUrl: `http://localhost:3000/mcp`,
    connectionType: 'httpStream' as const,
};

/**
 * File system configuration
 */
export const fsConfig = {
    toolsDir: path.resolve(__dirname, '../sandbox/tools'),
    sandboxDir: path.resolve(__dirname, '../sandbox'),
};

/**
 * Code generation configuration
 */
export const codeGenConfig = {
    generateInterfaces: true,
    useCamelCase: true,
};
