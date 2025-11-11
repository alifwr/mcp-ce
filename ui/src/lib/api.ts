/**
 * API Client for MCP-CE Server
 * Base URL is proxied through Vite in development
 */

const API_BASE = import.meta.env.DEV ? '/api' : 'http://localhost:8000';

export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
    details?: any;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * File Operations API
 */
export const fileApi = {
    /**
     * List files in a directory
     */
    async listFiles(dirPath: string = '.'): Promise<string[]> {
        const params = new URLSearchParams({ dir: dirPath });
        const response = await apiRequest<string[]>(`/view?${params}`);
        return response.data || [];
    },

    /**
     * Read file content
     */
    async readFile(filePath: string): Promise<string> {
        const params = new URLSearchParams({ path: filePath });
        const response = await apiRequest<{ content: string }>(`/read?${params}`);
        return response.data?.content || '';
    },

    /**
     * Write content to a file
     */
    async writeFile(filePath: string, content: string): Promise<void> {
        await apiRequest('/write', {
            method: 'POST',
            body: JSON.stringify({ path: filePath, content }),
        });
    },
};

/**
 * Tool Operations API
 */
export const toolApi = {
    /**
     * Refresh MCP tools
     */
    async refreshTools(): Promise<{ count: number; tools: string[] }> {
        const response = await apiRequest<{ count: number; tools: string[] }>('/refresh-tools');
        return response.data || { count: 0, tools: [] };
    },
};

/**
 * Health Check API
 */
export const healthApi = {
    async check(): Promise<{ status: string; timestamp: string }> {
        const response = await apiRequest<{ status: string; timestamp: string }>('/health');
        return response.data || { status: 'unknown', timestamp: new Date().toISOString() };
    },
};

export default {
    file: fileApi,
    tool: toolApi,
    health: healthApi,
};
