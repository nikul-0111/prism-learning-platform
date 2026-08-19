# 🎓 PRISM Learning Platform

![PRISM Platform](https://img.shields.io/badge/PRISM-Learning_Platform-indigo?style=for-the-badge&logo=react)
![Next.js 14](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![FFmpeg HLS](https://img.shields.io/badge/HLS_Streaming-FFmpeg-red?style=for-the-badge&logo=ffmpeg)

**PRISM Learning Platform** is a fullstack, production-ready Learning Management System (LMS) built with Next.js 14, Node.js Express, PostgreSQL, Prisma ORM, and FFmpeg HLS Adaptive Video Streaming.

---

## 🌟 Key Features

### 👨‍🏫 Instructor Studio
* **Interactive Curriculum Builder**: Drag & drop section & lesson management (Videos, Articles, Quizzes).
* **Adaptive HLS Video Transcoding**: Auto-converts uploaded raw MP4/MOV videos into multi-resolution HLS `.m3u8` streams (1080p, 720p, 480p, 360p).
* **Instructor Course Overview & Stats**: Real-time course stats, student progress trackers, and curriculum breakdown.
* **Real-time Revenue & Payouts Portal**: Live 90% instructor earnings share breakdown, gross sales, and withdrawal statements.
* **Students Directory**: Database-sourced student buyers list with contact info & enrollment history.

### 👨‍🎓 Student Hub
* **Course Catalogue**: Search, filter by category and level (Beginner, Intermediate, Advanced).
* **Adaptive HLS Video Player**: Powered by `hls.js` with quality selector, speed control (0.5x - 2x), and fullscreen toggle.
* **Conditional Lesson Readers**: Custom article reader view for note-based lessons and interactive quiz assessments.
* **Razorpay Payment Integration**: Secure enrollment checkout flow with payment verification and instant receipt statements.

---

## 📁 Repository Structure

```
PRISM-Learning-Platform/
├── 📁 backend/                  # Node.js & Express API Server
│   ├── src/                    # Modules (Auth, Courses, Video, Payments, Enrollments)
│   ├── prisma/                 # Database Schema & Migrations
│   └── package.json
├── 📁 frontend/                 # Next.js 14 App Router Application
│   ├── app/                    # Routes (Student & Instructor)
│   ├── components/             # UI Components & HLS Video Player
│   └── package.json
├── 📁 docs/                     # System Architecture & API Documentation
├── 📄 docker-compose.yml        # Docker Multi-Container Launcher
├── 📄 .gitignore                # Excludes secrets, node_modules & media
├── 📄 .env.example              # Template Environment Variables
└── 📄 README.md                 # Project Overview & Setup Guide
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18.x or higher
* **PostgreSQL**: v14.x or higher

### 1️⃣ Clone & Setup Backend
```bash
cd backend
npm install
npx prisma db push
npm run dev
```

### 2️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🛡️ License
Distributed under the MIT License.
