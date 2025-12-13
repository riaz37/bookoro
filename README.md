# Bookoro ✈️

A modern, full-stack flight booking application built with **NestJS**, **Next.js**, **Prisma**, and **TailwindCSS**.

## 🚀 Features

- **Flight Search**: Search for flights with intuitive top-bar filters (destination, price, date).
- **Booking System**: Real-time seat availability, booking management, and cancellations.
- **Modern UI**: Responsive, glassmorphic design with smooth animations.
- **Authentication**: Secure JWT-based auth (Login/Signup).
- **Email Notifications**: Professional HTML booking confirmation emails.

## 🛠️ Tech Stack

### Frontend (`apps/frontend`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Styling**: TailwindCSS, Framer Motion
- **State/Data**: React Context, Axios

### Backend (`apps/backend`)
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Auth**: Passport.js (JWT)
- **Mail**: Nodemailer


## 💻 Local Development

### Prerequisites
- **Node.js** (v18+)
- **pnpm** (v8+)
- **PostgreSQL** (Running locally or via Docker)

### 1. Installation
Clone the repository and install dependencies from the root directory:

```bash
git clone https://github.com/riaz37/bookoro.git
cd bookoro
pnpm install
```

### 2. Environment Setup
Set up the environment variables for both applications:

**Backend (`apps/backend`)**
```bash
cp apps/backend/.env.example apps/backend/.env
# Update DATABASE_URL in apps/backend/.env to match your local Postgres setup
```

**Frontend (`apps/frontend`)**
```bash
cp apps/frontend/.env.local.example apps/frontend/.env.local
```

### 3. Database Setup
Initialize the database and seed it with sample data (flights, users):

```bash
cd apps/backend
npx prisma db push
npx prisma db seed
cd ../..
```

### 4. Running the App
Start both the frontend and backend concurrently from the root:

```bash
pnpm dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **API Docs (Swagger)**: [http://localhost:4000/api](http://localhost:4000/api)

## 📂 Project Structure

- `apps/backend`: NestJS API application.
- `apps/frontend`: Next.js web application.

