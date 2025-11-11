import { Router } from 'express';
import type { Request, Response } from 'express';
import { mcpService } from '../services/mcp.service';
import { processTools } from '../utils/code-generator';

const router = Router();

/**
 * GET /refresh-tools
 * Refresh and regenerate MCP tool wrappers
 */
router.get('/refresh-tools', async (req: Request, res: Response) => {
    try {
        const tools = await mcpService.getAllTools();
        await processTools(tools);

        const response = {
            message: 'Tools refreshed successfully',
            data: {
                count: tools.length,
                tools: tools.map((t: any) => t.name)
            }
        };
        
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ 
            error: 'Failed to refresh tools',
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
