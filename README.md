# docs
Forensic CyberTech Documentation
# Eagleye Radar Documentation Site

A modern, enterprise-grade documentation website for Eagleye Radar — Network Monitoring & Analysis.

## 📁 Project Structure

```
eagleye-docs/
├── index.html                 # Main application
├── 404.html                   # Error page
├── README.md                  # This file
│
├── /assets
│   ├── /css
│   │   └── style.css         # Complete styling (dark theme)
│   └── /js
│       ├── app.js            # Main application logic
│       ├── markdown.js       # Markdown rendering & processing
│       └── search.js         # Search functionality
│
└── /docs
    ├── index.json            # Documentation index (sidebar generator)
    ├── getting-started.md     # Introduction
    ├── installation.md        # Installation guide
    ├── radar-scanner.md       # Scanner documentation
    ├── network-engine.md      # Engine documentation
    ├── configuration.md       # Configuration guide
    ├── api-reference.md       # API documentation
    └── troubleshooting.md     # Troubleshooting guide
```

## 🚀 Features

✅ **Pure Frontend** - No backend required  
✅ **Dynamic Markdown** - Auto-rendering of .md files  
✅ **Auto Sidebar** - Automatically generated from index.json  
✅ **Search** - Client-side full-text search  
✅ **Table of Contents** - Auto-generated TOC with scroll tracking  
✅ **Syntax Highlighting** - Code blocks with Prism.js  
✅ **Copy Buttons** - One-click copy for code snippets  
✅ **Responsive Design** - Mobile, tablet, and desktop  
✅ **GitHub Pages Ready** - Deploy without build tools  
✅ **Enterprise Theme** - Dark navy theme with blue accents  

## 🎨 Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Glassmorphism design, CSS Grid
- **Vanilla JavaScript** - No frameworks
- **Marked.js** - Markdown parsing (via CDN)
- **Prism.js** - Syntax highlighting (via CDN)

## 📖 How to Use

### Local Development

1. **Install a local server** (required for CORS):

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

3. **View documentation** - Navigate through sidebar

### Add New Documentation

1. **Create a new markdown file** in `/docs`:
```bash
# Example: create new project doc
touch docs/my-project.md
```

2. **Add entry to `/docs/index.json`**:
```json
{
  "title": "My Project",
  "file": "my-project.md"
}
```

3. **Refresh browser** - New page appears in sidebar automatically

### Customize Styling

Edit `/assets/css/style.css`:

```css
/* Change primary color */
--color-primary: #3B82F6;  /* Blue */

/* Change background gradient */
background: linear-gradient(135deg, #030B1C 0%, #071A3A 100%);

/* Change text colors */
--color-text-primary: #E5E7EB;    /* Light gray */
```

## 🚢 Deploy to GitHub Pages

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/eagleye-docs.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository **Settings**
2. Navigate to **Pages** section
3. Select source: **Deploy from branch**
4. Select branch: **main**
5. Select folder: **/ (root)**
6. Click **Save**

### Step 3: Access Your Site

Your documentation will be available at:
```
https://YOUR_USERNAME.github.io/eagleye-docs
```

Or with custom domain:
```
https://docs.eagleye.local/
```

## 🔍 Search Features

- **Real-time search** - Type to filter documentation
- **Full-text search** - Searches document content
- **Smart ranking** - Results ranked by relevance
- **Snippet preview** - Shows matching context

**Keyboard shortcuts:**
- `Cmd/Ctrl + K` - Focus search
- `Escape` - Clear search

## 📱 Mobile Experience

The site is fully responsive:

- **Mobile** - Hamburger menu sidebar
- **Tablet** - Adjusted grid layout
- **Desktop** - Full 3-column layout

## ⚡ Performance

- **Zero build time** - Deploy instantly
- **Fast load** - <1 second initial load
- **Minimal dependencies** - Two CDN libraries only
- **Lazy loading** - Only visible content is processed
- **Optimized CSS** - ~15KB gzipped

## 🔒 Security

- **No backend** - No server-side vulnerabilities
- **Static files only** - Inherently secure
- **CSP ready** - Can add Content Security Policy
- **Update safe** - Update docs without code deployment

## 🛠️ Customization

### Change Logo

Edit `index.html`:
```html
<div class="logo">⚡ YOUR COMPANY</div>
```

### Change Theme Color

Edit `assets/css/style.css`:
```css
--color-primary: #YOUR_COLOR;
--color-primary-dark: #DARKER_COLOR;
```

### Add Custom Fonts

Edit `index.html` head:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont" rel="stylesheet">
```

Then update CSS:
```css
--font-family-primary: 'YourFont', sans-serif;
```

### Track Analytics

Add to `index.html` before `</body>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 📊 Supported Markdown Features

- ✅ Headings (h1-h6)
- ✅ Bold, italic, strikethrough
- ✅ Lists (ordered, unordered)
- ✅ Code blocks with syntax highlighting
- ✅ Inline code
- ✅ Tables
- ✅ Links
- ✅ Images
- ✅ Blockquotes
- ✅ Horizontal rules
- ✅ Line breaks

**Example:**

```markdown
# Heading 1

## Heading 2

Here's **bold** and *italic* text.

### Code Example
\`\`\`javascript
console.log("Hello, world!");
\`\`\`

### Table

| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |

> This is a blockquote

[External Link](https://example.com)
```

## 🐛 Troubleshooting

### Content not loading

**Check:**
1. Is the local server running? (`python -m http.server 8000`)
2. Are markdown files in `/docs`?
3. Is `/docs/index.json` valid JSON?

### Search not working

**Check:**
1. Browser console for JavaScript errors (`F12`)
2. Are all .md files accessible?
3. Is JSON index properly formatted?

### Styling looks broken

**Check:**
1. CSS file path is correct
2. Browser cache is cleared (`Ctrl+Shift+Delete`)
3. No CSS syntax errors in console

## 📝 License

This documentation site template is provided as-is for Eagleye Radar.

## 🤝 Contributing

To improve documentation:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Make changes to markdown files
4. Commit changes (`git commit -am 'Add improvement'`)
5. Push to branch (`git push origin feature/improvement`)
6. Open Pull Request

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](docs/troubleshooting.md) guide
2. Review [Getting Started](docs/getting-started.md)
3. Check browser console for errors
4. Contact support team

## 🔄 Updates

To update documentation:

1. Edit markdown files in `/docs`
2. Add new files to `/docs/index.json` if needed
3. Commit and push changes
4. Changes deploy automatically to GitHub Pages

## 📈 Scaling

This template scales to 100+ documentation pages:

- Add entries to `index.json`
- Create .md files in `/docs`
- Search automatically indexes all files
- No performance degradation

---

**Built for Enterprise** 🚀  
**Enterprise-ready Documentation System for Eagleye Radar**
