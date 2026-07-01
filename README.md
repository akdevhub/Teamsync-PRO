<div align="center">

# 🚀 TeamSync Pro

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

**A modern full-stack team collaboration and task management platform.**

*TeamSync Pro helps individuals and teams organize projects, manage tasks, track progress, and improve productivity through a stark, ultra-minimalist, high-performance dashboard.*

[Explore Features](#-features) • [Installation](#%EF%B8%8F-installation) • [API Endpoints](#-api-endpoints) • [Internship Details](#-internship-task-coverage)

</div>

---

## ✨ The Aesthetic

TeamSync Pro shies away from bloated corporate dashboards. Instead, it embraces an **ultra-modern, Notion-style monochrome aesthetic**. It features a dynamic split-screen authentication flow, floating micro-animations, and pure black/white stark contrast to maximize focus and productivity.

---

## 📌 Features

### 🔐 Authentication & Security
- **JWT Authentication**: Bulletproof session management.
- **Bcrypt Security**: Bank-grade password hashing.
- **Protected Routes**: Secure navigation and API walls.
- **Split-Screen UI**: Dynamic, animated login and registration screens.

### 📁 Project & Task Management
- **Full CRUD Support**: Seamlessly create, edit, update, and delete projects and tasks.
- **Status Tracking**: Visual indicators for `Todo`, `In Progress`, and `Completed`.
- **Prioritization**: High, Medium, and Low tagging for urgency.
- **Due Date Tracking**: Never miss a deadline with integrated timelines.

### 📊 Dashboard & Analytics
- **Project Overview**: Bird's-eye view of your total operation.
- **Real-Time Statistics**: In-memory backend caching (60s) for lightning-fast dashboard renders.
- **Interactive Charts**: Grayscale, dynamic Recharts integrations.
- **Productivity Insights**: Visualize your workflow bottlenecks.

---

## 🛠️ Tech Stack Architecture

<table>
  <tr>
    <td align="center" width="30%">
      <b>Frontend</b><br><br>
      React.js (Vite)<br>
      Tailwind CSS<br>
      React Router DOM<br>
      Recharts & Axios
    </td>
    <td align="center" width="30%">
      <b>Backend</b><br><br>
      Node.js<br>
      Express.js<br>
      Custom Logging Middleware<br>
      In-Memory Caching
    </td>
    <td align="center" width="30%">
      <b>Database & Security</b><br><br>
      MongoDB Atlas & Mongoose<br>
      JWT (JSON Web Token)<br>
      Bcryptjs<br>
      Helmet & Rate Limiting
    </td>
  </tr>
</table>

---

## 📂 Project Structure

```text
TeamSyncPro/
│
├── frontend/             # React + Vite Client
│   ├── src/              # Components, Context, Features, Routes
│   ├── public/           # Static Assets
│   └── package.json
│
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Route Logic & Caching
│   │   ├── models/       # Mongoose Schemas
│   │   ├── routes/       # API Endpoints
│   │   ├── middleware/   # JWT, Logging, Rate Limiting
│   │   └── config/       # MongoDB Connection
│   ├── server.js         # Entry Point
│   └── package.json
│
├── README.md             # You are here!
└── .env.example          # Environment variables template
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd TeamSyncPro
```

### 2. Environment Variables
Create a `.env` file inside the `backend/` folder based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Spin Up the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Spin Up the Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 Core API Endpoints

<details>
<summary><b>Click to view API Routes</b></summary>

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate & receive JWT

### Projects
- `GET /api/projects` - Retrieve all user projects
- `POST /api/projects` - Create a project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks` - Retrieve all user tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Analytics
- `GET /api/analytics/summary` - Retrieve cached (60s) dashboard statistics

</details>

---

## 🎯 Internship Task Coverage

This application satisfies all core requirements for the **Cognifyz Technologies Full Stack Development Internship Program**:

- **Task 1**: HTML Structure and Basic Server Interaction
- **Task 2**: Server-Side Validation
- **Task 3**: Advanced CSS Styling and Responsive Design (Tailwind CSS)
- **Task 4**: Dynamic DOM Manipulation (React)
- **Task 5**: REST API Integration and Front-End Interaction (Axios)
- **Task 6**: Database Integration and User Authentication (MongoDB + JWT)
- **Task 7**: External API Integration
- **Task 8**: Caching & Middleware Implementation (Dashboard Cache + Logger)

---

## 🚀 Future Enhancements
- [ ] Team Collaboration & Invites
- [ ] Direct Task Assignments
- [ ] Push Notifications
- [ ] File Attachments (AWS S3)
- [ ] Real-Time WebSockets Updates

---

<div align="center">
  <p><i>Educational and evaluation purposes only.</i></p>
</div>
