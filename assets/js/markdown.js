/* ============================================
   MARKDOWN PROCESSING & RENDERING
   TOC generation, syntax highlighting, copy buttons
   ============================================ */

/**
 * Generate Table of Contents from document headings
 */
function generateTableOfContents() {
    const tocContent = document.getElementById('tocContent');
    tocContent.innerHTML = '';
    
    const headings = document.querySelectorAll('.doc-content h1, .doc-content h2, .doc-content h3');
    let hasHeadings = false;
    
    headings.forEach((heading) => {
        // Skip h1 (main title)
        if (heading.tagName === 'H1') return;
        
        hasHeadings = true;
        
        if (!heading.id) {
            heading.id = generateId(heading.textContent);
        }
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.replace('🔗', '').trim();
        
        // Set class based on heading level
        if (heading.tagName === 'H2') {
            link.className = 'toc-h2';
        } else if (heading.tagName === 'H3') {
            link.className = 'toc-h3';
        }
        
        // Add click handler to highlight
        link.addEventListener('click', () => {
            updateTocActive(link);
        });
        
        tocContent.appendChild(link);
    });
    
    // Handle scroll tracking
    setupTocScrollTracking();
}

/**
 * Update active TOC link based on scroll position
 */
function setupTocScrollTracking() {
    const contentArea = document.querySelector('.content');
    const tocLinks = document.querySelectorAll('#tocContent a');
    
    contentArea.addEventListener('scroll', () => {
        let current = null;
        
        tocLinks.forEach(link => {
            const id = link.getAttribute('href').substring(1);
            const heading = document.getElementById(id);
            
            if (heading) {
                const rect = heading.getBoundingClientRect();
                if (rect.top >= 0 && rect.top <= 200) {
                    current = link;
                }
            }
        });
        
        if (current) {
            updateTocActive(current);
        }
    });
}

/**
 * Update active state in TOC
 */
function updateTocActive(link) {
    document.querySelectorAll('#tocContent a').forEach(a => {
        a.classList.remove('active');
    });
    link.classList.add('active');
}

/**
 * Generate ID from text
 */
function generateId(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Add copy buttons to code blocks
 */
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.doc-content pre');
    
    codeBlocks.forEach((block) => {
        // Remove existing button if any
        const existingBtn = block.querySelector('.copy-btn');
        if (existingBtn) existingBtn.remove();
        
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<span>📋 Copy</span>';
        button.setAttribute('aria-label', 'Copy code');
        
        button.addEventListener('click', async () => {
            const code = block.innerText;
            try {
                await navigator.clipboard.writeText(code);
                button.classList.add('copied');
                button.innerHTML = '<span>✓ Copied</span>';
                
                setTimeout(() => {
                    button.classList.remove('copied');
                    button.innerHTML = '<span>📋 Copy</span>';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.innerHTML = '<span>✗ Failed</span>';
                setTimeout(() => {
                    button.innerHTML = '<span>📋 Copy</span>';
                }, 2000);
            }
        });
        
        block.appendChild(button);
    });
}

/**
 * Configure marked.js options for better rendering
 */
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
});

/**
 * Custom renderer for marked.js
 */
const renderer = new marked.Renderer();

// Custom heading renderer
const originalHeading = renderer.heading;
renderer.heading = function(token) {
    const text = token.text;
    const level = token.depth;
    const id = generateId(text);
    
    return `<h${level} id="${id}">${text}</h${level}>\n`;
};

// Custom link renderer
renderer.link = function(token) {
    const href = token.href;
    const title = token.title;
    const text = token.text;
    
    // Handle internal doc links
    if (href.endsWith('.md')) {
        const docFile = href.replace('.md', '.md').substring(href.lastIndexOf('/') + 1);
        return `<a href="#${docFile}" title="${title || ''}">${text}</a>`;
    }
    
    // External links open in new tab
    const target = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${target} title="${title || ''}">${text}</a>`;
};

// Custom code block renderer with language support
renderer.codespan = function(token) {
    return `<code>${token.text}</code>`;
};

renderer.code = function(token) {
    const lang = token.language ? ` language-${token.language}` : '';
    const code = token.text;
    
    return `<pre><code class="language-${token.language || 'plaintext'}">${escapeHtml(code)}</code></pre>\n`;
};

// Custom table renderer
renderer.table = function(token) {
    let table = '<table>\n<thead>\n<tr>\n';
    
    token.header.forEach(cell => {
        const align = cell.align ? ` style="text-align: ${cell.align}"` : '';
        table += `<th${align}>${cell.text}</th>\n`;
    });
    
    table += '</tr>\n</thead>\n<tbody>\n';
    
    token.rows.forEach(row => {
        table += '<tr>\n';
        row.forEach(cell => {
            const align = cell.align ? ` style="text-align: ${cell.align}"` : '';
            table += `<td${align}>${cell.text}</td>\n`;
        });
        table += '</tr>\n';
    });
    
    table += '</tbody>\n</table>\n';
    return table;
};

// Custom list renderer
renderer.list = function(token) {
    const type = token.ordered ? 'ol' : 'ul';
    const start = token.start ? ` start="${token.start}"` : '';
    
    let html = `<${type}${start}>\n`;
    token.items.forEach(item => {
        html += `<li>${item.text}</li>\n`;
    });
    html += `</${type}>\n`;
    
    return html;
};

marked.setOptions({ renderer });

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Format code blocks with better spacing
 */
function formatCodeBlocks() {
    document.querySelectorAll('.doc-content pre code').forEach(block => {
        // Trim excess whitespace
        let code = block.innerText;
        const lines = code.split('\n');
        
        // Find minimum indentation
        const minIndent = lines
            .filter(line => line.trim())
            .reduce((min, line) => {
                const indent = line.match(/^\s*/)[0].length;
                return Math.min(min, indent);
            }, Infinity);
        
        // Remove common indentation
        if (minIndent > 0) {
            const trimmed = lines
                .map(line => line.slice(minIndent))
                .join('\n');
            block.innerText = trimmed.trim();
        }
    });
}

// Export for use in other modules
window.markdownUtils = {
    generateTableOfContents,
    addCopyButtons,
    generateId,
    updateTocActive
};
