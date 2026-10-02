# 🏛️ Shiksha Setu - System Architecture & Comprehensive Diagrams Report

> **Platform**: Shiksha Setu - Government School E-Learning Portal (Classes 6–10)  
> **Repository**: [https://github.com/beingkunth-source/govt](https://github.com/beingkunth-source/govt)  
> **Live Web Application**: [https://govt-pi.vercel.app/](https://govt-pi.vercel.app/)

---

## 📋 Table of Contents
1. [Executive Summary](#-executive-summary)
2. [Data Flow Diagrams (DFD)](#-data-flow-diagrams-dfd)
   - [DFD Level 0 (Context Diagram)](#dfd-level-0-context-diagram)
   - [DFD Level 1 (Subsystem Functions)](#dfd-level-1-subsystem-functions)
3. [Use Case Diagrams](#-use-case-diagrams)
4. [System Architecture Diagram](#-system-architecture-diagram)
5. [Entity Relationship (ER) & Data Model Diagram](#-entity-relationship-er--data-model-diagram)
6. [Sequence Diagram: Offline Sync & PWA Cache](#-sequence-diagram-offline-sync--pwa-cache)
7. [State Machine Diagram: Interactive Science Lab Lifecycle](#-state-machine-diagram-interactive-science-lab-lifecycle)
8. [Module & Security Breakdown](#-module--security-breakdown)

---

## 💡 Executive Summary

**Shiksha Setu** is an accessible, offline-first E-Learning Single Page Web Application (SPA) designed specifically for Indian Government School students in Classes 6 through 10. Built with zero heavy external runtime dependencies, the platform provides seamless offline learning, interactive HTML5/Canvas science simulations, teacher assignment propagation, AI doubt solving, progress tracking, downloadable certificates, and multi-language support (English, Hindi, Marathi).

---

## 🔄 Data Flow Diagrams (DFD)

### DFD Level 0 (Context Diagram)

The Level 0 Data Flow Diagram illustrates the boundaries of the Shiksha Setu System, showing how external entities (Student, Teacher, Offline PWA Engine, and Cloud Server) interact with the core system.

```mermaid
graph TD
    classDef actorStyle fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b;
    classDef processStyle fill:#059669,stroke:#047857,stroke-width:3px,color:#ffffff;
    classDef storeStyle fill:#e6f4ea,stroke:#0d9488,stroke-width:2px,color:#0f766e;

    Student["👨‍🎓 Student Entity"]:::actorStyle
    Teacher["👨‍🏫 Teacher Entity"]:::actorStyle
    CloudServer["☁️ Shiksha Setu REST Server"]:::actorStyle

    System["0.0 Shiksha Setu Core System"]:::processStyle

    Student -->|"1. Input Credentials / Role Select"| System
    Student -->|"2. Submit Quiz & Lab Answers"| System
    Student -->|"3. Ask AI Doubts & Search Library"| System
    System -->|"4. Render Courses, Labs & Progress"| Student
    System -->|"5. Generate Downloadable Certificate"| Student

    Teacher -->|"6. Create Class, Subject & Topics"| System
    Teacher -->|"7. Upload Videos & PDF Learning Materials"| System
    Teacher -->|"8. Assign Topics to Target Classes"| System
    System -->|"9. Display Class Analytics & Student Submissions"| Teacher

    System <-->|"10. REST API JSON Sync (Auth, Courses, Assignments)"| CloudServer
```

---

### DFD Level 1 (Subsystem Functions)

The Level 1 Data Flow Diagram decomposes Process 0.0 into major functional sub-processes and client-side data stores.

```mermaid
graph TD
    classDef process fill:#059669,stroke:#047857,stroke-width:2px,color:#ffffff;
    classDef store fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#064e3b;
    classDef entity fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b;

    Student["👨‍🎓 Student"]:::entity
    Teacher["👨‍🏫 Teacher"]:::entity

    P1["1.0 Authentication & Session Manager"]:::process
    P2["2.0 Content & Quiz Authoring Engine"]:::process
    P3["3.0 Interactive Science Lab Engine"]:::process
    P4["4.0 Progress & Certificate Engine"]:::process
    P5["5.0 AI Doubt Solver Engine"]:::process
    P6["6.0 ServiceWorker Cache & Sync Engine"]:::process

    D1[("D1 User Profile & Auth Store")]:::store
    D2[("D2 Course & Assignment Store")]:::store
    D3[("D3 Progress & Scores Store")]:::store
    D4[("D4 Offline Cache Store")]:::store

    Student -->|"Login Request"| P1
    P1 -->|"Session Token"| D1
    P1 -->|"User Auth State"| Student

    Teacher -->|"Create Courses & Assign Topics"| P2
    P2 -->|"Write Assignments & Modules"| D2

    D2 -->|"Read Assigned Topics"| Student
    Student -->|"Execute Lab Simulations"| P3
    P3 -->|"Lab Telemetry"| D3

    Student -->|"Submit Quizzes & Module Completion"| P4
    P4 -->|"Update XP, Badges & Certs"| D3
    D3 -->|"Render Student Stats"| P4
    P4 -->|"Issue Certificate PDF"| Student

    Student -->|"Submit Query"| P5
    P5 -->|"AI Solution & Step Explanation"| Student

    P6 <-->|"Background Sync"| D2
    P6 <-->|"Offline Precache"| D4
```

---

## 🎯 Use Case Diagrams

The Use Case Diagram displays all actor interactions across Student, Teacher, and System background roles.

```mermaid
graph LR
    classDef actor fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b;
    classDef uc fill:#ffffff,stroke:#059669,stroke-width:2px,color:#064e3b;

    Student["👨‍🎓 Student"]:::actor
    Teacher["👨‍🏫 Teacher"]:::actor
    OfflineEngine["⚡ PWA Offline Engine"]:::actor

    subgraph "Shiksha Setu Platform Capabilities"
        UC1["UC-1: Authenticate & Select Class"]:::uc
        UC2["UC-2: Browse Digital Library & Videos"]:::uc
        UC3["UC-3: Perform Interactive Science Labs"]:::uc
        UC4["UC-4: Complete Quizzes & Track XP"]:::uc
        UC5["UC-5: Ask AI Doubt Solver"]:::uc
        UC6["UC-6: Download Certificate"]:::uc
        UC7["UC-7: Adjust Quick Settings"]:::uc

        UC8["UC-8: Create Class & Subject Structure"]:::uc
        UC9["UC-9: Author Page & Custom Quizzes"]:::uc
        UC10["UC-10: Upload Video & PDF Center"]:::uc
        UC11["UC-11: Assign Topics to Target Class"]:::uc
        UC12["UC-12: Preview Student Learning View"]:::uc

        UC13["UC-13: Cache Offline Static Assets"]:::uc
        UC14["UC-14: Store Local Progress in LocalStorage"]:::uc
        UC15["UC-15: Auto Sync Local Data on Reconnect"]:::uc
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    Teacher --> UC1
    Teacher --> UC8
    Teacher --> UC9
    Teacher --> UC10
    Teacher --> UC11
    Teacher --> UC12

    OfflineEngine --> UC13
    OfflineEngine --> UC14
    OfflineEngine --> UC15
```

---

## 🏗️ System Architecture Diagram

The multi-tier system architecture highlights the decoupled SPA client layer, PWA cache engine, Local Data Store, and Node.js REST API layer.

```mermaid
graph TB
    classDef layerTitle fill:#059669,stroke:#047857,color:#ffffff,stroke-width:2px;
    classDef component fill:#ffffff,stroke:#0d9488,color:#0f766e,stroke-width:2px;
    classDef db fill:#ecfdf5,stroke:#059669,color:#064e3b,stroke-width:2px;

    subgraph "Client Layer (Single Page Application)"
        UI["Modern Responsive UI (HTML5, Vanilla CSS System)"]:::component
        Router["App Router (Hash-based Navigation)"]:::component
        A11y["Accessibility Manager (Theme, Fonts, TTS)"]:::component
        I18n["Language Manager (English, Hindi, Marathi)"]:::component
        Modules["Interactive Science Labs Engine (Classes 6-10)"]:::component
    end

    subgraph "PWA & Offline Layer"
        SW["ServiceWorker (sw.js v9 Cache API)"]:::component
        Sync["Sync Manager (Online/Offline Detector)"]:::component
    end

    subgraph "Client Data Persistence Layer"
        LocalStorage[("Browser LocalStorage")]:::db
        ProgressStore[("Progress Tracker State")]:::db
        AuthoringStore[("Authoring Engine Storage")]:::db
    end

    subgraph "Backend API Layer (Node.js REST Server)"
        Server["Express API Server (server.js)"]:::component
        AuthAPI["JWT Auth & Role Guard"]:::component
        CourseAPI["Course & Assignment Endpoints"]:::component
        Database[("SQLite / JSON Persistent DB")]:::db
    end

    UI --> Router
    UI --> A11y
    UI --> I18n
    UI --> Modules

    Router --> SW
    SW --> Sync

    Modules --> ProgressStore
    Router --> AuthoringStore
    ProgressStore --> LocalStorage
    AuthoringStore --> LocalStorage

    Sync <-->|"HTTP REST JSON"| Server
    Server --> AuthAPI
    Server --> CourseAPI
    CourseAPI --> Database
```

---

## 📊 Entity Relationship (ER) & Data Model Diagram

The ER Diagram defines data entities, fields, keys, and relational cardinalities supporting local persistence and server sync.

```mermaid
erDiagram
    USER ||--o{ ASSIGNMENT : "creates"
    USER ||--o{ PROGRESS : "tracks"
    CLASS_SUBJECT ||--|{ TOPIC : "contains"
    TOPIC ||--o{ ASSIGNMENT : "assigned_in"
    TOPIC ||--o| SCIENCE_LAB : "includes"
    TOPIC ||--o| QUIZ : "assesses"

    USER {
        string id PK
        string username
        string name
        string role "student | teacher"
        int selectedClass "6..10"
        string school
        string token
    }

    CLASS_SUBJECT {
        string class_id PK "class-6 .. class-10"
        string title
        string subject_name "Science | Math | Social"
    }

    TOPIC {
        string topic_id PK
        string class_id FK
        string title
        string description
        string videoUrl
        string pdfUrl
    }

    SCIENCE_LAB {
        string lab_id PK
        string topic_id FK
        string class_level
        string simulationType
        json defaultParameters
    }

    QUIZ {
        string quiz_id PK
        string topic_id FK
        json questions
        int totalPoints
    }

    ASSIGNMENT {
        string assignment_id PK
        string teacher_id FK
        string topic_id FK
        int targetClass
        string dateAssigned
    }

    PROGRESS {
        string progress_id PK
        string user_id FK
        json completedTopics
        json quizScores
        int totalXP
        json badgesEarned
        boolean certificateClaimed
    }
```

---

## ⚡ Sequence Diagram: Offline Sync & PWA Cache

Demonstrates how user interactions function seamlessly offline and sync immediately upon reconnecting to the network.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant SPA as SPA Frontend (AppRouter)
    participant SW as ServiceWorker Cache
    participant LS as LocalStorage Engine
    participant Sync as Sync Manager
    participant Server as Backend REST API

    Student->>SPA: Click "Start Science Lab" or "Take Quiz"
    SPA->>SW: Fetch Asset / Lab Config
    alt Online State
        SW-->>SPA: Return Live Network Response
    else Offline State
        SW-->>SPA: Return Pre-cached Asset from CACHE_NAME v9
    end

    Student->>SPA: Complete Simulation / Submit Quiz Answers
    SPA->>LS: Save XP, Score & Badge to ProgressStore
    LS-->>SPA: Confirm Local Write Success
    SPA-->>Student: Display Score & Congratulations Banner!

    Note over Sync, Server: Network Connection Restored (online event)
    Sync->>Sync: Detect Network Status Change
    Sync->>LS: Read Unsynced Assignments & Telemetry
    Sync->>Server: POST /api/progress/sync (JSON Payload)
    Server-->>Sync: 200 OK (Sync Acknowledged)
    Sync->>LS: Mark Records as Synced
```

---

## 🔬 State Machine Diagram: Interactive Science Lab Lifecycle

Shows the operational states and transitions of the 13 interactive HTML5 Science Lab simulations.

```mermaid
stateDiagram-v2
    [*] --> Uninitialized

    Uninitialized --> Ready : Load Lab Canvas & Select Class Level
    Ready --> ParameterEditing : User Adjusts Sliders / Inputs (Angle, Density, Focal Length)
    ParameterEditing --> PhysicsCalculation : Event Listener Triggered (oninput / onchange)
    PhysicsCalculation --> CanvasRendering : Update State Variables & Optics/Force Formulas
    CanvasRendering --> UserObservation : Render Real-time Canvas Animation & Charts

    UserObservation --> QuizPrompt : Click "Check Understanding Quiz"
    QuizPrompt --> VerificationPassed : Correct Answer Submitted
    QuizPrompt --> ParameterEditing : Incorrect Answer (Retry Simulation)

    VerificationPassed --> ProgressAwarded : Award +50 XP & Module Badge
    ProgressAwarded --> [*] : Return to Science Lab Index
```

---

## 🔐 Module & Security Breakdown

| Module Name | File Location | Key Responsibilities & Capabilities |
| :--- | :--- | :--- |
| **App Router** | `js/app.js` | SPA hash router (`#dashboard`, `#teacher`, `#lab`, etc.), route protection, Quick Settings drawer control. |
| **Interactive Science Labs** | `js/modules.js` | 13 Class 6–10 interactive simulations (Optics, Density, Friction, Photosynthesis, Sound Waves, Circuits). |
| **Authoring Engine** | `js/builder.js` | Topic authoring, quiz creation, PDF/Video assignment to target classes, assignment event propagation. |
| **Progress Tracker** | `js/progress.js` | LocalStorage state tracking, XP scoring, badge unlocking, and certificate PDF generation. |
| **Accessibility Manager** | `js/accessibility.js` | Theme toggling (Dark/Light), text font scaling (`font-sm`..`font-xl`), high contrast, and SpeechSynthesis TTS. |
| **ServiceWorker** | `sw.js` | Cache-first / Network-first PWA caching strategy with auto cache purging (`shiksha-setu-cache-v9`). |
| **Backend REST Server** | `server.js` | Node.js Express server providing authentication, course persistence, and assignment sync APIs. |

---

> **Report Generated**: October 2026  
> **Status**: Fully Tested & Verified  
> **Repository**: [github.com/beingkunth-source/govt](https://github.com/beingkunth-source/govt)
