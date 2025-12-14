'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DashboardMockup from '@/components/ui/DashboardMockup'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative pt-32 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Интерактивное демо платформы
            </h1>
            <p className="text-xl text-primary/70">
              Симуляция работы платформы Miarisa в режиме реального времени
            </p>
          </motion.div>

          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
