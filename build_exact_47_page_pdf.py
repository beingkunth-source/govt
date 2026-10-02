import fitz
import shutil
import os

def build_47_page_pdf():
    src_pdf = '/home/kunth/Pictures/Developing_ELearning_Content_for_Government_Schools_CEP_Report.pdf'
    
    if not os.path.exists(src_pdf):
        print(f"Error: {src_pdf} not found!")
        return

    doc_src = fitz.open(src_pdf)
    print(f"📖 Loaded base PDF ({len(doc_src)} pages).")

    # Create new doc to construct exact 47 pages
    doc = fitz.open()

    # Insert Pages 1 to 21 (Cover, Abstract, Ack, Dec, Plagiarism Reports, Guide Diary, TOC, Ch 1, Ch 2 SRS)
    doc.insert_pdf(doc_src, from_page=0, to_page=20) # 21 pages

    # Create Page 22 (Dedicated Full Figure Page for DFD Level 0 Context Diagram)
    p22 = doc.new_page(width=612, height=792)
    # Header
    p22.insert_text(fitz.Point(36, 40), "SHIKSHA SETU — SYSTEM MODELING DIAGRAMS", fontsize=9, fontname="helv", color=(0.02, 0.59, 0.41))
    p22.draw_line(fitz.Point(36, 48), fitz.Point(576, 48), color=(0.65, 0.95, 0.82), width=0.75)
    # Figure Card
    rect_dfd0 = fitz.Rect(40, 70, 572, 730)
    p22.draw_rect(rect_dfd0, color=(0.02, 0.59, 0.41), fill=(1.0, 1.0, 1.0), width=1.5)
    p22.insert_image(rect_dfd0, filename='diagram_imgs/dfd_level_0.png')
    # Footer
    p22.draw_line(fitz.Point(36, 750), fitz.Point(576, 750), color=(0.65, 0.95, 0.82), width=0.75)
    p22.insert_text(fitz.Point(36, 765), "Figure 3.1: Data Flow Diagram Level 0 (Context Diagram) — System Boundary & Entities", fontsize=8.5, fontname="helv", color=(0.02, 0.59, 0.41))

    # Create Page 23 (Dedicated Full Figure Page for DFD Level 1 Subsystem Diagram)
    p23 = doc.new_page(width=612, height=792)
    # Header
    p23.insert_text(fitz.Point(36, 40), "SHIKSHA SETU — SYSTEM MODELING DIAGRAMS", fontsize=9, fontname="helv", color=(0.02, 0.59, 0.41))
    p23.draw_line(fitz.Point(36, 48), fitz.Point(576, 48), color=(0.65, 0.95, 0.82), width=0.75)
    # Figure Card
    rect_dfd1 = fitz.Rect(40, 70, 572, 730)
    p23.draw_rect(rect_dfd1, color=(0.02, 0.59, 0.41), fill=(1.0, 1.0, 1.0), width=1.5)
    p23.insert_image(rect_dfd1, filename='diagram_imgs/dfd_level_1.png')
    # Footer
    p23.draw_line(fitz.Point(36, 750), fitz.Point(576, 750), color=(0.65, 0.95, 0.82), width=0.75)
    p23.insert_text(fitz.Point(36, 765), "Figure 3.2: Data Flow Diagram Level 1 — Subsystem Functions & Client Data Stores", fontsize=8.5, fontname="helv", color=(0.02, 0.59, 0.41))

    # Insert remaining pages from base PDF (Pages 22 to 45 -> 24 pages)
    doc.insert_pdf(doc_src, from_page=21, to_page=44)

    print(f"📊 Combined PDF Total Pages before diagram embedding: {len(doc)}")

    # Embed remaining 5 diagrams on appropriate chapter pages
    diagram_embeds = [
        # System Architecture Diagram on Page 20 (Chapter 3: Methodology)
        (19, 'diagram_imgs/system_architecture.png', fitz.Rect(45, 470, 567, 720)),
        
        # Use Case Diagram on Page 24 (Chapter 3: System Modeling)
        (23, 'diagram_imgs/use_case_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # State Machine Diagram on Page 26 (Chapter 3: Interactive Science Labs)
        (25, 'diagram_imgs/state_machine_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # ER Diagram on Page 28 (Chapter 3: Database Design)
        (27, 'diagram_imgs/er_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # Sequence Diagram on Page 30 (Chapter 3: Offline Sync)
        (29, 'diagram_imgs/sequence_diagram.png', fitz.Rect(45, 470, 567, 720))
    ]

    for page_idx, img_path, rect in diagram_embeds:
        p = doc[page_idx]
        shape = p.new_shape()
        shape.draw_rect(rect)
        shape.finish(color=(0.02, 0.59, 0.41), fill=(1.0, 1.0, 1.0), width=1.5)
        shape.commit()
        p.insert_image(rect, filename=img_path)
        print(f"✅ Embedded {img_path} into Page {page_idx+1}")

    # Output file paths
    pdf_out = 'Shiksha_Setu_CEP_Project_Report.pdf'
    doc.save(pdf_out, garbage=4, deflate=True)
    doc.save('Shiksha_Setu_Project_Report_Final_47_Pages.pdf', garbage=4, deflate=True)
    doc.close()

    shutil.copy(pdf_out, 'Shiksha_Setu_Project_Report_v2.pdf')
    shutil.copy(pdf_out, 'public/Shiksha_Setu_CEP_Project_Report.pdf')
    shutil.copy(pdf_out, 'public/Shiksha_Setu_Project_Report_v2.pdf')

    final_doc = fitz.open('Shiksha_Setu_CEP_Project_Report.pdf')
    print(f"🎉 FINAL PDF GENERATED WITH EXACTLY {len(final_doc)} PAGES!")

if __name__ == '__main__':
    build_47_page_pdf()
