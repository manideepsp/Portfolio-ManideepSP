import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to transform relative image URLs to absolute GitHub raw URLs
 */
function rehypeTransformImages(options = {}) {
  const { repoUrl } = options;
  
  return (tree) => {
    if (!repoUrl) return;
    
    // Parse owner/repo from GitHub URL
    let owner, repo;
    try {
      const url = new URL(repoUrl);
      const parts = url.pathname.replace(/^\//, '').replace(/\.git$/, '').split('/');
      owner = parts[0];
      repo = parts[1];
    } catch {
      return;
    }
    
    if (!owner || !repo) return;
    
    const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/main`;
    
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && node.properties?.src) {
        const src = node.properties.src;
        // Skip if already absolute URL
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
          return;
        }
        // Transform relative path to absolute GitHub raw URL
        const cleanSrc = src.startsWith('./') ? src.slice(2) : src.startsWith('/') ? src.slice(1) : src;
        node.properties.src = `${rawBase}/${cleanSrc}`;
      }
    });
  };
}

export async function renderMarkdown(md = '', options = {}) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTransformImages, options)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
