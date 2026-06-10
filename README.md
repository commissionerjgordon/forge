# Forge

**Real-time Collaborative Project Management with AI Assistance**

A modern, full-stack SaaS project management platform built to demonstrate senior software engineering skills using Next.js 15.

## ✨ Features

### Implemented

- **Authentication & Authorization** – Full Clerk integration with protected routes
- **Modern UI/UX** – Beautiful interface with shadcn/ui, Tailwind CSS, and dark mode
- **Responsive Sidebar Layout** – Mobile-friendly navigation with theme toggle
- **Dashboard** – Personalized welcome with stats cards
- **Type-safe Backend** – Prisma ORM with PostgreSQL schema ready for Workspaces, Projects, Boards, and Tasks
- **State Management** – TanStack Query for server state + Zustand ready for client state
- **Protected Routes** – Server-side protection using Next.js App Router and Clerk

### Planned / In Progress

- Clerk Organizations (Multi-tenant Workspaces)
- Real-time Kanban boards with drag & drop
- AI Task Assistant (using Vercel AI SDK)
- Project & Task CRUD operations
- Activity feed and comments
- File attachments
- Role-based access control (Admin, Member, Viewer)

## 🛠 Tech Stack

| Category         | Technology               |
| ---------------- | ------------------------ |
| Framework        | Next.js 16 (App Router)  |
| Language         | TypeScript               |
| Styling          | Tailwind CSS + shadcn/ui |
| Auth             | Clerk                    |
| Database         | PostgreSQL + Prisma      |
| State Management | TanStack Query + Zustand |
| UI Components    | Radix UI + shadcn/ui     |
| Animations       | Framer Motion            |
| Forms            | React Hook Form + Zod    |
| Deployment       | Vercel                   |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local)
- Clerk account
- ngrok

### 1. Clone the repository

```bash
git clone https://github.com/commissionerjgordon/forge.git
cd forge
```

### 2. Install dependenciesbash

```bash
npm install
```

### 3. Set up environment variablesCopy .env.example to .env.local and fill in:env

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL="postgresql://..."
```

### 4. Database Setupbash

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development serverbash

```bash
npm run dev
```

Open http://localhost:3000

### 6. Run ngrok for clerk webhook forwarding

```bash
ngrok http 3000
```

Configure a webhook on clerk dashboard for user events to point to your ngrok gateway

## 📁 Project Structurebash

```bash
app/
├── (protected)/ # Protected routes layout
│ ├── dashboard/
│ └── layout.tsx
├── sign-in/[[...sign-in]]/
├── sign-up/[[...sign-up]]/
├── api/
components/
├── layout/ # Sidebar, ThemeToggle
├── providers/ # QueryProvider, ThemeProvider
├── ui/ # shadcn components
lib/
├── prisma.ts
prisma/
├── schema.prisma
```

## 🎯 Goals of This Project

This project was built as a senior software engineer portfolio piece to showcase:

- Modern Next.js 15 best practices (Server Components, Server Actions, Streaming)
- Clean architecture and project structure
- Authentication + multi-tenancy readiness
- Production-grade developer experience
- Beautiful, accessible UI

## 🔮 Future Enhancements

- Liveblocks real-time collaboration
- AI-powered task generation and summarization
- Stripe subscriptions
- Notifications (in-app + email)
- PDF/CSV export
- Mobile PWA support

## 🤝 Contributing

This is a portfolio project. Feel free to fork and experiment!
