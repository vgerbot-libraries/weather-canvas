import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';
import viteTsconfigPaths from 'vite-tsconfig-paths';

/**
 * Dynamically scan examples directory and get all example entry points
 */
function getExampleEntries() {
    const examplesDir = resolve(__dirname, 'examples');
    const entries: Record<string, string> = {};

    if (!existsSync(examplesDir)) {
        return entries;
    }

    try {
        const items = readdirSync(examplesDir);

        for (const item of items) {
            const itemPath = resolve(examplesDir, item);
            const stat = statSync(itemPath);

            // Only process directories
            if (stat.isDirectory()) {
                const htmlPath = resolve(itemPath, 'index.html');

                // If index.html exists in the directory, add it as an entry
                if (existsSync(htmlPath)) {
                    entries[item] = htmlPath;
                }
            }
        }
    } catch (error) {
        console.error('Failed to read examples directory:', error);
    }

    return entries;
}

export default defineConfig({
    plugins: [
        viteTsconfigPaths(), // Support TypeScript path aliases
    ],
    root: 'examples',
    build: {
        outDir: '../dist-examples',
        emptyOutDir: true,
        rollupOptions: {
            input: getExampleEntries(),
        },
    },
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 3000,
        open: true,
        fs: {
            // Allow access to project root files
            allow: ['..'],
        },
    },
});
