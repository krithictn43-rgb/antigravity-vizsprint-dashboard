# generate_project_md.py
# Generates separate markdown files for backend and frontend code.

import os

BASE_DIR = r"C:\\Sham\\VizSprints"


def read_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"[Error reading {path}: {e}]"


def add_section(md, title, content, lang=""):
    md.append(f"### {title}\n")
    md.append(f"```{lang}\n{content}\n```\n\n")


def write_md(filename, content_list):
    out_path = os.path.join(BASE_DIR, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        f.writelines(content_list)
    print(f"Generated {out_path}")


def main():
    # --- Backend Markdown ---
    backend_md = ["# VizSprints - Backend Code & Data\n\n"]
    
    # CSV Data
    backend_md.append("## CSV Data\n")
    for csv_name in ["users.csv", "events.csv"]:
        csv_path = os.path.join(BASE_DIR, csv_name)
        add_section(backend_md, csv_name, read_file(csv_path), "csv")

    # Backend Code
    backend_md.append("## Backend (Flask API)\n")
    backend_dir = os.path.join(BASE_DIR, "backend")
    add_section(backend_md, "backend/app.py", read_file(os.path.join(backend_dir, "app.py")), "python")
    add_section(backend_md, "backend/requirements.txt", read_file(os.path.join(backend_dir, "requirements.txt")), "text")

    write_md("backend_code.md", backend_md)


    # --- Frontend Markdown ---
    frontend_md = ["# VizSprints - Frontend Code\n\n"]
    
    frontend_md.append("## Frontend (React)\n")
    frontend_dir = os.path.join(BASE_DIR, "frontend")
    add_section(frontend_md, "frontend/index.html", read_file(os.path.join(frontend_dir, "index.html")), "html")
    add_section(frontend_md, "frontend/package.json", read_file(os.path.join(frontend_dir, "package.json")), "json")
    add_section(frontend_md, "frontend/tailwind.config.js", read_file(os.path.join(frontend_dir, "tailwind.config.js")), "javascript")
    add_section(frontend_md, "frontend/postcss.config.js", read_file(os.path.join(frontend_dir, "postcss.config.js")), "javascript")
    add_section(frontend_md, "frontend/src/api.js", read_file(os.path.join(frontend_dir, "src", "api.js")), "javascript")

    # Component files
    comp_dir = os.path.join(frontend_dir, "src", "components")
    if os.path.exists(comp_dir):
        for comp in sorted(os.listdir(comp_dir)):
            if comp.endswith('.jsx'):
                add_section(frontend_md, f"frontend/src/components/{comp}", read_file(os.path.join(comp_dir, comp)), "javascript")

    write_md("frontend_code.md", frontend_md)


if __name__ == "__main__":
    main()
