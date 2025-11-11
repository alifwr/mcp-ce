import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

/**
 * Error handling middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Error:', err);

    if (err instanceof z.ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.errors
        });
        return;
    }

    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
}

/**
 * CORS middleware
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    
    next();
}
