# 📚 Grammar40 — Complete 40-Day English Grammar Practice Web Application

Grammar40 is a modern, responsive, production-ready educational platform designed to help students master English grammar through a structured **40-day syllabus**. With automated assessments, anti-cheat monitoring, teacher dashboards, and interactive reward systems, it serves as a complete learning management ecosystem.

🚀 **Live Deployment**:
- **Frontend**: [Vite + React App](https://grammar40-frontend.vercel.app)
- **Backend API**: [Express Serverless on Vercel](https://grammar40-backend.vercel.app)

---

## 🎨 Theme & Aesthetic
Grammar40 uses a custom-curated, vibrant **Emerald, Slate, and Amber** color scheme, avoiding generic AI templates. Featuring soft glassmorphic elements, modern typography (Outfit & Inter), and micro-animations, the user interface feels engaging, premium, and alive.

- **Success Reward (Happy Doll)** 🎉: A cheerful SVG doll with sparkles and arms raised to reward correct answers.
- **Failure Helper (Sad Doll)** 😢: A crying blue-dressed SVG doll to encourage students when they score a 0.

---

## ✨ Features & Functionality

### 1. 👨‍🎓 Student Experience
- **Secure Registration & Login**: Full Name, Roll Number, Class, Section, School, Email, and Password.
- **Personalized Dashboard**:
  - Daily streak tracker (🔥) and highest streak record.
  - Overall progress bar (Day 1 to 40) and Circular Progress Ring.
  - Locked future lessons (students can only access their current active day).
  - Badge cabinet showcasing achievements (e.g. *Week Warrior*, *Century Club*, *Perfect Day*).
- **Interactive Assessments**: 
  - MCQ, fill-in-the-blanks, sentence transformation, and error correction.
  - Shuffled question order to prevent peer cheating.
  - Save progress dynamically with instant, doll-based score feedback.

### 2. 🛡️ Anti-Cheating & Integrity System
- **Focus & Visibility Tracking**: Detects when a student switches tabs or minimizes the window.
- **Dynamic Penalty**: Deducts points (-1 point per 10 seconds away) and records tab-switches.
- **Real-Time Warning**: Shows a alert banner notifying the student of an ongoing penalty.
- **Admin Logs**: Stores full tab-switch counts and timestamps in the database for teacher review.

### 3. 👩‍🏫 Admin / Teacher Panel
- **Classroom Telemetry**: Monitor average classroom scores, total students, and today's active submissions.
- **Student Management**: Search, filter by class/section, view full progress history, reset progress, or delete accounts.
- **Notice Board**: Write and broadcast announcements instantly to the student dashboards.
- **Global Leaderboard**: Live ranking of top-performing students based on score, streak, and progress.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Zustand, Framer Motion, Axios |
| **Backend** | Node.js, Express, Mongoose (MongoDB Atlas), JWT, bcrypt, Helmet |
| **Hosting** | Vercel (Frontend & Backend Serverless) |
| **Database** | MongoDB Atlas Cluster |

---

## 🚀 Getting Started & Local Development

### 1. Clone the repository
```bash
git clone https://github.com/soumik7484-art/grammar-learning-.git
cd grammar-learning-
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Setup and Seed Database
Install backend dependencies and run the seed script to load the 40-day grammar course and create the admin user:
```bash
cd backend
npm install
node src/seed/lessons.js
```

> **Default Admin Credentials**:
> - **Email**: `admin@grammar40.com`
> - **Password**: `Admin@2025`

### 4. Access Live Version
You can directly access the production-ready live app here:
- 🖥️ **Live Website**: **[https://grammar40-frontend.vercel.app](https://grammar40-frontend.vercel.app)**
- ⚙️ **Backend API**: **[https://grammar40-backend.vercel.app](https://grammar40-backend.vercel.app)**

For local testing:
- Run backend locally: `cd backend && npm run dev`
- Run frontend locally: `cd frontend && npm run dev` (views at `http://localhost:5173`)
