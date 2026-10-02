import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('diagram_imgs', exist_ok=True)

# Helper function for drawing rounded rectangles
def draw_rounded_rect(draw, xy, fill, outline=None, width=2, radius=12):
    x1, y1, x2, y2 = xy
    draw.rectangle([x1+radius, y1, x2-radius, y2], fill=fill)
    draw.rectangle([x1, y1+radius, x2, y2-radius], fill=fill)
    draw.ellipse([x1, y1, x1+2*radius, y1+2*radius], fill=fill)
    draw.ellipse([x2-2*radius, y1, x2, y1+2*radius], fill=fill)
    draw.ellipse([x1, y2-2*radius, x1+2*radius, y2], fill=fill)
    draw.ellipse([x2-2*radius, y2-2*radius, x2, y2], fill=fill)
    if outline:
        draw.arc([x1, y1, x1+2*radius, y1+2*radius], 180, 270, fill=outline, width=width)
        draw.arc([x2-2*radius, y1, x2, y1+2*radius], 270, 360, fill=outline, width=width)
        draw.arc([x2-2*radius, y2-2*radius, x2, y2], 0, 90, fill=outline, width=width)
        draw.arc([x1, y2-2*radius, x1+2*radius, y2], 90, 180, fill=outline, width=width)
        draw.line([x1+radius, y1, x2-radius, y1], fill=outline, width=width)
        draw.line([x1+radius, y2, x2-radius, y2], fill=outline, width=width)
        draw.line([x1, y1+radius, x1, y2-radius], fill=outline, width=width)
        draw.line([x2, y1+radius, x2, y2-radius], fill=outline, width=width)

# Helper function for drawing arrow
def draw_arrow(draw, start, end, fill='#059669', width=3, arrow_size=10):
    draw.line([start, end], fill=fill, width=width)
    x1, y1 = start
    x2, y2 = end
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    px1 = x2 - arrow_size * math.cos(angle - math.pi / 6)
    py1 = y2 - arrow_size * math.sin(angle - math.pi / 6)
    px2 = x2 - arrow_size * math.cos(angle + math.pi / 6)
    py2 = y2 - arrow_size * math.sin(angle + math.pi / 6)
    draw.polygon([(x2, y2), (px1, py1), (px2, py2)], fill=fill)

# ==============================================================================
# 1. DFD Level 0 (Context Diagram)
# ==============================================================================
def make_dfd0():
    img = Image.new('RGB', (1400, 850), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    # Title Header
    draw_rounded_rect(draw, (20, 20, 1380, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "DATA FLOW DIAGRAM (DFD) LEVEL 0 — CONTEXT DIAGRAM", fill='#ffffff')
    
    # Center System Process 0.0
    draw.ellipse([(550, 320), (850, 620)], fill='#059669', outline='#047857', width=4)
    draw.text((610, 440), "0.0 Shiksha Setu\n  Core System", fill='#ffffff')
    
    # External Entities
    # Student
    draw_rounded_rect(draw, (80, 180, 320, 280), fill='#d1fae5', outline='#059669', radius=10)
    draw.text((120, 215), "👨‍🎓 Student Entity\n (Classes 6-10)", fill='#064e3b')
    
    # Teacher
    draw_rounded_rect(draw, (80, 640, 320, 740), fill='#d1fae5', outline='#059669', radius=10)
    draw.text((120, 675), "👨‍🏫 Teacher Entity\n (Author / Assign)", fill='#064e3b')
    
    # Cloud Server
    draw_rounded_rect(draw, (1080, 410, 1320, 510), fill='#ccfbf1', outline='#0d9488', radius=10)
    draw.text((1115, 445), "☁️ Cloud Server\n (REST API / DB)", fill='#0f766e')
    
    # Arrows & Flow Labels
    draw_arrow(draw, (320, 210), (580, 350), fill='#059669', width=3)
    draw.text((340, 245), "1. Credentials, Quiz & Lab Submissions", fill='#065f46')
    
    draw_arrow(draw, (560, 410), (320, 260), fill='#059669', width=3)
    draw.text((350, 330), "2. Courses, Labs, Progress, Certs", fill='#065f46')
    
    draw_arrow(draw, (320, 670), (580, 550), fill='#059669', width=3)
    draw.text((340, 600), "3. Author Topics, Videos, Assignments", fill='#065f46')
    
    draw_arrow(draw, (850, 460), (1080, 460), fill='#0d9488', width=3)
    draw.text((880, 435), "4. REST JSON Sync", fill='#0f766e')
    
    img.save('diagram_imgs/dfd_level_0.png')
    print('✅ Generated DFD Level 0')

# ==============================================================================
# 2. DFD Level 1 (Subsystem Functions)
# ==============================================================================
def make_dfd1():
    img = Image.new('RGB', (1500, 950), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1480, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "DATA FLOW DIAGRAM (DFD) LEVEL 1 — SUBSYSTEM DECOMPOSITION", fill='#ffffff')
    
    # Processes
    procs = [
        ("1.0 Auth & Session", (100, 150, 400, 250)),
        ("2.0 Authoring Engine", (100, 300, 400, 400)),
        ("3.0 Science Lab Engine", (100, 450, 400, 550)),
        ("4.0 Progress & Certs", (100, 600, 400, 700)),
        ("5.0 AI Doubt Solver", (100, 750, 400, 850)),
        ("6.0 PWA Cache & Sync", (1100, 450, 1400, 550))
    ]
    for label, box in procs:
        draw_rounded_rect(draw, box, fill='#059669', outline='#047857', radius=10)
        draw.text((box[0]+40, box[1]+35), label, fill='#ffffff')
        
    # Data Stores
    stores = [
        ("D1 User Profile & Auth", (600, 170, 900, 230)),
        ("D2 Course & Assignment Store", (600, 320, 900, 380)),
        ("D3 Progress & Telemetry Store", (600, 520, 900, 580)),
        ("D4 Offline PWA Cache", (600, 720, 900, 780))
    ]
    for label, box in stores:
        draw_rounded_rect(draw, box, fill='#ecfdf5', outline='#10b981', radius=6)
        draw.text((box[0]+30, box[1]+20), f"[( {label} )]", fill='#064e3b')
        
    # Arrows connecting processes to data stores
    draw_arrow(draw, (400, 200), (600, 200), fill='#059669')
    draw_arrow(draw, (400, 350), (600, 350), fill='#059669')
    draw_arrow(draw, (400, 500), (600, 550), fill='#059669')
    draw_arrow(draw, (400, 650), (600, 570), fill='#059669')
    draw_arrow(draw, (900, 350), (1100, 480), fill='#0d9488')
    draw_arrow(draw, (900, 750), (1100, 520), fill='#0d9488')
    
    img.save('diagram_imgs/dfd_level_1.png')
    print('✅ Generated DFD Level 1')

# ==============================================================================
# 3. Use Case Diagram
# ==============================================================================
def make_use_case():
    img = Image.new('RGB', (1500, 1000), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1480, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "SYSTEM USE CASE DIAGRAM — STUDENT, TEACHER & OFFLINE PWA ENGINE", fill='#ffffff')
    
    # System boundary box
    draw_rounded_rect(draw, (350, 120, 1150, 950), fill='#fafafa', outline='#059669', radius=12, width=3)
    draw.text((620, 140), "Shiksha Setu E-Learning System Boundary", fill='#059669')
    
    # Student Actor
    draw_rounded_rect(draw, (50, 250, 280, 350), fill='#d1fae5', outline='#059669', radius=10)
    draw.text((90, 285), "👨‍🎓 Student Actor", fill='#064e3b')
    
    # Teacher Actor
    draw_rounded_rect(draw, (50, 650, 280, 750), fill='#d1fae5', outline='#059669', radius=10)
    draw.text((90, 685), "👨‍🏫 Teacher Actor", fill='#064e3b')
    
    # Offline Engine Actor
    draw_rounded_rect(draw, (1220, 450, 1450, 550), fill='#ccfbf1', outline='#0d9488', radius=10)
    draw.text((1240, 485), "⚡ PWA Offline Engine", fill='#0f766e')
    
    # Use cases inside boundary
    use_cases = [
        ("UC-1: Authenticate & Select Class", (420, 190, 720, 250)),
        ("UC-2: Browse Library & Videos", (420, 280, 720, 340)),
        ("UC-3: Run Interactive Science Labs", (420, 370, 720, 430)),
        ("UC-4: Take Quizzes & Earn XP", (420, 460, 720, 520)),
        ("UC-5: Use AI Doubt Solver", (420, 550, 720, 610)),
        ("UC-6: Claim Certificate PDF", (420, 640, 720, 700)),
        ("UC-7: Quick Settings & Theme", (420, 730, 720, 790)),
        
        ("UC-8: Create Class & Subjects", (780, 280, 1080, 340)),
        ("UC-9: Author Topics & Quizzes", (780, 370, 1080, 430)),
        ("UC-10: Upload Videos & PDFs", (780, 460, 1080, 520)),
        ("UC-11: Assign Topics to Target Class", (780, 550, 1080, 610)),
        ("UC-12: Preview Student View", (780, 640, 1080, 700)),
        
        ("UC-13: Precache Static Assets", (600, 820, 900, 880))
    ]
    
    for label, box in use_cases:
        draw_rounded_rect(draw, box, fill='#ffffff', outline='#059669', radius=20, width=2)
        draw.text((box[0]+20, box[1]+20), label, fill='#064e3b')
        
    # Draw connections
    for _, box in use_cases[:7]:
        draw_arrow(draw, (280, 300), (box[0], box[1]+30), fill='#059669', width=2)
        
    for _, box in use_cases[7:12]:
        draw_arrow(draw, (280, 700), (box[0], box[1]+30), fill='#059669', width=2)
        
    draw_arrow(draw, (1220, 500), (900, 850), fill='#0d9488', width=2)
    
    img.save('diagram_imgs/use_case_diagram.png')
    print('✅ Generated Use Case Diagram')

# ==============================================================================
# 4. System Architecture Diagram
# ==============================================================================
def make_architecture():
    img = Image.new('RGB', (1500, 950), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1480, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "SYSTEM ARCHITECTURE DIAGRAM — MULTI-TIER DECOUPLED PWA", fill='#ffffff')
    
    layers = [
        ("Layer 1: Presentation Tier (SPA Frontend)", (50, 120, 1450, 300), '#f0fdf4'),
        ("Layer 2: PWA ServiceWorker & Cache Tier", (50, 330, 1450, 490), '#e6f4ea'),
        ("Layer 3: Client Persistence & Local Data Tier", (50, 520, 1450, 680), '#ecfdf5'),
        ("Layer 4: Backend REST API & Database Tier", (50, 710, 1450, 900), '#ccfbf1')
    ]
    
    for title, box, fill_color in layers:
        draw_rounded_rect(draw, box, fill=fill_color, outline='#059669', radius=10, width=2)
        draw.text((box[0]+20, box[1]+15), title, fill='#064e3b')
        
    # Components Layer 1
    draw_rounded_rect(draw, (80, 180, 380, 270), fill='#ffffff', outline='#059669')
    draw.text((110, 210), "App Router & Navigation\n   (js/app.js)", fill='#064e3b')
    
    draw_rounded_rect(draw, (420, 180, 720, 270), fill='#ffffff', outline='#059669')
    draw.text((450, 210), "Science Labs Engine\n   (js/modules.js)", fill='#064e3b')
    
    draw_rounded_rect(draw, (760, 180, 1060, 270), fill='#ffffff', outline='#059669')
    draw.text((790, 210), "Accessibility & Theme\n (js/accessibility.js)", fill='#064e3b')
    
    draw_rounded_rect(draw, (1100, 180, 1400, 270), fill='#ffffff', outline='#059669')
    draw.text((1130, 210), "Language i18n Engine\n  (js/language.js)", fill='#064e3b')
    
    # Components Layer 2
    draw_rounded_rect(draw, (200, 380, 650, 460), fill='#ffffff', outline='#0d9488')
    draw.text((250, 405), "ServiceWorker Precache (sw.js v9)", fill='#0f766e')
    
    draw_rounded_rect(draw, (850, 380, 1300, 460), fill='#ffffff', outline='#0d9488')
    draw.text((900, 405), "SyncManager (Online / Offline Detector)", fill='#0f766e')
    
    # Components Layer 3
    draw_rounded_rect(draw, (200, 570, 650, 650), fill='#ffffff', outline='#10b981')
    draw.text((270, 595), "ProgressTracker (LocalStorage)", fill='#064e3b')
    
    draw_rounded_rect(draw, (850, 570, 1300, 650), fill='#ffffff', outline='#10b981')
    draw.text((920, 595), "AuthoringEngine Store", fill='#064e3b')
    
    # Components Layer 4
    draw_rounded_rect(draw, (200, 760, 650, 860), fill='#ffffff', outline='#0d9488')
    draw.text((280, 795), "Node.js Express REST API\n      (server.js)", fill='#0f766e')
    
    draw_rounded_rect(draw, (850, 760, 1300, 860), fill='#ffffff', outline='#0d9488')
    draw.text((930, 795), "SQLite / JSON Database\n      (database/)", fill='#0f766e')
    
    img.save('diagram_imgs/system_architecture.png')
    print('✅ Generated System Architecture Diagram')

# ==============================================================================
# 5. ER Diagram
# ==============================================================================
def make_erd():
    img = Image.new('RGB', (1400, 850), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1380, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "ENTITY RELATIONSHIP (ER) DIAGRAM — DATA SCHEMA & RELATIONS", fill='#ffffff')
    
    entities = [
        ("USER", (80, 150, 380, 380), ["id (PK)", "name", "role", "selectedClass", "school", "token"]),
        ("CLASS_SUBJECT", (520, 150, 820, 380), ["class_id (PK)", "title", "subject_name", "topics"]),
        ("TOPIC", (960, 150, 1260, 380), ["topic_id (PK)", "class_id (FK)", "title", "videoUrl", "pdfUrl"]),
        ("SCIENCE_LAB", (80, 480, 380, 750), ["lab_id (PK)", "topic_id (FK)", "class_level", "simulationType"]),
        ("ASSIGNMENT", (520, 480, 820, 750), ["assignment_id (PK)", "teacher_id (FK)", "topic_id (FK)", "targetClass"]),
        ("PROGRESS", (960, 480, 1260, 750), ["progress_id (PK)", "user_id (FK)", "totalXP", "badges", "certClaimed"])
    ]
    
    for name, box, fields in entities:
        draw_rounded_rect(draw, box, fill='#ecfdf5', outline='#059669', radius=10, width=2)
        draw_rounded_rect(draw, (box[0], box[1], box[2], box[1]+40), fill='#059669', radius=10)
        draw.text((box[0]+40, box[1]+10), name, fill='#ffffff')
        y_off = box[1] + 50
        for f in fields:
            draw.text((box[0]+20, y_off), f"• {f}", fill='#064e3b')
            y_off += 30
            
    # Connector lines
    draw_arrow(draw, (380, 260), (520, 260), fill='#059669')
    draw_arrow(draw, (820, 260), (960, 260), fill='#059669')
    draw_arrow(draw, (670, 380), (670, 480), fill='#059669')
    draw_arrow(draw, (1110, 380), (1110, 480), fill='#059669')
    
    img.save('diagram_imgs/er_diagram.png')
    print('✅ Generated ER Diagram')

# ==============================================================================
# 6. Sequence Diagram
# ==============================================================================
def make_sequence():
    img = Image.new('RGB', (1400, 850), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1380, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "SEQUENCE DIAGRAM — OFFLINE LEARNING & BACKGROUND SYNC", fill='#ffffff')
    
    lifelines = [
        ("Student", 120),
        ("SPA Router", 380),
        ("SW Cache", 640),
        ("LocalStorage", 900),
        ("Backend API", 1160)
    ]
    
    for name, x in lifelines:
        draw_rounded_rect(draw, (x-70, 120, x+70, 170), fill='#059669', outline='#047857', radius=8)
        draw.text((x-40, 135), name, fill='#ffffff')
        draw.line([(x, 170), (x, 780)], fill='#a7f3d0', width=2)
        
    steps = [
        (1, 120, 380, 220, "1. Click 'Start Lab' / 'Take Quiz'"),
        (2, 380, 640, 300, "2. Fetch Asset / Lab Config"),
        (3, 640, 380, 380, "3. Return Precached Asset (sw.js v9)"),
        (4, 120, 380, 460, "4. Complete Simulation / Submit Quiz"),
        (5, 380, 900, 540, "5. Save Score & XP to LocalStorage"),
        (6, 900, 380, 620, "6. Confirm Write & Unlock Badges"),
        (7, 900, 1160, 700, "7. Background Network Reconnect Sync API")
    ]
    
    for idx, x1, x2, y, label in steps:
        draw_arrow(draw, (x1, y), (x2, y), fill='#059669', width=2)
        draw.text((min(x1, x2)+20, y-20), label, fill='#064e3b')
        
    img.save('diagram_imgs/sequence_diagram.png')
    print('✅ Generated Sequence Diagram')

# ==============================================================================
# 7. State Machine Diagram
# ==============================================================================
def make_state_machine():
    img = Image.new('RGB', (1400, 850), color='#ffffff')
    draw = ImageDraw.Draw(img)
    
    draw_rounded_rect(draw, (20, 20, 1380, 80), fill='#059669', outline='#047857', radius=8)
    draw.text((40, 38), "STATE MACHINE DIAGRAM — INTERACTIVE SCIENCE LAB LIFECYCLE", fill='#ffffff')
    
    states = [
        ("[*] Initial", (80, 400, 200, 480)),
        ("Ready", (280, 400, 420, 480)),
        ("Parameter Editing", (500, 400, 680, 480)),
        ("Physics Calc", (760, 400, 920, 480)),
        ("Canvas Render", (1000, 400, 1160, 480)),
        ("Progress Saved", (1240, 400, 1360, 480))
    ]
    
    for label, box in states:
        draw_rounded_rect(draw, box, fill='#ecfdf5', outline='#059669', radius=20, width=2)
        draw.text((box[0]+15, box[1]+25), label, fill='#064e3b')
        
    draw_arrow(draw, (200, 440), (280, 440), fill='#059669')
    draw_arrow(draw, (420, 440), (500, 440), fill='#059669')
    draw_arrow(draw, (680, 440), (760, 440), fill='#059669')
    draw_arrow(draw, (920, 440), (1000, 440), fill='#059669')
    draw_arrow(draw, (1160, 440), (1240, 440), fill='#059669')
    
    img.save('diagram_imgs/state_machine_diagram.png')
    print('✅ Generated State Machine Diagram')

if __name__ == '__main__':
    make_dfd0()
    make_dfd1()
    make_use_case()
    make_architecture()
    make_erd()
    make_sequence()
    make_state_machine()
    print('🎉 ALL 7 DIAGRAM IMAGES GENERATED SUCCESSFULLY!')
