import os
from fpdf import FPDF

def create_pdf(input_file, output_file):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_auto_page_break(auto=True, margin=15)
    
    # Add font - using standard Arial/Helvetica
    pdf.set_font("Arial", size=10)
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                # Handle basic encoding issues
                line = line.encode('latin-1', 'replace').decode('latin-1')
                
                # Basic Markdown parsing for headers
                if line.startswith('# '):
                    pdf.set_font("Arial", 'B', 16)
                    pdf.cell(0, 10, line.replace('# ', '').strip(), ln=True)
                    pdf.set_font("Arial", size=10)
                elif line.startswith('## '):
                    pdf.set_font("Arial", 'B', 14)
                    pdf.cell(0, 10, line.replace('## ', '').strip(), ln=True)
                    pdf.set_font("Arial", size=10)
                elif line.startswith('### '):
                    pdf.set_font("Arial", 'B', 12)
                    pdf.cell(0, 10, line.replace('### ', '').strip(), ln=True)
                    pdf.set_font("Arial", size=10)
                elif line.startswith('```'):
                    # Skip code block markers or style them?
                    # Let's just print them for now but maybe change font to Courier
                    if '```' in line and len(line.strip()) > 3:
                         # Start of code block with language
                         pdf.set_font("Courier", size=9)
                         # pdf.cell(0, 5, line.strip(), ln=True) # Don't print the marker
                    elif line.strip() == '```':
                         # End of code block
                         pdf.set_font("Arial", size=10)
                         # pdf.cell(0, 5, line.strip(), ln=True) # Don't print the marker
                    else:
                        # Inside code block (presumably, if we tracked state, but let's just use Courier if it looks like code? NO, state tracking is better)
                        # Simple approach: just print everything
                        pdf.multi_cell(0, 5, line.rstrip())
                else:
                    pdf.multi_cell(0, 5, line.rstrip())
                    
        pdf.output(output_file)
        print(f"Successfully created {output_file}")
    except Exception as e:
        print(f"Error converting {input_file}: {str(e)}")

# Define paths
ARTIFACT_DIR = r"C:\Users\Admin\.gemini\antigravity\brain\49cb7dd4-69f3-4d2d-ba61-fad1f9b633d5"
BACKEND_MD = os.path.join(ARTIFACT_DIR, "backend_new.md")
FRONTEND_MD = os.path.join(ARTIFACT_DIR, "frontend_new.md")

BACKEND_PDF = os.path.join(ARTIFACT_DIR, "backend_new.pdf")
FRONTEND_PDF = os.path.join(ARTIFACT_DIR, "frontend_new.pdf")

# Run conversion
print("Converting backend code...")
create_pdf(BACKEND_MD, BACKEND_PDF)

print("Converting frontend code...")
create_pdf(FRONTEND_MD, FRONTEND_PDF)
