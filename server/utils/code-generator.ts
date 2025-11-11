import { promises as fs } from 'fs';
import * as path from 'path';
import { codeGenConfig, fsConfig } from '../config';
import type { ToolGenerationContext } from '../types';

/**
 * String utilities for code generation
 */
export class StringUtils {
    /**
     * Convert string to camelCase
     */
    static toCamelCase(str: string): string {
        return str
            .replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^[A-Z]/, char => char.toLowerCase());
    }

    /**
     * Convert string to PascalCase
     */
    static toPascalCase(str: string): string {
        return str
            .replace(/[-_\s]+(.)/g, (_, char) => char.toUpperCase())
            .replace(/^[a-z]/, char => char.toUpperCase());
    }
}

/**
 * Code Generator Utility
 * Generates TypeScript tool wrappers from MCP tool definitions
 */
export class CodeGenerator {
    private toolsDir: string;

    constructor() {
        this.toolsDir = fsConfig.toolsDir;
    }

    /**
     * Generate TypeScript interface from schema
     */
    private generateInterface(name: string, schema: any): string {
        let content = `interface ${name} {\n`;
        
        const properties = schema?.properties || {};
        for (const [propName, propType] of Object.entries(properties)) {
            const typeAnnotation = (propType as any)?.type || 'any';
            content += `    ${propName}: ${typeAnnotation};\n`;
        }
        
        content += `}\n\n`;
        return content;
    }

    /**
     * Generate input interface
     */
    private generateInputInterface(toolName: string, inputSchema: any): string {
        const interfaceName = `${StringUtils.toPascalCase(toolName)}Input`;
        return this.generateInterface(interfaceName, inputSchema);
    }

    /**
     * Generate output interface
     */
    private generateOutputInterface(toolName: string, outputSchema: any): string {
        const interfaceName = `${StringUtils.toPascalCase(toolName)}Output`;
        return this.generateInterface(interfaceName, outputSchema);
    }

    /**
     * Generate function wrapper for MCP tool
     */
    private generateFunction(toolName: string): string {
        const pascalName = StringUtils.toPascalCase(toolName);
        const camelName = codeGenConfig.useCamelCase 
            ? StringUtils.toCamelCase(toolName)
            : toolName;
        
        return `export async function ${camelName}(input: ${pascalName}Input): Promise<${pascalName}Output> {\n` +
            `    const response = await callMCPTool<${pascalName}Output>('${toolName}', input);\n` +
            `    const textContent = response.content.find(c => c.type === 'text');\n` +
            `    if (textContent && 'text' in textContent && textContent.text) {\n` +
            `        return JSON.parse(textContent.text);\n` +
            `    }\n` +
            `    throw new Error('Invalid response from MCP tool');\n` +
            `}\n`;
    }

    /**
     * Generate complete tool file content
     */
    generateToolFile(context: ToolGenerationContext): string {
        let content = '';
        
        // Add description comment
        if (context.description) {
            content += `// ${context.description}\n`;
        }
        
        // Add imports
        content += `import { callMCPTool } from '../../services/mcp.service';\n\n`;
        
        // Generate interfaces if enabled
        if (codeGenConfig.generateInterfaces) {
            content += this.generateInputInterface(context.toolName, context.inputSchema);
            
            if (context.outputSchema) {
                content += this.generateOutputInterface(context.toolName, context.outputSchema);
            }
        }
        
        // Generate function
        content += this.generateFunction(context.toolName);
        
        return content;
    }

    /**
     * Create directory for a tool
     */
    async createToolDirectory(toolName: string): Promise<string> {
        const toolDir = path.join(this.toolsDir, toolName);
        await fs.mkdir(toolDir, { recursive: true });
        return toolDir;
    }

    /**
     * Write tool file to disk
     */
    async writeToolFile(toolDir: string, toolName: string, content: string): Promise<void> {
        const toolPath = path.join(toolDir, `${toolName}.ts`);
        await fs.writeFile(toolPath, content, 'utf-8');
    }

    /**
     * Process and generate files for all tools
     */
    async processTools(tools: any[]): Promise<void> {
        for (const tool of tools) {
            const context: ToolGenerationContext = {
                toolName: tool.name,
                description: tool.description,
                inputSchema: tool.inputSchema,
                outputSchema: tool.outputSchema,
            };

            const toolDir = await this.createToolDirectory(tool.name);
            const content = this.generateToolFile(context);
            await this.writeToolFile(toolDir, tool.name, content);
        }
    }
}

// Export singleton instance
export const codeGenerator = new CodeGenerator();

// Export helper function for backward compatibility
export const processTools = (tools: any[]) => codeGenerator.processTools(tools);
