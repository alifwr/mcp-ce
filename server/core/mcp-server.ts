import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { serverConfig } from '../config';

/**
 * Initialize and configure the MCP Server
 */
export function createMcpServer(): McpServer {
    const mcpServer = new McpServer({
        name: serverConfig.name,
        version: serverConfig.version
    });

    // Register writeFile tool
    mcpServer.registerTool(
        'writeFile',
        {
            title: 'Write File Tool',
            description: 'Write content to a specified file path',
            inputSchema: { path: z.string(), content: z.string() },
            outputSchema: { success: z.boolean() }
        },
        async ({ path, content }) => {
            const fs = await import('fs/promises');
            await fs.writeFile(path, content, 'utf-8');
            const output = { success: true };
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        }
    );

    // Register readFile tool
    mcpServer.registerTool(
        'readFile',
        {
            title: 'Read File Tool',
            description: 'Read content from a specified file path',
            inputSchema: { path: z.string() },
            outputSchema: { content: z.string() }
        },
        async ({ path }) => {
            const fs = await import('fs/promises');
            const content = await fs.readFile(path, 'utf-8');
            const output = { content };
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        }
    );

    // Register listFiles tool
    mcpServer.registerTool(
        'listFiles',
        {
            title: 'List Files Tool',
            description: 'List files in a specified directory',
            inputSchema: { dirPath: z.string().optional() },
            outputSchema: { files: z.array(z.string()) }
        },
        async ({ dirPath }) => {
            const fs = await import('fs/promises');
            const files = await fs.readdir(dirPath || '.');
            const output = { files };
            return {
                content: [{ type: 'text', text: JSON.stringify(output) }],
                structuredContent: output
            };
        }
    );

    return mcpServer;
}
