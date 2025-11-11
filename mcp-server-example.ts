import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { z } from 'zod';

// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0'
});

// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a + b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a subtraction tool
server.registerTool(
    'subtract',
    {
        title: 'Subtraction Tool',
        description: 'Subtract b from a',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a - b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a multiplication tool
server.registerTool(
    'multiply',
    {
        title: 'Multiplication Tool',
        description: 'Multiply two numbers',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a * b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a division tool
server.registerTool(
    'divide',
    {
        title: 'Division Tool',
        description: 'Divide a by b',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        const output = { result: a / b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a modulo tool
server.registerTool(
    'modulo',
    {
        title: 'Modulo Tool',
        description: 'Calculate the remainder of a divided by b',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        if (b === 0) {
            throw new Error('Modulo by zero is not allowed');
        }
        const output = { result: a % b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a power tool
server.registerTool(
    'power',
    {
        title: 'Power Tool',
        description: 'Raise a to the power of b',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: Math.pow(a, b) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a square root tool
server.registerTool(
    'sqrt',
    {
        title: 'Square Root Tool',
        description: 'Calculate the square root of a number',
        inputSchema: { value: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ value }) => {
        if (value < 0) {
            throw new Error('Cannot calculate square root of negative number');
        }
        const output = { result: Math.sqrt(value) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add an absolute value tool
server.registerTool(
    'abs',
    {
        title: 'Absolute Value Tool',
        description: 'Calculate the absolute value of a number',
        inputSchema: { value: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ value }) => {
        const output = { result: Math.abs(value) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a rounding tool
server.registerTool(
    'round',
    {
        title: 'Round Tool',
        description: 'Round a number to the nearest integer',
        inputSchema: { value: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ value }) => {
        const output = { result: Math.round(value) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a floor tool
server.registerTool(
    'floor',
    {
        title: 'Floor Tool',
        description: 'Round down a number to the nearest integer',
        inputSchema: { value: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ value }) => {
        const output = { result: Math.floor(value) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a ceiling tool
server.registerTool(
    'ceil',
    {
        title: 'Ceiling Tool',
        description: 'Round up a number to the nearest integer',
        inputSchema: { value: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ value }) => {
        const output = { result: Math.ceil(value) };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI
        description: 'Dynamic greeting generator'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`
            }
        ]
    })
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
    // Create a new transport for each request to prevent request ID collisions
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});