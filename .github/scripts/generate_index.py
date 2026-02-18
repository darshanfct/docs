import os
import json
import re

# Logic:
# 1. Read existing index.json to preserve 'site' metadata.
# 2. Scan 'docs' folder for project directories (01-..., etc).
# 3. Inside projects, scan for .md files (01-..., etc).
# 4. Generate projects list and write to index.json.

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DOCS_DIR = os.path.join(BASE_DIR, 'docs')
INDEX_FILE = os.path.join(DOCS_DIR, 'index.json')

def get_title_from_name(name):
    # Remove extension
    name = os.path.splitext(name)[0]
    # Remove leading numbers and separators (e.g., "01-Name" -> "Name")
    name = re.sub(r'^\d+[-_.]+', '', name)
    # Replace separators with spaces and title case
    return name.replace('-', ' ').replace('_', ' ').title()

def main():
    print(f"Scanning directory: {DOCS_DIR}")
    
    if not os.path.exists(DOCS_DIR):
        print(f"Error: {DOCS_DIR} not found.")
        return

    # Load existing site metadata
    site_metadata = {
        "title": "Documentation",
        "description": "Project Documentation"
    }
    
    if os.path.exists(INDEX_FILE):
        try:
            with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if 'site' in data:
                    site_metadata = data['site']
        except Exception as e:
            print(f"Warning: Failed to read existing index.json: {e}")

    projects = []
    
    # scan for directories
    try:
        items = os.listdir(DOCS_DIR)
    except OSError as e:
        print(f"Error accessing docs directory: {e}")
        return

    # Filter for directories that look like projects (not hidden, not config)
    # We prioritize folders, especially those starting with numbers as requested
    dirs = []
    for item in items:
        path = os.path.join(DOCS_DIR, item)
        if os.path.isdir(path):
            if item.startswith('.'): continue
            if item in ['assets', 'config', 'eagleyeradar']: continue
            dirs.append(item)
    
    dirs.sort() # Alphanumeric sort (01-..., 02-...)
    
    for d in dirs:
        project_id = d
        project_title = get_title_from_name(d)
        project_path = os.path.join(DOCS_DIR, d)
        
        docs = []
        try:
            files = os.listdir(project_path)
            files.sort()
            
            for f in files:
                if f.endswith('.md'):
                    doc_title = get_title_from_name(f)
                    # Rel path for fetch: "folder/file.md"
                    rel_path = f"{d}/{f}"
                    doc_id_val = os.path.splitext(f)[0]
                    
                    docs.append({
                        "title": doc_title,
                        "description": "", # Auto-discovery leaves this empty for now
                        "file": rel_path,
                        "id": doc_id_val
                    })
        except OSError as e:
            print(f"Error accessing project {d}: {e}")
            continue
            
        if docs:
            projects.append({
                "id": project_id,
                "title": project_title,
                "description": "",
                "docs": docs
            })
            print(f"Added project: {project_title} ({len(docs)} files)")

    output = {
        "site": site_metadata,
        "projects": projects
    }
    
    try:
        with open(INDEX_FILE, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2)
        print(f"Success! Updated {INDEX_FILE}")
    except Exception as e:
        print(f"Error writing index.json: {e}")

if __name__ == '__main__':
    main()
