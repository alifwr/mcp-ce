import { promises as fs } from 'fs';
import * as path from 'path';
import { fsConfig } from '../config';
import type { FileDetails, FileStats } from '../types';

/**
 * Filesystem Service
 * Handles all file system operations
 */
class FileSystemService {
    private toolsDir: string;
    private sandboxDir: string;

    constructor() {
        this.toolsDir = fsConfig.toolsDir;
        this.sandboxDir = fsConfig.sandboxDir;
    }

    /**
     * List all files and directories in a given directory
     */
    async listFiles(dirPath: string): Promise<string[]> {
        try {
            const fullPath = path.join(this.toolsDir, dirPath);
            const files = await fs.readdir(fullPath);
            return files;
        } catch (error) {
            throw new Error(`Failed to list files in ${dirPath}: ${error}`);
        }
    }

    /**
     * List files with detailed information (name, size, type, etc.)
     */
    async listFilesDetailed(dirPath: string): Promise<FileDetails[]> {
        try {
            const files = await fs.readdir(dirPath);
            const fileDetails = await Promise.all(
                files.map(async (file) => {
                    const filePath = path.join(dirPath, file);
                    const stats = await fs.stat(filePath);
                    return {
                        name: file,
                        path: filePath,
                        size: stats.size,
                        isDirectory: stats.isDirectory(),
                        isFile: stats.isFile(),
                        created: stats.birthtime,
                        modified: stats.mtime
                    };
                })
            );
            return fileDetails;
        } catch (error) {
            throw new Error(`Failed to list files in ${dirPath}: ${error}`);
        }
    }

    /**
     * Read file content
     */
    async readFile(filePath: string): Promise<string> {
        try {
            const fullPath = path.join(this.toolsDir, filePath);
            const content = await fs.readFile(fullPath, 'utf-8');
            return content;
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error}`);
        }
    }

    /**
     * Write content to a file
     */
    async writeFile(filePath: string, content: string): Promise<void> {
        try {
            const fullPath = path.join(this.sandboxDir, filePath);
            await fs.writeFile(fullPath, content, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to write file ${filePath}: ${error}`);
        }
    }

    /**
     * Append content to a file
     */
    async appendFile(filePath: string, content: string): Promise<void> {
        try {
            await fs.appendFile(filePath, content, 'utf-8');
        } catch (error) {
            throw new Error(`Failed to append to file ${filePath}: ${error}`);
        }
    }

    /**
     * Delete a file
     */
    async deleteFile(filePath: string): Promise<void> {
        try {
            await fs.unlink(filePath);
        } catch (error) {
            throw new Error(`Failed to delete file ${filePath}: ${error}`);
        }
    }

    /**
     * Create a directory
     */
    async createDirectory(dirPath: string): Promise<void> {
        try {
            await fs.mkdir(dirPath, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to create directory ${dirPath}: ${error}`);
        }
    }

    /**
     * Delete a directory
     */
    async deleteDirectory(dirPath: string): Promise<void> {
        try {
            await fs.rmdir(dirPath, { recursive: true });
        } catch (error) {
            throw new Error(`Failed to delete directory ${dirPath}: ${error}`);
        }
    }

    /**
     * Check if a file or directory exists
     */
    async exists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get file or directory stats
     */
    async getStats(filePath: string): Promise<FileStats> {
        try {
            const stats = await fs.stat(filePath);
            return {
                size: stats.size,
                isDirectory: stats.isDirectory(),
                isFile: stats.isFile(),
                created: stats.birthtime,
                modified: stats.mtime,
                accessed: stats.atime
            };
        } catch (error) {
            throw new Error(`Failed to get stats for ${filePath}: ${error}`);
        }
    }

    /**
     * Copy a file
     */
    async copyFile(sourcePath: string, destinationPath: string): Promise<void> {
        try {
            await fs.copyFile(sourcePath, destinationPath);
        } catch (error) {
            throw new Error(`Failed to copy file from ${sourcePath} to ${destinationPath}: ${error}`);
        }
    }

    /**
     * Move/Rename a file
     */
    async moveFile(sourcePath: string, destinationPath: string): Promise<void> {
        try {
            await fs.rename(sourcePath, destinationPath);
        } catch (error) {
            throw new Error(`Failed to move file from ${sourcePath} to ${destinationPath}: ${error}`);
        }
    }
}

// Export a singleton instance
export const fileSystemService = new FileSystemService();

// Export helper functions for backward compatibility
export const listFiles = (dirPath: string) => fileSystemService.listFiles(dirPath);
export const readFile = (filePath: string) => fileSystemService.readFile(filePath);
export const writeFile = (filePath: string, content: string) => fileSystemService.writeFile(filePath, content);
