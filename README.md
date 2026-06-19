# 🚗 SplitWheelz — Own the Drive, Share the Cost

> **India's #1 Fractional Vehicle Ownership Platform**  
> Built with enterprise-grade architecture. Premium UI/UX inspired by Tesla, Airbnb, Uber, and Stripe.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Features](#features)

---

## 🎯 Overview

SplitWheelz enables multiple verified users to co-own vehicles by splitting the down payment, EMI, insurance, and maintenance costs. Key benefits:

- **Save up to 75%** on vehicle ownership costs
- **AI-powered scheduling** prevents booking conflicts
- **KYC-verified** co-owners with trust scoring
- **Legal co-ownership** registered with RTO
- **Real-time payments** via Razorpay
- **Predictive maintenance** alerts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CloudFront CDN                    │
├─────────────────────────────────────────────────────┤
│              Nginx Reverse Proxy (SSL)               │
├────────────────────┬────────────────────────────────┤
│   React Frontend   │      Express.js Backend         │
│   (Vite + TS)      │      (Node.js + TS)             │
├────────────────────┴────────────────────────────────┤
│              PostgreSQL (AWS RDS)                    │
│              Redis (ElastiCache)                     │
├─────────────────────────────────────────────────────┤
│  Firebase Auth │ AWS S3 │ Razorpay │ FCM │ SendGrid │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2 | UI Framework |
| Vite | 5.0 | Build Tool |
| TypeScript | 5.2 | Type Safety |
| TailwindCSS | 3.3 | Styling |
| Framer Motion | 10 | Animations |
| React Router | 6.18 | Routing |
| Tanstack Query | 5.0 | Server State |
| Zustand | 4.4 | Client State |
| Recharts | 2.9 | Data Visualization |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20 | Runtime |
| Express.js | 4.18 | Web Framework |
| TypeScript | 5.2 | Type Safety |
| Prisma ORM | 5.6 | Database ORM |
| PostgreSQL | 15 | Primary Database |
| Firebase Admin | 11 | Authentication |
| Razorpay | 2.9 | Payments |
| AWS SDK | 3 | S3 Storage |
| Winston | 3.11 | Logging |
| Swagger | 6 | API Docs |

---

## 📁 Project Structure

```
splitwheelz/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── layout/        # DashboardLayout, Navbar, Sidebar
│   │   │   └── ui/           # Button, Input, Card, Badge, etc.
│   │   ├── pages/             # All page components
│   │   │   ├── Landing/       # Landing page (Tesla-style)
│   │   │   ├── Auth/          # Login, Signup (Firebase)
│   │   │   ├── Dashboard/     # User dashboard with charts
│   │   │   ├── Marketplace/   # Vehicle marketplace + filters
│   │   │   ├── VehicleDetails/# Gallery, specs, ownership
│   │   │   ├── Booking/       # Calendar booking system
│   │   │   ├── Payments/      # Razorpay integration
│   │   │   ├── CoOwners/      # Chat, voting, disputes
│   │   │   ├── Notifications/ # Notification center
│   │   │   ├── Admin/         # Admin analytics dashboard
│   │   │   ├── Settings/      # Profile, security, preferences
│   │   │   ├── HelpCenter/    # FAQ and support
│   │   │   ├── Contact/       # Contact form
│   │   │   └── Legal/         # Privacy & Terms
│   │   ├── store/             # Zustand stores (auth, vehicle)
│   │   ├── lib/               # Firebase, API client, utils
│   │   └── types/             # TypeScript type definitions
│   └── Dockerfile
├── backend/                   # Express.js + TypeScript API
│   ├── src/
│   │   ├── config/            # DB, Firebase, AWS, Swagger, Logger
│   │   ├── controllers/       # Auth, Vehicle, Booking, Payment, etc.
│   │   ├── middleware/        # Auth, Error, RateLimit, Upload
│   │   ├── routes/            # All API routes
│   │   └── services/          # Email, notifications
│   └── Dockerfile
├── prisma/
│   ├── schema.prisma          # Complete Prisma schema (15+ models)
│   └── seed.ts                # Realistic seed data
├── deployment/
│   ├── nginx.conf             # Production Nginx config
│   └── AWS_DEPLOY.md          # AWS deployment guide
├── docs/
│   └── api/                   # API documentation
├── .github/
│   └── workflows/ci.yml       # GitHub Actions CI/CD
├── docker-compose.yml         # Full stack Docker setup
├── .env.example               # Environment variables template
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/splitwheelz.git
cd splitwheelz

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials (Firebase, Razorpay, AWS, etc.)
```

### 3. Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or individually:
cd frontend && npm run dev     # http://localhost:5173
cd backend && npm run dev      # http://localhost:5000
```

### 5. Docker (Full Stack)

```bash
docker-compose up -d
# Frontend: http://localhost:80
# Backend:  http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

---

## 🔑 Environment Variables

See `.env.example` for all required variables. Key ones:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/splitwheelz
FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_API_KEY=your-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-secret
AWS_S3_BUCKET=splitwheelz-uploads
JWT_SECRET=your-256-bit-secret
```

---

## 📡 API Documentation

Available at `http://localhost:5000/api-docs` when running locally.

### Key Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register/Login with Firebase |
| GET | `/api/vehicles` | List vehicles with filters |
| GET | `/api/vehicles/:id` | Vehicle details |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/availability/:id` | Check availability |
| POST | `/api/payments/create-order` | Create Razorpay order |
| POST | `/api/payments/verify` | Verify payment signature |
| GET | `/api/ownership/my-shares` | Get ownership shares |
| POST | `/api/ownership/join` | Join vehicle ownership |
| GET | `/api/admin/stats` | Platform analytics |

---

## 🗃️ Database Schema

Key models in Prisma schema:

- **User** — Profile, KYC, trust score, FCM tokens
- **Vehicle** — Specs, pricing, slots, status
- **OwnershipShare** — Fractional ownership records
- **Booking** — Time slots, QR codes, status
- **Payment** — Razorpay integration, EMI tracking
- **ChatRoom + ChatMessage** — Group chat per vehicle
- **Vote** — Governance voting (maintenance, insurance)
- **Dispute** — Conflict resolution workflow
- **Notification** — Multi-channel alerts
- **ActivityLog** — Comprehensive audit trail

Run `npx prisma studio` to explore data visually.

---

## 🚢 Deployment

See [deployment/AWS_DEPLOY.md](deployment/AWS_DEPLOY.md) for full guide.

**Quick summary:**
1. Deploy RDS PostgreSQL instance
2. Deploy backend on EC2 (Node.js 20)
3. Build frontend → deploy to S3 + CloudFront
4. Configure Nginx with SSL (Let's Encrypt)
5. Set up GitHub Actions for CI/CD

---

## ✨ Features

### User Features
- 🔐 Firebase Auth (Email + Google OAuth + Phone OTP)
- 🚗 Vehicle Marketplace with advanced filters
- 👥 Co-ownership with 2-4 verified owners
- 📅 AI-powered booking calendar with conflict detection
- 💳 Payments via UPI, Card, NetBanking (Razorpay)
- 💬 Group chat for co-owners
- 🗳️ Voting system (maintenance, insurance, expenses)
- ⚖️ Dispute resolution center
- 🔔 Push notifications (FCM) + Email alerts
- 📊 Ownership portfolio dashboard
- 🏆 Trust score & ownership score system

### Admin Features
- 📈 Real-time analytics (users, revenue, bookings)
- 🛡️ KYC verification center
- 🚨 Fraud detection system
- 💼 Vehicle & user management
- ⚖️ Dispute escalation & resolution
- 📋 Audit logs

### Technical Highlights
- 🏗️ Clean layered architecture (controllers → services → repositories)
- 🔒 JWT + RBAC authorization
- ⚡ Rate limiting (express-rate-limit)
- 🔍 Comprehensive input validation (Zod)
- 📝 Swagger API documentation
- 🐳 Docker + Docker Compose
- 🔄 GitHub Actions CI/CD
- 📊 Winston structured logging
- 🌐 CORS + Helmet security headers

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

*Built with ❤️ by the SplitWheelz Team | © 2026 SplitWheelz Technologies Pvt. Ltd.*
