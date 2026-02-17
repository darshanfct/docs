/* ============================================
   SEARCH FUNCTIONALITY
   Client-side search across all documentation
   ============================================ */

class DocumentSearch {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.sidebarNav = document.getElementById('sidebarNav');
        this.searchIndex = {};
        this.init();
    }

    async init() {
        // Wait for docs to load
        const checkDocsLoaded = setInterval(() => {
            if (window.app && window.app.docs && window.app.docs.length > 0) {
                clearInterval(checkDocsLoaded);
                this.buildSearchIndex();
                this.setupSearchListener();
            }
        }, 100);
    }

    async buildSearchIndex() {
        this.searchIndex = {};
        
        for (const doc of window.app.docs) {
            try {
                const response = await fetch(`docs/${doc.file}`);
                const text = await response.text();
                this.searchIndex[doc.file] = {
                    title: doc.title,
                    content: text.toLowerCase(),
                    originalText: text
                };
            } catch (error) {
                console.error(`Failed to index ${doc.file}:`, error);
            }
        }
    }

    setupSearchListener() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                // Reset to full list
                window.app.renderSidebar();
            } else {
                this.performSearch(query);
            }
        });
        
        // Debounce search for better performance
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = e.target.value.toLowerCase().trim();
                if (query.length > 0) {
                    this.highlightMatches(query);
                }
            }, 300);
        });
    }

    performSearch(query) {
        const results = [];
        const terms = query.split(/\s+/).filter(t => t.length > 0);
        
        for (const [file, docData] of Object.entries(this.searchIndex)) {
            let score = 0;
            let lastCount = docData.content.match(`${query}`);
            
            // Check title matches (higher priority)
            const titleScore = terms.reduce((acc, term) => {
                return acc + (docData.title.toLowerCase().includes(term) ? 10 : 0);
            }, 0);
            
            // Check content matches
            const contentScore = terms.reduce((acc, term) => {
                const regex = new RegExp(term, 'g');
                const matches = docData.content.match(regex);
                return acc + (matches ? matches.length : 0);
            }, 0);
            
            score = titleScore * 2 + contentScore;
            
            if (score > 0) {
                results.push({
                    file,
                    title: docData.title,
                    score,
                    snippet: this.extractSnippet(docData.originalText, query)
                });
            }
        }
        
        // Sort by relevance
        results.sort((a, b) => b.score - a.score);
        
        // Render results
        this.renderSearchResults(results);
    }

    extractSnippet(text, query) {
        const lines = text.split('\n');
        let bestLine = '';
        
        for (const line of lines) {
            if (line.toLowerCase().includes(query)) {
                bestLine = line.trim();
                break;
            }
        }
        
        if (!bestLine) {
            bestLine = text.substring(0, 100);
        }
        
        // Truncate if too long
        if (bestLine.length > 80) {
            bestLine = bestLine.substring(0, 80) + '...';
        }
        
        return bestLine;
    }

    renderSearchResults(results) {
        this.sidebarNav.innerHTML = '';
        
        if (results.length === 0) {
            this.sidebarNav.innerHTML = `
                <div style="padding: 16px; color: var(--color-text-tertiary); text-align: center; font-size: 13px;">
                    <p>No results found</p>
                </div>
            `;
            return;
        }
        
        results.forEach(result => {
            const link = document.createElement('a');
            link.href = `#${result.file}`;
            link.className = 'sidebar-link search-result';
            
            const titleEl = document.createElement('div');
            titleEl.className = 'search-result-title';
            titleEl.textContent = result.title;
            
            const snippetEl = document.createElement('div');
            snippetEl.className = 'search-result-snippet';
            snippetEl.textContent = result.snippet;
            
            link.appendChild(titleEl);
            link.appendChild(snippetEl);
            
            link.addEventListener('click', () => {
                this.searchInput.value = '';
                window.app.renderSidebar();
            });
            
            this.sidebarNav.appendChild(link);
        });
        
        // Add reset option
        const resetDiv = document.createElement('div');
        resetDiv.style.cssText = `
            padding: 12px 16px;
            font-size: 12px;
            color: var(--color-text-tertiary);
            border-top: 1px solid var(--color-border-light);
            text-align: center;
            margin-top: 8px;
        `;
        resetDiv.innerHTML = '<button onclick="document.getElementById(\'searchInput\').value = \'\'; location.reload();" style="background: none; border: none; color: var(--color-primary); cursor: pointer; font-family: inherit;">Clear search</button>';
        
        this.sidebarNav.appendChild(resetDiv);
    }

    highlightMatches(query) {
        const content = document.getElementById('docContent');
        if (!content) return;
        
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const nodesToReplace = [];
        let node;
        
        while (node = walker.nextNode()) {
            if (node.nodeValue.toLowerCase().includes(query)) {
                nodesToReplace.push(node);
            }
        }
        
        nodesToReplace.forEach(node => {
            const regex = new RegExp(`(${query})`, 'gi');
            const span = document.createElement('span');
            span.innerHTML = node.nodeValue.replace(
                regex,
                '<mark style="background: rgba(59, 130, 246, 0.4); border-radius: 2px; padding: 0 2px;">$1</mark>'
            );
            node.parentNode.replaceChild(span, node);
        });
    }
}

// Initialize search when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.docSearch = new DocumentSearch();
    });
} else {
    window.docSearch = new DocumentSearch();
}

// Add styles for search results
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-result {
        flex-direction: column;
        align-items: flex-start;
        padding: 12px 16px !important;
        margin: 4px 8px !important;
        border-radius: 6px;
        background: rgba(59, 130, 246, 0.08) !important;
    }
    
    .search-result:hover {
        background: rgba(59, 130, 246, 0.15) !important;
    }
    
    .search-result-title {
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 4px;
        font-size: 13px;
    }
    
    .search-result-snippet {
        font-size: 11px;
        color: var(--color-text-tertiary);
        line-height: 1.4;
        font-family: var(--font-family-mono);
    }
`;
document.head.appendChild(searchStyles);
