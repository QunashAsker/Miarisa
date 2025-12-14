'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import PolygonApple from '@/components/ui/PolygonApple'
import DashboardMockup from '@/components/ui/DashboardMockup'
import DemoModal from '@/components/ui/DemoModal'
import { ArrowRight, Cpu, Database, Target, Play } from 'lucide-react'

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 bg-accent-teal/10 text-accent-teal rounded-full text-sm font-medium border border-accent-teal/20">
                  Платформа Точной Агрономии
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="text-[#00897b]">МРТ-сканер</span>
                <br />
                <span className="text-[#1a365d]">для современных садов</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-primary/70 mb-10 leading-relaxed max-w-2xl"
              >
                Превращаем хаос в точность. Miarisa заменяет статичные календари фермерства динамической аналитикой с ИИ-рекомендациями.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button variant="primary" size="large" className="group" onClick={() => setDemoModalOpen(true)}>
                  Запросить демо
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="large" className="group" onClick={() => setDemoModalOpen(true)}>
                  <Play className="inline-block mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Смотреть демо
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 flex flex-wrap gap-6 text-sm text-primary/60"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-green rounded-full"></div>
                  <span>Медицинская точность</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-teal rounded-full"></div>
                  <span>Аналитика ИИ в реальном времени</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Доказанная окупаемость</span>
                </div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative flex items-center justify-center"
            >
              {/* Polygon Apple - Desktop */}
              <div className="hidden lg:block absolute inset-0 flex items-center justify-center opacity-20">
                <PolygonApple size={500} />
              </div>
              
              {/* Dashboard Mockup */}
              <div className="relative z-10 w-full max-w-lg">
                <DashboardMockup />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* The "Why" Section */}
      <section id="why" className="py-24 px-6 bg-white relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent-teal/3 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                Наука точности
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Как это работает
            </h2>
            <p className="text-xl md:text-2xl text-primary/70 max-w-3xl mx-auto leading-relaxed">
              От сырых данных до действенных рекомендаций в три простых шага
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Card 1: Input */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glassmorphism rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-white/30 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors"
              >
                <Database className="w-10 h-10 text-primary" />
              </motion.div>
              <div className="mb-3">
                <span className="text-sm font-semibold text-accent-teal uppercase tracking-wider">Шаг 01</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">Входные данные</h3>
              <p className="text-primary/70 leading-relaxed text-lg">
                IoT-датчики и данные почвы. Непрерывный мониторинг влажности почвы, температуры, влажности листьев и комплексный анализ почвы.
              </p>
            </motion.div>
            
            {/* Card 2: Process */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glassmorphism rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-white/30 group relative"
            >
              {/* Highlight badge */}
              <div className="absolute -top-4 right-6 px-3 py-1 bg-accent-teal text-white rounded-full text-xs font-semibold">
                Основа
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-20 h-20 bg-accent-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-teal/20 transition-colors"
              >
                <Cpu className="w-10 h-10 text-accent-teal" />
              </motion.div>
              <div className="mb-3">
                <span className="text-sm font-semibold text-accent-teal uppercase tracking-wider">Шаг 02</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">Обработка</h3>
              <p className="text-primary/70 leading-relaxed text-lg">
                Биологические модели (GDD, риск парши). Алгоритмы на базе ИИ обрабатывают данные через проверенные агрономические модели, такие как таблица Миллса и градусо-дни роста.
              </p>
            </motion.div>
            
            {/* Card 3: Output */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glassmorphism rounded-2xl p-8 lg:p-10 hover:shadow-2xl transition-all duration-300 border border-white/30 group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-20 h-20 bg-accent-green/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-green/20 transition-colors"
              >
                <Target className="w-10 h-10 text-accent-green" />
              </motion.div>
              <div className="mb-3">
                <span className="text-sm font-semibold text-accent-teal uppercase tracking-wider">Шаг 03</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">Результат</h3>
              <p className="text-primary/70 leading-relaxed text-lg">
                Динамическая технологическая карта. Ежедневные рекомендации, которые точно говорят фермерам ЧТО опрыскивать, КОГДА опрыскивать и СКОЛЬКО воды использовать.
              </p>
            </motion.div>
          </div>

          {/* Connecting line visualization */}
          <div className="hidden md:flex items-center justify-center mt-12 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-accent-teal"></div>
              <div className="w-3 h-3 bg-accent-teal rounded-full"></div>
              <div className="w-16 h-0.5 bg-accent-teal"></div>
              <div className="w-3 h-3 bg-accent-teal rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-accent-teal"></div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />

      {/* Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </main>
  )
}

