# 🏛️ Shiksha Setu - Government School E-Learning Platform

[![Live App](https://img.shields.io/badge/Vercel-Live%20Demo-059669?style=for-the-badge&logo=vercel)](https://govt-pi.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-0d9488?style=for-the-badge)]()
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20First-10b981?style=for-the-badge)](https://govt-pi.vercel.app/)

**Shiksha Setu** is a lightweight, accessible, offline-first E-Learning platform tailored specifically for Indian Government School students in Classes 6–10. Built with zero heavy framework dependencies, it provides real-time interactive science labs, teacher assignment propagation, AI doubt solving, progress gamification, downloadable certificates, multi-language support (English, Hindi, Marathi), and customizable accessibility settings.

---

## 🌟 Key Features

- 🔬 **13 Class-Specific Interactive Science Labs**: Optics, Friction, Photosynthesis, Sound Waves, Density, Electric Circuits, Separation of Mixtures (Classes 6–10).
- 🎯 **Teacher Assignment & Propagation**: Teachers author topics & quizzes and assign them to specific classes. Assignments propagate instantly to students' dashboards.
- ⚙️ **Quick Settings & Accessibility**: Built-in Dark Mode, Font Scaling (Small..X-Large), High Contrast, Low Data Saver, and SpeechSynthesis Text-to-Speech (TTS).
- 🏆 **Gamified Progress & Certificates**: Real-time XP tracking, topic badges, class leaderboards, and auto-generated official completion certificates.
- ⚡ **PWA Offline Engine**: Complete offline capabilities via ServiceWorker (`sw.js v9`) and LocalStorage fallback.

---

## 📊 System Architecture & Diagrams

Comprehensive system diagrams and data flow documentation are available in [PROJECT_REPORT_WITH_DIAGRAMS.md](PROJECT_REPORT_WITH_DIAGRAMS.md):

- 🔄 **Data Flow Diagram (DFD Level 0 - Context Diagram)**
- 🔄 **Data Flow Diagram (DFD Level 1 - Subsystem Functions)**
- 🎯 **Use Case Diagram (Student, Teacher, Offline PWA Engine)**
- 🏗️ **System Architecture Diagram (SPA Router, ServiceWorker, REST API)**
- 📊 **Entity Relationship (ER) & Data Model Diagram**
- ⚡ **Sequence Diagram (Offline Cache & Sync Lifecycle)**
- 🔬 **State Machine Diagram (Interactive Science Lab Execution)**

---

## 🚀 Quick Start & Development

1. Clone the repository:
   ```bash
   git clone git@github.com:beingkunth-source/govt.git
   cd govt
   ```

2. Start local backend server:
   ```bash
   node server.js
   ```

3. Open `http://localhost:3000` or load `index.html` directly in your browser.

---

## 📄 License
Distributed under the MIT License. Built for Government School digital empowerment.
