# Bookoro ✈️

A modern, full-stack flight booking application built with **NestJS**, **Next.js**, **Prisma**, and **TailwindCSS**.

## 🚀 Features

- **Flight Search**: Search for flights with advanced filters (destination, price, date).
- **Booking System**: Real-time seat availability, booking management, and cancellations.
- **Modern UI**: Responsive, glassmorphic design with smooth animations.
- **Authentication**: Secure JWT-based auth with email verification (OTP).
- **Email Notifications**: Booking confirmations and verification emails.

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

## 🐳 Docker Setup (Recommended)

Run the entire application (Frontend + Backend + Database) with a single command:

1.  **Configure Environment**:
    Copy the example env file and defaults usually work out-of-the-box for specialized docker-compose setup.
    ```bash
    cp .env.example .env
    ```

2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```

3.  **Access App**:
    - **Frontend**: [http://localhost:3000](http://localhost:3000)
    - **Backend API**: [http://localhost:4000](http://localhost:4000)
    - **Swagger Docs**: [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

## 💻 Local Development

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Start Database**:
    Ensure you have a Postgres instance running (or use the one from docker-compose).

3.  **Start Backend**:
    ```bash
    cd apps/backend
    npx prisma generate
    npx prisma migrate dev
    pnpm dev
    ```

4.  **Start Frontend**:
    ```bash
    cd apps/frontend
    pnpm dev
    ```

## 📂 Project Structure

- `apps/backend`: NestJS API application.
- `apps/frontend`: Next.js web application.
- `docker-compose.yml`: Orchestration for local deployment.
