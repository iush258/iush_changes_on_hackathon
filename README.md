<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=HACKTHONIX%202.0&fontSize=70&fontAlignY=35&desc=Build%20from%20Zero%20%C2%B7%20Ship%20before%20Sunset%20%C2%B7%20Outperform%20the%20Rest&descAlignY=55&descAlign=50&animation=twinkling" width="100%" alt="Hackthonix Banner" />

**Presented by the Coding Club, K.D.K. College of Engineering, Nagpur**
*(Autonomous Institute | NAAC & NBA Accredited)*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📋 Table of Contents

<details>
<summary>Click to expand</summary>

- [� Table of Contents](#-table-of-contents)
- [🚀 Overview](#-overview)
- [📅 Event Details](#-event-details)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
  - [🎨 Frontend](#-frontend)
  - [⚙️ Backend \& Database](#️-backend--database)
  - [🚀 DevOps \& Deployment](#-devops--deployment)
- [📁 Project Structure](#-project-structure)
- [👤 User Roles \& Permissions](#-user-roles--permissions)
- [🔄 Platform Flow](#-platform-flow)
- [🏁 Getting Started](#-getting-started)
  - [1️⃣ Clone the Repository](#1️⃣-clone-the-repository)
  - [2️⃣ Install Dependencies](#2️⃣-install-dependencies)
  - [3️⃣ Configure Environment Variables](#3️⃣-configure-environment-variables)
  - [4️⃣ Initialize Database \& Run](#4️⃣-initialize-database--run)
- [🏆 Judging Criteria](#-judging-criteria)
- [💰 Prize Pool](#-prize-pool)
- [🌐 Connect](#-connect)

</details>

---

## 🚀 Overview

**HACKTHONIX 2.0** is a full-stack hackathon management platform built to power a high-intensity, 10-hour innovation sprint. The platform handles everything from team registration and problem statement selection to live GitHub commit tracking and real-time judge evaluation — all under one roof.

> 📍 **Venue:** KDKCE, Block-B, Dept. of CSE, Nagpur
> ⏰ **Event Date:** 10th March 2026 · 7:00 AM onwards

---

## 📅 Event Details

<div align="center">

| 📆 **Date** | ⏰ **Reporting Time** | 👥 **Team Size** | ⏱️ **Duration** |
|:---:|:---:|:---:|:---:|
| 10th March 2026 | 7:00 AM | 2–4 Members | 10-Hour Sprint |

| 📝 **Problem Statements** | 🔒 **PS Lock-in Window** | 🔄 **GitHub Tracking** | 🎟️ **Registration Fee** |
|:---:|:---:|:---:|:---:|
| 12 (Grid Layout) | 10 mins after selection | Every 5 minutes | ₹110 (Early) / ₹150 (Reg) |

</div>

---

## ✨ Features

<details open>
<summary><b>👥 For Participants</b></summary>

- ⚡ **Streamlined Registration** — Team-based signup with no-password access for speed.
- ⏱️ **Live Countdown Timer** — Real-time event clock on every dashboard.
- 🎯 **Problem Statement Grid** — Browse 12 PS cards with title, difficulty & tags.
- 🔒 **10-Minute Lock-in System** — Change your PS freely; it auto-locks after 10 minutes.
- 🔗 **GitHub Repo Submission** — Link your repo and let the system do the rest.
</details>

<details>
<summary><b>🧑‍⚖️ For Judges</b></summary>

- ⚖️ **Dedicated Evaluation Portal** — Cleanly separated from participant flow.
- 📊 **4-Criteria Scoring System** — Score each team 0–25 per criterion.
- 📈 **Live Commit Feed** — View GitHub commit activity in real time.
- 🧊 **Score Freeze** — Submitted scores are locked (Admin override only).
</details>

<details>
<summary><b>🛡️ For Admins</b></summary>

- 📡 **Global Event Monitor** — Real-time overview of all teams and progress.
- ⚙️ **Team & PS Management** — Create, edit, and manage on the fly.
- 📝 **On-Spot Registration** — Add teams directly on event day.
- 🔓 **Lock Override** — Manually adjust PS locks if needed.
- 🏆 **Result Declaration** — Publish final rankings with one action.
</details>

<details>
<summary><b>🔧 Platform-Level</b></summary>

- 🔐 **Role-Based Access Control** — Middleware-enforced route protection.
- ✅ **Input Validation** — Zod schemas on all API endpoints.
- 🛡️ **Rate Limiting** — API abuse prevention built-in.
- 🎨 **Animated UI Components** — GSAP + Framer Motion powered visuals.
- 🌌 **Shader Backgrounds** — GPU-accelerated visual effects via `@paper-design/shaders-react`.
- 🌊 **Smooth Scrolling** — Lenis-powered silky scroll experience.
</details>

---

## 🛠 Tech Stack

### 🎨 Frontend
`Next.js 16.1.6` `React 19` `TypeScript 5` `Tailwind CSS 4` `Shadcn UI` `Framer Motion 12` `GSAP 3` `Lenis 1.3`

### ⚙️ Backend & Database
`Next.js API Routes` `Prisma ORM` `PostgreSQL` `NextAuth.js v5` `Bcryptjs` `Zod`

### 🚀 DevOps & Deployment
`Vercel` `Vercel Analytics` `Vercel Speed Insights` `GitHub API v3`

---

## 📁 Project Structure

<details>
<summary><b>Click to view directory tree</b></summary>

```text
hackathonix-final/
├── web/                        # 🌐 Main Next.js Application
│   ├── src/
│   │   ├── app/                # Next.js App Router (pages & API routes)
│   │   ├── components/         # React components (UI, Auth, Registration)
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities, Prisma client, auth config
│   ├── prisma/                 # Database schema & migrations
│   ├── scripts/                # Dev-ops & utility scripts
│   └── public/                 # Static assets
│
├── addons/                     # 🎨 UI Visual Components (Add-ons)
├── art-gallery-slider/         # Animated gallery component
├── background-paths/           # Animated SVG path backgrounds
├── image-to-particles/         # Particle effect from image
├── ios-style-timer/            # iOS-style countdown timer
├── shader-button/              # GPU-shader animated button
├── shader-gradient-component/  # Gradient shader component
├── shader-svg/                 # Shader-powered SVG effects
│
├── agon-agent_2-*/             # Agent prototypes (Vite + React)
│
└── doc/                        # 📄 Documentation
    ├── hackthon.md             # Event overview & rules
    ├── websiteflow.md          # Platform flow & architecture
    └── LAUNCH_CHECKLIST.md     # Pre-launch checklist
```
</details>

---

## 👤 User Roles & Permissions

```text
┌─────────────────────────────────────────────────────────┐
│                    USER ROLES                           │
├──────────────┬──────────────┬───────────────────────────┤
│ 🧑‍💻 PARTICIPANT│   🧑‍⚖️ JUDGE   │         🛡️ ADMIN          │
├──────────────┼──────────────┼───────────────────────────┤
│  /dashboard  │  /judge      │  /admin                   │
│  Register    │  View Teams  │  Manage Teams & PS        │
│  Select PS   │  Score Teams │  Override Locks           │
│  Submit Repo │  View Commits│  On-spot Registration     │
│  View Timer  │              │  Declare Results          │
└──────────────┴──────────────┴───────────────────────────┘
```

---

## 🔄 Platform Flow

```mermaid
graph TD
    User([👤 User]) --> Landing[🏠 Landing Page]
    Landing -->|Register| RegForm[📝 Registration Form]
    Landing -->|Login| Auth{🔐 Authentication}

    Auth -->|Team| Dash[📊 Team Dashboard]
    Auth -->|Judge| JDash[⚖️ Judge Dashboard]
    Auth -->|Admin| ADash[🛡️ Admin Dashboard]

    subgraph Team Workflow
        Dash --> PSSelect[🎯 Select Problem Statement]
        PSSelect -->|10 min Timer| LockPS{🔒 Lock Selection}
        LockPS -->|Locked| DevPhase[💻 Development Phase]
        DevPhase --> SubmitRepo[🔗 Submit GitHub URL]
        SubmitRepo --> LiveTrack(📈 Live Commit Tracking)
    end

    subgraph Judge Workflow
        JDash --> SelectTeam[Select Team]
        SelectTeam --> EvalForm[📋 Evaluation Form]
        LiveTrack -.->|Data Feed| EvalForm
        EvalForm -->|Submit Scores| DB[(🗄️ Database)]
    end

    subgraph Admin Workflow
        ADash --> Monitor[📡 Global Monitor]
        ADash --> ManagePS[Manage PS]
        ADash --> Results[🏆 Declare Results]
        DB --> Results
    end
```

---

## 🏁 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Pusparaj99op/hackathonix-final.git
cd hackathonix-final/web
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables
Create a `.env.local` file in the `web/` directory:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/hackathonix"
AUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_TOKEN="your-github-personal-access-token"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4️⃣ Initialize Database & Run
```bash
npx prisma generate
npx prisma db push
npm run dev
```
> 🌐 Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏆 Judging Criteria

Each team is scored **0–25 points** per criterion by all assigned judges. Final score is the average.

| # | Criterion | Description |
|:---:|---|---|
| **1** | 📈 **Commit Frequency** | Consistency and regularity of GitHub commits (auto-tracked) |
| **2** | 💻 **Code Quality** | Structure, readability, and engineering best practices |
| **3** | 🎯 **Problem Relevance** | How accurately the solution addresses the problem statement |
| **4** | 🚀 **Final Submission** | Completeness, functionality, and innovation of the prototype |

> 🌟 **Max Score:** 100 points per judge

---

## 💰 Prize Pool

<div align="center">

| 🥇 1st Place | 🥈 2nd Place | 🥉 3rd Place |
|:---:|:---:|:---:|
| **₹10,000** | **₹7,500** | **₹5,000** |

**Total Prize Pool: ₹22,500**

</div>

---

## 🌐 Connect

<div align="center">

[![Website](https://img.shields.io/badge/Website-kdkce.edu.in-blue?style=for-the-badge&logo=google-chrome)](http://www.kdkce.edu.in)
[![Instagram](https://img.shields.io/badge/Instagram-@codingclub__kdk-E4405F?style=for-the-badge&logo=instagram)](https://instagram.com/codingclub_kdk)
[![GitHub](https://img.shields.io/badge/GitHub-Pusparaj99op-181717?style=for-the-badge&logo=github)](https://github.com/Pusparaj99op/hackathonix-final)

</div>

---

<div align="center">

Built with ❤️ by the **Coding Club, KDKCE**

*Build from Zero · Ship before Sunset · Outperform the Rest*

</div>
