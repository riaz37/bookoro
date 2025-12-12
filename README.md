# Mini Booking System (MVP)

A simplified full-stack flight booking system built with NestJS, Next.js, and NeonDB (PostgreSQL).

## Tech Stack
- **Backend**: NestJS, TypeScript, Prisma, NeonDB, JWT, Swagger.
- **Frontend**: Next.js (App Router), Tailwind CSS, Axios, Custom Hooks.
- **Database**: PostgreSQL (NeonDB).

## Prerequisites
- Node.js (v18+)
- pnpm
- A NeonDB account (or any PostgreSQL instance).

## Environment Setup

### 1. Clone the repository
```bash
git clone <repo-url>
cd bookoro
```

### 2. Backend Setup
Create `apps/backend/.env`:
```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
JWT_SECRET="supersecret"
PORT=4000
```
(Note: Using port 4000 to avoid conflict with Frontend).

Install dependencies and migrate:
```bash
cd apps/backend
pnpm install
npx prisma migrate dev --name init
pnpm start:dev
```
Backend API will be running at `http://localhost:4000`.
Swagger Documentation: `http://localhost:4000/api/docs`.

### 3. Frontend Setup
Create `apps/frontend/.env` (optional, if using env vars for API URL):
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Install dependencies and run:
```bash
cd apps/frontend
pnpm install
pnpm dev
```
Frontend will be running at `http://localhost:3000`.

## API Usage
- **Auth**: `POST /auth/login`
- **Users**: `POST /users` (Register)
- **Flights**: `GET /flights`, `POST /flights` (Seeding)
- **Bookings**: `POST /bookings` (Protected)

## Project Structure
- `apps/backend`: NestJS application.
- `apps/frontend`: Next.js application.
- `apps/frontend/src/components`: Reusable UI components.
- `apps/frontend/src/hooks`: Custom React hooks (`useAuth`, `useFlights`).

## Screenshots
(Placeholders for Swagger and Frontend UI screenshots)
