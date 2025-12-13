'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plane, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import { useWakeUpBackend } from '@/hooks/useWakeUpBackend';

export default function Home() {
  const router = useRouter();

  // Wake up the backend server on page load (for Render free tier)
  useWakeUpBackend();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-50">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-[800px] w-[800px] rounded-full bg-indigo-500/5 blur-3xl" />

        <header className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
                <Plane className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">Bookoro</span>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/login')}>Log In</Button>
              <Button onClick={() => router.push('/signup')}>Sign Up</Button>
            </div>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl"
            >
              Discover the World with <span className="text-gradient">Bookoro</span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-600"
            >
              Experience seamless flight booking with our premium service.
              Find the best deals, manage your trips, and fly with confidence.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="mt-10 flex justify-center gap-4"
            >
              <Button size="lg" className="rounded-full px-8 text-lg" onClick={() => router.push('/flights')}>
                Book a Flight <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">
                View Deals
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 text-lg text-slate-600">We make your journey as comfortable as your destination.</p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Plane className="h-8 w-8 text-white" />,
                title: 'Global Coverage',
                description: 'Access flights to over 2,000 destinations worldwide with our extensive airline network.'
              },
              {
                icon: <Calendar className="h-8 w-8 text-white" />,
                title: 'Easy Scheduling',
                description: 'Flexible booking options and instant confirmations to keep your plans on track.'
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-white" />,
                title: 'Secure Booking',
                description: 'Your data and payments are protected with enterprise-grade security standards.'
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200 transition-transform group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-4 text-slate-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-slate-500">
          <p>&copy; 2024 Bookoro Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
