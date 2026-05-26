# EduTrack — Student Assignment Submission & Grading Portal

A full-stack web application built for **House of EdTech** that enables teachers to create and manage assignments, and students to submit answers and receive instant AI-powered feedback with automated grading.

---

## Project Overview

EduTrack streamlines the assignment lifecycle from creation to grading. Teachers post structured multi-question assignments; students answer each question and get immediate AI evaluation powered by Groq (LLaMA 3.3 70B). Teachers then review the AI suggestions and assign final grades with remarks.

### Key Features

- **Role-based authentication** — separate teacher and student dashboards via JWT (httpOnly cookies)
- **Assignment management** — teachers create, edit, and delete assignments with per-question marks
- **Student submissions** — per-question answer submission with optional file/link attachment
- **AI evaluation** — automated feedback, suggested grade, and per-question breakdown via Groq AI
- **Teacher grading** — grade modal with AI suggestion, remarks, and resubmission control
- **Resubmission flow** — teachers can request resubmission; students resubmit and get fresh AI feedback
- **Responsive UI** — works across desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Database | MongoDB + Mongoose |
| Authentication | JWT (httpOnly cookies) |
| AI Evaluation | Groq API — LLaMA 3.3 70B Versatile |
| UI Components | shadcn/ui + Tailwind CSS |
| Icons | lucide-react, react-icons |
| Notifications | Sonner (toast) |
| Deployment | Vercel |

---

## Getting Started (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/edutrack.git
cd edutrack
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

> **Never commit `.env.local` to version control.** See `.env.example` for the required variable names.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
edutrack/
├── app/
│   ├── (auth)/              # Login & Register pages
│   ├── (dashboard)/         # Protected teacher & student dashboards
│   │   ├── teacher/         # Assignments, Submissions pages
│   │   └── student/         # Assignments, My Submissions pages
│   └── api/                 # REST API routes
│       ├── auth/            # login, register, logout, me
│       ├── assignments/     # CRUD for assignments
│       └── submissions/     # Submit, grade, resubmit
├── components/              # Shared UI components
├── models/                  # Mongoose models (User, Assignment, Submission)
├── lib/                     # DB connection, JWT helpers, Groq client
└── proxy.ts                 # Route protection middleware (Next.js 16)
```

---

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Sign in, get JWT cookie |
| POST | `/api/auth/logout` | Auth | Clear JWT cookie |
| GET | `/api/auth/me` | Auth | Get current user |
| GET | `/api/assignments` | Auth | List assignments (role-scoped) |
| POST | `/api/assignments` | Teacher | Create assignment |
| PUT | `/api/assignments/:id` | Teacher | Edit assignment |
| DELETE | `/api/assignments/:id` | Teacher | Delete assignment |
| GET | `/api/submissions` | Auth | List submissions (role-scoped) |
| POST | `/api/submissions` | Student | Submit answers + trigger AI |
| GET | `/api/submissions/:id` | Auth | Get single submission |
| PUT | `/api/submissions/:id` | Auth | Grade (teacher) / Resubmit (student) |
| DELETE | `/api/submissions/:id` | Teacher | Delete submission |

---

## Screenshots

> Add screenshots of the app here after deployment.

| Page | Screenshot |
|---|---|
| Login | _(coming soon)_ |
| Teacher — Assignments | _(coming soon)_ |
| Student — Assignments | _(coming soon)_ |
| Grade Modal | _(coming soon)_ |
| Student — My Submissions | _(coming soon)_ |

---

## Live Demo

> [https://your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)

---

## Developer

**Your Name**

- GitHub: [github.com/yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourusername](https://linkedin.com/in/yourusername)

---

Built with ❤️ for **House of EdTech** — India's Multi-Brand Education Company.
