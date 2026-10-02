import fitz

def embed_diagrams():
    pdf_in = 'Shiksha_Setu_Project_Report_v2.pdf'
    pdf_out = 'Shiksha_Setu_Project_Report_v3.pdf'
    
    doc = fitz.open(pdf_in)
    print(f"📖 Loaded {pdf_in} with total {len(doc)} pages.")

    # List of diagram insertions: (page_index_0_based, image_path, rect_tuple)
    insertions = [
        # Page 12 (Chapter 5: System Design & Architecture) -> System Architecture
        (11, 'diagram_imgs/system_architecture.png', fitz.Rect(45, 470, 567, 720)),
        
        # Page 13 (Chapter 5: System Design & Architecture) -> DFD Level 0 & DFD Level 1
        (12, 'diagram_imgs/dfd_level_0.png', fitz.Rect(45, 230, 567, 450)),
        (12, 'diagram_imgs/dfd_level_1.png', fitz.Rect(45, 480, 567, 720)),
        
        # Page 14 (Chapter 6: Module I — Teacher LMS Portal) -> Use Case Diagram
        (13, 'diagram_imgs/use_case_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # Page 22 (Chapter 10: Module V — Virtual Science Lab) -> State Machine Diagram
        (21, 'diagram_imgs/state_machine_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # Page 29 (Chapter 13: Database Design) -> ER Diagram
        (28, 'diagram_imgs/er_diagram.png', fitz.Rect(45, 470, 567, 720)),
        
        # Page 30 (Chapter 14: Offline-First Architecture) -> Sequence Diagram
        (29, 'diagram_imgs/sequence_diagram.png', fitz.Rect(45, 470, 567, 720))
    ]

    for page_idx, img_path, rect in insertions:
        page = doc[page_idx]
        
        # Draw a clean white background card with border for the diagram figure
        shape = page.new_shape()
        shape.draw_rect(rect)
        shape.finish(color=(0.02, 0.59, 0.41), fill=(1.0, 1.0, 1.0), width=1.5)
        shape.commit()
        
        # Insert high-resolution diagram image
        page.insert_image(rect, filename=img_path)
        print(f"✅ Embedded {img_path} into Page {page_idx+1}")

    import shutil
    doc.save(pdf_out, garbage=4, deflate=True)
    doc.save('Shiksha_Setu_Project_Report_Final_47_Pages.pdf', garbage=4, deflate=True)
    doc.close()
    
    shutil.copy('Shiksha_Setu_Project_Report_Final_47_Pages.pdf', 'Shiksha_Setu_Project_Report_v2.pdf')
    
    # Verify final page count
    final_doc = fitz.open('Shiksha_Setu_Project_Report_v2.pdf')
    print(f"🎉 Successfully generated PDF with EXACTLY {len(final_doc)} pages!")

if __name__ == '__main__':
    embed_diagrams()
