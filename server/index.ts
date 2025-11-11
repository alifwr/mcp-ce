import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { serverConfig } from './config';
import { errorHandler, requestLogger, corsMiddleware } from './middleware';
import fileRoutes from './routes/file.routes';
import toolRoutes from './routes/tool.routes';
import { createMcpServer } from './core/mcp-server';

/**
 * Create and configure Express application
 */
function createApp() {
    const app = express();

    // Middleware
    app.use(corsMiddleware);
    app.use(express.json());
    app.use(requestLogger);

    // Routes
    app.use('/', fileRoutes);
    app.use('/', toolRoutes);

    // Health check
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // MCP Server endpoint
    const mcpServer = createMcpServer();
    
    app.post('/mcp', async (req, res) => {
        // Create a new transport for each request to prevent request ID collisions
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        res.on('close', () => {
            transport.close();
        });

        await mcpServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
    });

    // Error handling
    app.use(errorHandler);

    return app;
}

/**
 * Start the server
 */
function startServer() {
    const app = createApp();
    
    app.listen(serverConfig.port, () => {
        console.log(`Server running at http://${serverConfig.host}:${serverConfig.port}`);
        console.log(`Server name: ${serverConfig.name} v${serverConfig.version}`);
    });
}

// Start server if this file is run directly
if (require.main === module) {
    startServer();
}

export { createApp, startServer };