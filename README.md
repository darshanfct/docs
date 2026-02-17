# Forensic CyberTech Documentation

A modern, enterprise-grade documentation website for Forensic CyberTech platforms with hierarchical project organization.

## 📁 Project Structure

```
docs/
├── index.html                      # Main application
├── 404.html                        # Error page
├── README.md                       # This file
│
├── /assets
│   ├── /css
│   │   └── style.css              # Complete styling (dark theme, glassmorphism)
│   └── /js
│       ├── app.js                 # Main application logic (hierarchical routing)
│       ├── markdown.js            # Markdown rendering & TOC generation
│       └── search.js              # Full-text search functionality
│
└── /docs
    ├── index.json                 # Hierarchical index (projects & documents)
    │
    └── /eagleye-radar             # PROJECT: EAGLEYE RADAR
        ├── README.md              # Overview & quick introduction
        ├── quick-start.md         # 5-minute setup guide
        ├── installation.md        # System requirements & installation methods
        ├── configuration.md       # Configuration options & optimization
        ├── usage.md               # Running scans & operating services
        ├── architecture.md        # System design & data flow
        ├── troubleshooting.md     # Common issues & solutions
        └── api-reference.md       # REST API endpoints & examples
```

## 🏗️ Hierarchical Organization

The documentation follows a project-based hierarchy:

```
Forensic CyberTech Documentations (Main Site)
  ├── 🦅 EAGLEYE RADAR (Project 1)
  │   ├── Overview
  │   ├── Quick Start
  │   ├── Installation
  │   ├── Configuration
  │   ├── Usage
  │   ├── Architecture
  │   ├── Troubleshooting
  │   └── API Reference
  │
  └── [Additional Projects] (Coming Soon)
```

## 🚀 Features

✅ **Hierarchical Projects** - Multi-project documentation support  
✅ **Pure Frontend** - No backend required  
✅ **Dynamic Markdown** - Auto-rendering of .md files  
✅ **Collapsible Sidebar** - Projects expand/collapse with state persistence  
✅ **Base64 Routing** - Prevents URL anchor conflicts  
✅ **Search** - Client-side full-text search  
✅ **Table of Contents** - Auto-generated with scroll tracking  
✅ **Syntax Highlighting** - Code blocks via Prism.js  
✅ **Copy Buttons** - One-click copy for code snippets  
✅ **Responsive Design** - Mobile, tablet, and desktop  
✅ **GitHub Pages Ready** - Deploy without build tools  
✅ **Enterprise Theme** - Dark navy theme with blue accents (glassmorphism)  

## 🎨 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism, CSS Grid, CSS Variables
- **Vanilla JavaScript** - No frameworks or build tools
- **Marked.js** - Markdown parsing (CDN)
- **Prism.js** - Syntax highlighting (CDN)
- **localStorage** - Persist UI state (collapsed/expanded projects)

## 📖 How to Use

### Local Development

1. **Start a local server** (required for file loading):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npm install -g http-server
http-server

# Using Ruby
ruby -run -ehttpd . -p8000
```

2. **Open in browser**:
```
http://localhost:8000
```

3. **Navigate** - Use sidebar to explore projects and documents

### Add a New Project

To add a new project (e.g., "My Project"), follow these steps:

1. **Create a project folder** in `docs/`:
```bash
mkdir docs/my-project
```

2. **Add markdown files** to the project:
```bash
touch docs/my-project/README.md
touch docs/my-project/quick-start.md
touch docs/my-project/installation.md
```

3. **Update `/docs/index.json`** with your project:
```json
{
  "site": {
    "title": "Forensic CyberTech Documentations",
    "description": "Enterprise Documentation"
  },
  "projects": [
    {
      "id": "my-project",
      "title": "📋 My Project",
      "description": "Description of your project",
      "docs": [
        {
          "title": "Overview",
          "file": "my-project/README.md",
          "id": "overview"
        },
        {
          "title": "Quick Start",
          "file": "my-project/quick-start.md",
          "id": "quick-start"
        },
        {
          "title": "Installation",
          "file": "my-project/installation.md",
          "id": "installation"
        }
      ]
    }
  ]
}
```

4. **Refresh browser** - New project appears in collapsible sidebar

### How the Hierarchical System Works

**index.json Structure:**
- Top level: `site.title` and `projects` array
- Each project has: `id`, `title`, `description`, and `docs` array
- Each doc has: `title`, `file` (path relative to `/docs`), and `id`

**Routing System:**
- Document links use base64 encoding to prevent URL hash conflicts with Table of Contents anchors
- Example: `eagleye-radar/README.md` → `#ZWFnbGV5ZS1yYWRhci9SRUFETUUubWQ=`
- This allows TOC headings to work as local anchors without triggering document navigation

**Sidebar Behavior:**
- Projects are collapsible/expandable
- Expansion state is saved in browser localStorage
- First document in first project loads by default
- Search filters across all project documents

### Customize Styling

Edit `/assets/css/style.css` to modify:
- Color scheme (CSS variables at top)
- Layout dimensions (sidebar width, TOC width)
- Typography and spacing
- Glassmorphism effects
- Responsive breakpoints

### Deploy to GitHub Pages

1. Push your `docs` folder to GitHub:
```bash
git add .
git commit -m "Update documentation"
git push origin main
```

2. Enable GitHub Pages in repository settings:
   - Source: `main` branch, `/docs` folder
   - URL: `https://username.github.io/repo-name/docs`

## 🔧 Configuration

### CSS Variables (in style.css)

Modify the color scheme:
```css
:root {
  --primary: #3B82F6;           /* Blue accent */
  --bg-dark: #030B1C;           /* Dark navy */
  --bg-light: #071A3A;          /* Lighter navy */
  --text-light: #E0E7FF;        /* Light text */
  --border: #1E3A5F;            /* Border color */
}
```

### Search Configuration

The search functionality:
- Indexes all markdown document content
- Runs entirely in browser (no server needed)
- Case-insensitive matching
- Results show document title and preview

## 🐛 Troubleshooting

**404 Errors when clicking TOC items:**
- Fixed! TOC links now use local anchors instead of document routing
- Base64 encoding prevents hash collision

**Documents not loading:**
- Ensure local server is running (not file:// protocol)
- Check browser console for fetch errors
- Verify file paths in index.json match actual files

**Search not working:**
- Clear browser cache and reload
- Ensure documents are loaded at least once (indexes on load)
- Check browser console for JavaScript errors

**Styles look wrong:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage: `localStorage.clear()` in console
- Check CSS file path in index.html

## 📝 Writing Documentation

### Markdown Features Supported

✅ Headings (H1-H6)  
✅ Bold, italic, strikethrough  
✅ Lists (ordered & unordered)  
✅ Code blocks with syntax highlighting  
✅ Inline code  
✅ Tables  
✅ Blockquotes  
✅ Links and images  
✅ Horizontal rules  

### Code Block Syntax

Use triple backticks with language identifier:

````markdown
```javascript
function hello() {
  console.log("Syntax highlighting works!");
}
```

```bash
npm install --save package-name
```

```json
{
  "key": "value"
}
```
````

## 📄 License

This documentation template is provided as-is for use by Forensic CyberTech.

## 📞 Support

For issues with the documentation system:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify index.json syntax is valid JSON
4. Ensure all referenced .md files exist

---

**Last Updated:** February 2026  
**Version:** 2.0 (Hierarchical Project Structure)
