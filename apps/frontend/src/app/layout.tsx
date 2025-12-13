import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookoro | Modern Flight Booking",
  description: "Book flights seamlessly with Bookoro. Experience real-time availability, secure payments, and instant confirmations. Your journey starts here.",
  keywords: ["flight booking", "travel", "airline tickets", "vacation", "bookoro"],
  icons: {
    icon: "/favicon.ico",
  },
};

import { AuthProvider } from '@/context/AuthContext';

import QueryProvider from '@/providers/QueryProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <AuthProvider>
          <QueryProvider>
            <Toaster position="top-center" />
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
