import { Router } from 'express';
import type { Request, Response } from 'express';
import { fileSystemService } from '../services/filesystem.service';
import { writeRequestSchema } from '../types';
import { z } from 'zod';

const router = Router();

/**
 * GET /read
 * Read content from a file
 */
router.get('/read', async (req: Request, res: Response) => {
    try {
        if (!req.query.path || typeof req.query.path !== 'string') {
            res.status(400).send({ error: 'Missing or invalid "path" query parameter' });
            return;
        }

        const fileContent = await fileSystemService.readFile(req.query.path);
        const response = {
            message: 'File read successfully',
            data: { content: fileContent }
        };

        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to read file' });
    }
});

/**
 * GET /view
 * List files in a directory
 */
router.get('/view', async (req: Request, res: Response) => {
    try {
        const dirPath = typeof req.query.dir === 'string' ? req.query.dir : '.';
        const files = await fileSystemService.listFiles(dirPath);
        
        const response = {
            message: 'Files listed successfully',
            data: files
        };

        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to list files' });
    }
});

/**
 * POST /write
 * Write content to a file
 */
router.post('/write', async (req: Request, res: Response) => {
    try {
        // Validate request body against schema
        const validatedData = writeRequestSchema.parse(req.body);

        await fileSystemService.writeFile(validatedData.path, validatedData.content);
        
        const response = {
            message: 'File written successfully',
            data: validatedData
        };
        
        res.send(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).send({
                error: 'Validation failed',
                details: error.errors
            });
        } else {
            console.error(error);
            res.status(500).send({ error: 'Failed to write file' });
        }
    }
});

export default router;
