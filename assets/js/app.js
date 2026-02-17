/* ============================================
   EAGLEYE RADAR DOCS - MAIN APPLICATION
   Handles routing, sidebar generation, and doc loading
   ============================================ */

class DocApp {
    constructor() {
        this.docs = [];
        this.currentDoc = null;
        this.sidebarNav = document.getElementById('sidebarNav');
        this.docContent = document.getElementById('docContent');
        this.searchInput = document.getElementById('searchInput');
        this.breadcrumb = document.getElementById('breadcrumb');
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    async init() {
        try {
            await this.loadDocIndex();
            this.setupEventListeners();
            this.handleRouting();
            window.addEventListener('hashchange', () => this.handleRouting());
            window.addEventListener('resize', () => this.handleResize());
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load documentation');
        }
    }

    async loadDocIndex() {
        try {
            const response = await fetch('docs/index.json');
            if (!response.ok) throw new Error('Failed to load index');
            const data = await response.json();
            this.docs = data.docs || [];
            this.renderSidebar();
        } catch (error) {
            console.error('Error loading doc index:', error);
            this.sidebarNav.innerHTML = '<p style="padding: 16px; color: var(--color-text-tertiary);">Error loading docs</p>';
        }
    }

    renderSidebar() {
        this.sidebarNav.innerHTML = '';
        
        this.docs.forEach((doc, index) => {
            const link = document.createElement('a');
            link.href = `#${doc.file}`;
            link.textContent = doc.title;
            link.className = 'sidebar-link';
            link.setAttribute('data-file', doc.file);
            
            // Set first doc as active by default
            if (index === 0 && !location.hash) {
                link.classList.add('active');
            }
            
            link.addEventListener('click', (e) => {
                this.closeMobileSidebar();
            });
            
            this.sidebarNav.appendChild(link);
        });
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterSidebar(query);
        });
    }

    filterSidebar(query) {
        const links = this.sidebarNav.querySelectorAll('a');
        links.forEach(link => {
            const title = link.textContent.toLowerCase();
            if (query === '' || title.includes(query)) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    }

    handleRouting() {
        const hash = location.hash.substring(1);
        const docToLoad = hash || (this.docs.length > 0 ? this.docs[0].file : null);
        
        if (docToLoad) {
            this.loadDoc(docToLoad);
            this.updateActiveLink(docToLoad);
        }
    }

    async loadDoc(filename) {
        try {
            this.docContent.innerHTML = '<div class="loading-message"><div class="loading-spinner"></div><p>Loading...</p></div>';
            
            const response = await fetch(`docs/${filename}`);
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            
            const text = await response.text();
            this.currentDoc = filename;
            
            // Render markdown
            const html = marked.parse(text);
            this.docContent.innerHTML = html;
            
            // Scroll to top
            document.querySelector('.content').scrollTop = 0;
            
            // Apply syntax highlighting
            Prism.highlightAllUnder(this.docContent);
            
            // Generate TOC
            generateTableOfContents();
            
            // Add copy buttons
            addCopyButtons();
            
            // Update breadcrumb
            this.updateBreadcrumb(filename);
            
            // Setup heading anchors
            this.setupHeadingAnchors();
            
        } catch (error) {
            console.error('Error loading doc:', error);
            this.docContent.innerHTML = `<div style="padding: 40px; text-align: center; color: var(--color-text-tertiary);">
                <h2>Unable to Load Document</h2>
                <p>${error.message}</p>
            </div>`;
        }
    }

    updateActiveLink(filename) {
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-file') === filename) {
                link.classList.add('active');
            }
        });
    }

    updateBreadcrumb(filename) {
        const doc = this.docs.find(d => d.file === filename);
        const title = doc ? doc.title : filename;
        
        this.breadcrumb.innerHTML = `
            <span><a href="#${this.docs[0].file}">Docs</a></span>
            <span>/</span>
            <span>${title}</span>
        `;
    }

    setupHeadingAnchors() {
        const headings = this.docContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = this.slugify(heading.textContent);
            }
            
            // Add anchor link icon
            const link = document.createElement('a');
            link.className = 'heading-anchor';
            link.href = `#${heading.id}`;
            link.title = 'Copy link to section';
            link.innerHTML = '🔗';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.copyToClipboard(
                    window.location.href.split('#')[0] + '#' + heading.id
                );
            });
            
            heading.appendChild(link);
        });
    }

    slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Flash feedback
            const message = document.createElement('div');
            message.textContent = 'Link copied!';
            message.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--color-success);
                color: white;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 13px;
                z-index: 9999;
                animation: slideIn 300ms ease-out;
            `;
            document.body.appendChild(message);
            setTimeout(() => message.remove(), 2000);
        });
    }

    showError(message) {
        this.docContent.innerHTML = `<div style="padding: 40px; color: var(--color-error);">${message}</div>`;
    }

    closeMobileSidebar() {
        if (this.isMobile && this.sidebar) {
            this.sidebar.classList.remove('open');
        }
    }

    handleResize() {
        this.isMobile = window.innerWidth <= 768;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new DocApp();
    });
} else {
    window.app = new DocApp();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Escape to close search
    if (e.key === 'Escape') {
        document.getElementById('searchInput').blur();
        document.getElementById('searchInput').value = '';
        if (window.app) {
            window.app.filterSidebar('');
        }
    }
});

// CSS for heading anchors (injected)
const style = document.createElement('style');
style.textContent = `
    .heading-anchor {
        margin-left: 8px;
        opacity: 0;
        transition: opacity var(--transition-fast);
        text-decoration: none;
        font-size: 0.8em;
    }
    
    h1:hover .heading-anchor,
    h2:hover .heading-anchor,
    h3:hover .heading-anchor,
    h4:hover .heading-anchor,
    h5:hover .heading-anchor,
    h6:hover .heading-anchor {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
