# 🛡️ Digital Suraksha (डिजिटल सुरक्षा)
### Complete Full-Stack Online Fraud Awareness Platform for Rural India
**College Community Engagement Project (CEP)**

[![CI Pipeline](https://github.com/digital-suraksha/digital-suraksha/actions/workflows/ci.yml/badge.svg)](https://github.com/digital-suraksha/digital-suraksha)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node: >=20](https://img.shields.io/badge/Node-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![Database: Prisma / SQLite / Postgres](https://img.shields.io/badge/DB-PostgreSQL%20%2F%20SQLite-blue.svg)](https://www.prisma.io/)

---

## 🌟 About the Project (प्रकल्प परिचय)
**Digital Suraksha (डिजिटल सुरक्षा)** is a full-stack, responsive, multilingual educational web application designed to empower villagers, farmers, senior citizens, rural women, and first-time smartphone users in India with essential cybersecurity literacy.

*Simple Hinglish Explanation:*
> Yeh project ek real, working cybersecurity platform hai jo gaon ke logon aur naye smartphone users ko online fraud (jaise fake bank calls, OTP chori, WhatsApp par aane wali nakli shadi card APK files, aur UPI collect request scam) se bachna sikhata hai. Isme Hindi, Marathi aur English mein aawaz sahayata (Voice Guidance), interactive scenario practice, server-verified quizzes aur emergency helpline (1930) ki poori jankari di gayi hai.

---

## 🚀 Key Modules & Features
- **Module A: Home Page** — Hero safety message, 1930 emergency shortcut, 4 Golden Rules of Cyber Safety, quick learning cards.
- **Module B: Smartphone Safety Guide** — 6 essential steps: Screen locks, official Play Store downloads, SMS app permission audits, anti-malware habits, and dangerous screen-sharing app warnings (AnyDesk / QuickSupport).
- **Module C: Online Fraud Library** — 11+ in-depth fraud topics (Fake bank calls, OTP theft, fake KYC, phishing links, lottery scams, job scams, WhatsApp emergencies, digital arrest scams, malicious APKs, fake customer care).
- **Module D: UPI & Digital Payment Safety** — Fundamental law: **UPI PIN is ONLY for SENDING money, NEVER for receiving money.** GPay, PhonePe, and Paytm practical safety rules.
- **Module E: Safe vs. Unsafe Scenarios** — Interactive simulation cards where citizens evaluate real-life calls and messages with instant server-side feedback.
- **Module F: Interactive Quiz Engine** — Beginner, Intermediate, and Advanced quizzes with tamper-proof server-side score calculation, feedback, and question explanations.
- **Module G: Multilingual Localization** — Full native support for **हिन्दी (Hindi)**, **मराठी (Marathi)**, and **English** across all content and buttons.
- **Module H: Voice Guidance (आवाज़ सहायता)** — Browser Web Speech synthesis allows users who struggle with reading text to listen to topics aloud in their mother tongue.
- **Module I: Emergency Cyber Crime Response** — National Helpline 1930, cybercrime.gov.in integration, first 1-2 hours "Golden Hour" fund freezing guidance, and emergency bank hotlisting numbers.
- **Module J: Community Engagement (CEP)** — 45-minute village workshop schedule, printable pocket safety checklist, and participant observation feedback form.
- **Module K: College Project Documentation** — Complete academic CEP problem statement, architecture diagrams, methodology, and limitations.
- **Admin Portal** — Secure administrator dashboard protected by bcrypt password hashing, HttpOnly JWT cookies, rate limiting, and audit trail logging.

---

## 🛠️ Technology Stack
- **Monorepo**: npm workspaces
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router 6, TanStack Query
- **Backend**: Node.js, Express, TypeScript, Zod validation, JWT, bcryptjs, Helmet, Express Rate Limit
- **Database**: PostgreSQL (Production & Docker) + SQLite (Zero-config local student run) via Prisma ORM
- **Testing**: Vitest, React Testing Library, Supertest (17+ automated API tests passing)
- **Infrastructure**: Docker, Docker Compose, GitHub Actions CI

---

## ⚡ Quick Start for Beginners (5 Minutes Setup)

### 1. Prerequisites
- **Node.js**: Version 18.x, 20.x, or 24.x
- **Git**

### 2. Installation
Open PowerShell or Command Prompt in the project folder:
```powershell
# 1. Install all monorepo dependencies
npm run dev:setup  # or npm install

# 2. Setup database and seed authentic tri-lingual curriculum
npm run db:setup --workspace=packages/backend

# 3. Start development servers
# Terminal 1 - Backend Server (Port 5000):
npm run dev --workspace=packages/backend

# Terminal 2 - Frontend Web Application (Port 5173):
npm run dev --workspace=packages/frontend
```

Now open your web browser at:
👉 **http://localhost:5173**

---

## 👤 Administrator Demo Credentials
For evaluating the administrative portal (`/admin/login`):
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@suraksha.gov.in`
- **Password**: `SurakshaAdmin2026!`

---

## 🧪 Running Automated Tests
```powershell
# Run backend API integration tests (Supertest + Vitest)
npm run test --workspace=packages/backend

# Run frontend component & localization tests (Vitest + RTL)
npm run test --workspace=packages/frontend
```

---

## 📁 Repository Structure
```
Mayur CEP 1/
├── packages/
│   ├── shared/       # Shared TypeScript types, Zod schemas, constants
│   ├── backend/      # Express REST API, Prisma schema, migrations, seed script
│   └── frontend/     # React 18 + Vite frontend, Tailwind CSS, Locales (hi, mr, en)
├── docker-compose.yml# Production PostgreSQL + Backend + Nginx setup
├── Dockerfile        # Multi-stage container build
├── ARCHITECTURE.md   # Architectural design & data flow
├── API.md            # REST API documentation
├── DATABASE.md       # Prisma models & schema relationships
├── SECURITY.md       # Security controls & responsible disclosure
├── TESTING.md        # Test suite execution & verification report
├── DEPLOYMENT.md     # Production deployment instructions
└── USER_GUIDE.md     # Citizen & College volunteer manual
```
