# 🎓 PRISM Learning Platform

![PRISM Platform](https://img.shields.io/badge/PRISM-Learning_Platform-indigo?style=for-the-badge&logo=react)
![Next.js 14](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![FFmpeg HLS](https://img.shields.io/badge/HLS_Streaming-FFmpeg-red?style=for-the-badge&logo=ffmpeg)

**PRISM Learning Platform** is a fullstack, production-ready Learning Management System (LMS) built with Next.js 14, Node.js Express, PostgreSQL, Prisma ORM, and FFmpeg HLS Adaptive Video Streaming.

---

## 🌟 Core Role Capabilities

### 🛡️ Admin Governance Operations (`/admin`)
* **Hero Analytics Dashboard**: Real-time platform metrics grid (Total Courses, Published vs Pending, Active Students & Instructors, Storage Used, Gross Revenue, 20% Platform Fee).
* **Course Approval Queue & History**: 
  - **Pending Review Queue**: Interactive course inspection and approval/rejection state machine.
  - **Detailed Course Inspection**: 360° audit of course metadata, section hierarchy, lesson types, HLS renditions readiness (360p, 720p, 1080p), and instructor credentials.
  - **Audit History Log**: Complete timestamped audit log recording approval/rejection decisions, reviewer identity, and feedback notes.
* **Catalogue & Search Governance**: Real-time debounced search bar filtering platform courses by title, category, and instructor across all lifecycle states (`All Courses`, `Pending Review`, `Published`, `Drafts`, `Rejected`).
* **User Governance & Role Management**: Searchable member directory for Students & Instructors with role assignment safeguards protecting Admin accounts from self-demotion.
* **Storage Metrics & Garbage Collection**: Per-instructor storage reporting (Raw MP4, HLS renditions, Thumbnails) with an automated Garbage Collection engine to purge orphaned or failed upload assets.
* **Bandwidth & Streaming Analytics**: Aggregated streaming bandwidth calculations per instructor and per course based on video renditions and student stream playbacks.
* **Instructor Payout & Revenue Ledger**: Financial calculation reporting: Gross Revenue per course, 20% platform commission, and 80% net instructor payouts.

### 👨‍🏫 Instructor Studio (`/instructor`)
* **Interactive Curriculum Builder**: Drag & drop section & lesson management (Videos, Articles, Quizzes).
* **Adaptive HLS Video Transcoding**: Auto-converts uploaded raw MP4/MOV videos into multi-resolution HLS `.m3u8` streams (1080p, 720p, 480p, 360p).
* **Instructor Course Overview & Stats**: Real-time course stats, student progress trackers, and curriculum breakdown.
* **Revenue & Earnings Portal**: Live instructor earnings share breakdown, gross sales, and withdrawal statements.
* **Students Directory**: Database-sourced student buyers list with contact info & enrollment history.

### 👨‍🎓 Student Hub (`/student`)
* **Course Catalogue**: Search, filter by category and level (Beginner, Intermediate, Advanced).
* **Adaptive HLS Video Player**: Powered by `hls.js` with quality selector, speed control (0.5x - 2x), and fullscreen toggle.
* **Conditional Lesson Readers**: Custom article reader view for note-based lessons and interactive quiz assessments.
* **Razorpay Payment Integration**: Secure enrollment checkout flow with payment verification and instant receipt statements.

---

## 📁 Repository Structure

```
PRISM-Learning-Platform/
├── 📁 backend/                  # Node.js & Express API Server
│   ├── src/
│   │   ├── controllers/        # Request Handlers (Admin, Auth, Course, Video, Payment)
│   │   ├── services/           # Business & Database Logic (Admin, HLS Transcoding, Storage)
│   │   ├── routes/             # Protected API Routes & Middleware Guards
│   │   ├── middleware/         # Authentication & Admin Role Guards
│   │   └── validators/         # Zod Validation Schemas
│   ├── prisma/                 # PostgreSQL Database Schema & Migrations
│   └── package.json
├── 📁 frontend/                 # Next.js 14 App Router Application
│   ├── app/
│   │   ├── admin/              # Admin Governance Pages (Dashboard, Approvals, Users, Storage, Usage, Payouts)
│   │   ├── instructor/         # Instructor Studio Pages & Curriculum Builder
│   │   └── (student)/          # Student Hub, Catalogue & Video Player
│   ├── components/
│   │   ├── admin/              # Admin UI Components, Approval Queue, Metrics & Tables
│   │   ├── instructor/         # Instructor Studio Components
│   │   └── student/            # HLS Player & Catalogue Components
│   ├── lib/api/                # Typed Frontend API Clients
│   └── package.json
├── 📄 docker-compose.yml        # Docker Multi-Container Launcher
├── 📄 .env.example              # Template Environment Variables
└── 📄 README.md                 # Project Overview & Setup Guide
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18.x or higher
* **PostgreSQL**: v14.x or higher
* **FFmpeg**: Installed and available in PATH (for HLS video transcoding)

### 1️⃣ Setup & Run Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 2️⃣ Setup & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🛡️ License
Distributed under the MIT License.
