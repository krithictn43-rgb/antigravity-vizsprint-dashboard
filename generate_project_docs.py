# generate_project_docs.py
# Generates .doc files (HTML format) for backend and frontend code.

import os
import html

BASE_DIR = r"C:\\Sham\\VizSprints"

def read_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"[Error reading {path}: {e}]"

def add_section(content_list, title, code_content):
    # Escape HTML characters in code
    safe_code = html.escape(code_content)
    content_list.append(f"<h3>{title}</h3>\n")
    content_list.append(f"<pre style='background-color: #f4f4f4; padding: 10px; border: 1px solid #ddd;'><code>{safe_code}</code></pre>\n<br>\n")

def write_doc(filename, content_list):
    out_path = os.path.join(BASE_DIR, filename)
    # Wrap in HTML structure
    full_content = "<html><body>\n" + "".join(content_list) + "\n</body></html>"
    
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(full_content)
    print(f"Generated {out_path}")

def main():
    # --- Backend DOC ---
    backend_content = ["<h1>VizSprints - Backend Code & Data</h1>\n<hr>\n"]
    
    # CSV Data
    backend_content.append("<h2>CSV Data</h2>\n")
    for csv_name in ["users.csv", "events.csv"]:
        csv_path = os.path.join(BASE_DIR, csv_name)
        add_section(backend_content, csv_name, read_file(csv_path))

    # Backend Code
    backend_content.append("<h2>Backend (Flask API)</h2>\n")
    backend_dir = os.path.join(BASE_DIR, "backend")
    add_section(backend_content, "backend/app.py", read_file(os.path.join(backend_dir, "app.py")))
    add_section(backend_content, "backend/requirements.txt", read_file(os.path.join(backend_dir, "requirements.txt")))

    write_doc("backend_code.doc", backend_content)


    # --- Frontend DOC ---
    frontend_content = ["<h1>VizSprints - Frontend Code</h1>\n<hr>\n"]
    
    frontend_content.append("<h2>Frontend (React)</h2>\n")
    frontend_dir = os.path.join(BASE_DIR, "frontend")
    add_section(frontend_content, "frontend/index.html", read_file(os.path.join(frontend_dir, "index.html")))
    add_section(frontend_content, "frontend/package.json", read_file(os.path.join(frontend_dir, "package.json")))
    add_section(frontend_content, "frontend/tailwind.config.js", read_file(os.path.join(frontend_dir, "tailwind.config.js")))
    add_section(frontend_content, "frontend/postcss.config.js", read_file(os.path.join(frontend_dir, "postcss.config.js")))
    add_section(frontend_content, "frontend/src/api.js", read_file(os.path.join(frontend_dir, "src", "api.js")))

    # Component files
    comp_dir = os.path.join(frontend_dir, "src", "components")
    if os.path.exists(comp_dir):
        for comp in sorted(os.listdir(comp_dir)):
            if comp.endswith('.jsx'):
                add_section(frontend_content, f"frontend/src/components/{comp}", read_file(os.path.join(comp_dir, comp)))

    write_doc("frontend_code.doc", frontend_content)

    # --- Full Project DOC ---
    full_content = ["<h1>VizSprints - Full Project Code</h1>\n<hr>\n"]
    full_content.extend(backend_content[1:]) # Skip title
    full_content.append("<br><hr><br>\n")
    full_content.extend(frontend_content[1:]) # Skip title
    
    write_doc("project_full.doc", full_content)

if __name__ == "__main__":
    main()
