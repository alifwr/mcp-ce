import { MCPClient } from "mcp-client";
import { mcpConfig } from '../config';
import type { MCPToolResponse, ToolSchema } from '../types';

/**
 * MCP Service
 * Handles all interactions with the MCP server
 */
class MCPService {
    private client: MCPClient | null = null;

    /**
     * Create and connect to MCP client
     */
    async connect(): Promise<MCPClient> {
        if (this.client) {
            return this.client;
        }

        try {
            this.client = new MCPClient({
                name: mcpConfig.clientName,
                version: mcpConfig.clientVersion,
            });

            await this.client.connect({
                type: mcpConfig.connectionType,
                url: mcpConfig.serverUrl,
            });

            return this.client;
        } catch (error) {
            throw new Error(`Failed to connect to MCP server: ${error}`);
        }
    }

    /**
     * Disconnect from MCP client
     */
    async disconnect(): Promise<void> {
        if (this.client) {
            // Add disconnect logic if available in MCPClient
            this.client = null;
        }
    }

    /**
     * Get the current client instance
     */
    getClient(): MCPClient | null {
        return this.client;
    }

    /**
     * Call a tool on the MCP server
     */
    async callTool<T = any>(toolName: string, input: any): Promise<MCPToolResponse<T>> {
        try {
            const client = await this.connect();
            return await client.callTool({
                name: toolName,
                arguments: input,
            });
        } catch (error) {
            throw new Error(`Failed to call MCP tool '${toolName}': ${error}`);
        }
    }

    /**
     * Get all available tools from the MCP server
     */
    async getAllTools(): Promise<any[]> {
        try {
            const client = await this.connect();
            return await client.getAllTools();
        } catch (error) {
            throw new Error(`Failed to get tools from MCP server: ${error}`);
        }
    }

    /**
     * Parse the response from an MCP tool call
     */
    parseToolResponse<T>(response: MCPToolResponse<T>): T {
        const textContent = response.content.find(c => c.type === 'text');
        if (textContent && 'text' in textContent && textContent.text) {
            return JSON.parse(textContent.text);
        }
        throw new Error('Invalid response from MCP tool');
    }
}

// Export a singleton instance
export const mcpService = new MCPService();

// Export helper functions for backward compatibility
export const createMCPClient = () => mcpService.connect();
export const callMCPTool = <T>(toolName: string, input: any) => mcpService.callTool<T>(toolName, input);
