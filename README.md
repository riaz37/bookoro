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


## 💻 Local Development

1.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

2.  **Start Database**:
    Ensure you have a Postgres instance running.

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

