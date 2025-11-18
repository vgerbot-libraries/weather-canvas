import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseDocument } from 'htmlparser2';
import { textContent, findOne, getAttributeValue } from 'domutils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Scan examples directory and generate examples list
 */
function generateExamplesList() {
    const examplesDir = resolve(__dirname, '../examples');
    const examples = [];

    if (!existsSync(examplesDir)) {
        console.warn('examples directory does not exist');
        return examples;
    }

    try {
        const items = readdirSync(examplesDir);

        for (const item of items) {
            const itemPath = resolve(examplesDir, item);
            const stat = statSync(itemPath);

            // Skip index.html (the list page) and non-directory items
            if (!stat.isDirectory()) {
                continue;
            }

            const htmlPath = resolve(itemPath, 'index.html');

            // If index.html exists in the directory, add it to the list
            if (existsSync(htmlPath)) {
                // Read metadata from HTML file
                const meta = extractMetaFromHTML(htmlPath, item);

                examples.push({
                    name: item,
                    ...meta,
                });
            }
        }
    } catch (error) {
        console.error('Failed to scan examples directory:', error);
    }

    return examples;
}

/**
 * Format title (convert kebab-case to Title Case)
 */
function formatTitle(name) {
    return name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Extract metadata from HTML file using htmlparser2
 * @param {string} htmlPath - Path to HTML file
 * @param {string} fallbackName - Fallback name for title
 * @returns {object} - Extracted metadata
 */
function extractMetaFromHTML(htmlPath, fallbackName) {
    const defaultMeta = {
        title: formatTitle(fallbackName),
        description: `${formatTitle(fallbackName)} example`,
        icon: '📦',
    };

    try {
        const htmlContent = readFileSync(htmlPath, 'utf-8');
        const document = parseDocument(htmlContent);

        // Extract title from <title> tag
        const titleElement = findOne(elem => elem.name === 'title', document.children, true);
        if (titleElement) {
            const title = textContent(titleElement).trim();
            if (title) {
                defaultMeta.title = title;
            }
        }

        // Extract description from <meta name="description"> tag
        const descriptionMeta = findOne(
            elem => elem.name === 'meta' && getAttributeValue(elem, 'name') === 'description',
            document.children,
            true
        );
        if (descriptionMeta) {
            const description = getAttributeValue(descriptionMeta, 'content');
            if (description && description.trim()) {
                defaultMeta.description = description.trim();
            }
        }

        // Extract icon from <meta name="icon"> tag (custom meta tag)
        const iconMeta = findOne(
            elem => elem.name === 'meta' && getAttributeValue(elem, 'name') === 'icon',
            document.children,
            true
        );
        if (iconMeta) {
            const icon = getAttributeValue(iconMeta, 'content');
            if (icon && icon.trim()) {
                defaultMeta.icon = icon.trim();
            }
        }
    } catch (e) {
        console.warn(`Failed to parse HTML for ${fallbackName}:`, e.message);
    }

    return defaultMeta;
}

/**
 * Generate and save examples list
 */
function main() {
    const examples = generateExamplesList();
    const outputPath = resolve(__dirname, '../examples', 'examples-list.json');

    writeFileSync(outputPath, JSON.stringify(examples, null, 2), 'utf-8');

    console.log(`✅ Successfully generated examples list, total ${examples.length} example(s)`);
    examples.forEach(example => {
        console.log(`  ${example.icon} ${example.title} (${example.name})`);
    });
}

main();
