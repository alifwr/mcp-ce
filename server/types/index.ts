import { z } from 'zod';

/**
 * Request/Response Types
 */
export const writeRequestSchema = z.object({
    path: z.string(),
    content: z.string(),
});

export type WriteRequest = z.infer<typeof writeRequestSchema>;

export interface FileDetails {
    name: string;
    path: string;
    size: number;
    isDirectory: boolean;
    isFile: boolean;
    created: Date;
    modified: Date;
}

export interface FileStats {
    size: number;
    isDirectory: boolean;
    isFile: boolean;
    created: Date;
    modified: Date;
    accessed: Date;
}

/**
 * MCP Tool Types
 */
export interface ToolSchema {
    name: string;
    description: string;
    inputSchema: any;
    outputSchema?: any;
}

export interface MCPToolResponse<T = any> {
    content: Array<{
        type: string;
        text?: string;
    }>;
    structuredContent?: T;
}

/**
 * Code Generation Types
 */
export interface ToolGenerationContext {
    toolName: string;
    description: string;
    inputSchema: any;
    outputSchema?: any;
}

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
    details?: any;
}
