'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import DemoModal from '@/components/ui/DemoModal'
import { ArrowRight, Cpu, Database, Target, Play, ChevronDown, Leaf, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  
  const { scrollYProgress } = useScroll()

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Обработка загрузки видео
  useEffect(() => {
    const video = videoRef.current
    if (!video || isMobile) {
      setIsVideoLoading(false)
      return
    }

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const duration = video.duration
        if (duration > 0) {
          setLoadProgress((bufferedEnd / duration) * 100)
        }
      }
    }

    const handleCanPlayThrough = () => {
      setIsVideoLoading(false)
      setIsVideoReady(true)
      setLoadProgress(100)
    }

    const handleLoadedMetadata = () => {
      video.currentTime = 0
    }

    video.addEventListener('progress', handleProgress)
    video.addEventListener('canplaythrough', handleCanPlayThrough)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    video.load()

    // Таймаут на случай медленной загрузки
    const timeout = setTimeout(() => {
      setIsVideoLoading(false)
    }, 10000)

    return () => {
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('canplaythrough', handleCanPlayThrough)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      clearTimeout(timeout)
    }
  }, [isMobile])

  // Управление видео скроллом
  const handleScroll = useCallback(() => {
    const video = videoRef.current
    const container = containerRef.current
    
    if (!video || !container || !isVideoReady || isMobile) return

    const containerHeight = container.offsetHeight
    const windowHeight = window.innerHeight
    const scrollY = window.scrollY

    // Прогресс скролла по всей высоте контейнера
    const maxScroll = containerHeight - windowHeight
    let progress = scrollY / maxScroll
    progress = Math.max(0, Math.min(1, progress))

    // Целевое время видео
    const targetTime = progress * (video.duration || 0)

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(() => {
      if (video && isFinite(targetTime) && !isNaN(targetTime)) {
        const currentTime = video.currentTime
        const diff = targetTime - currentTime
        const smoothFactor = 0.12
        video.currentTime = currentTime + diff * smoothFactor
      }
    })
  }, [isVideoReady, isMobile])

  useEffect(() => {
    if (isMobile) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleScroll, isMobile])

  // Анимация для секций
  const sectionVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <main className="bg-transparent">
      <Navbar />
      
      {/* Контейнер со scroll-controlled видео */}
      <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
        
        {/* Фиксированный видео фон */}
        <div className="fixed inset-0 w-full h-screen overflow-hidden z-0">
          {/* Индикатор загрузки */}
          {isVideoLoading && !isMobile && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: isVideoLoading ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1a365d]"
            >
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-white/20 border-t-[#00897b] rounded-full"
                />
              </div>
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00897b] to-[#00897b]/70 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="mt-4 text-white/70 text-sm font-medium">
                Загрузка видео... {Math.round(loadProgress)}%
              </p>
            </motion.div>
          )}

          {/* Видео для десктопа */}
          {!isMobile && (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/hero-video.mp4"
              muted
              playsInline
              preload="auto"
            />
          )}

          {/* Статичное изображение для мобильных */}
          {isMobile && (
            <div 
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-[#1a365d]"
              style={{ 
                backgroundImage: `linear-gradient(to bottom, rgba(26, 54, 93, 0.7), rgba(26, 54, 93, 0.9)), url('/logo.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}

          {/* Затемняющий градиент для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/50 via-transparent to-[#1a365d]/60" />
        </div>

        {/* Секция 1: Hero */}
        <section className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={sectionVariants}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-medium border border-white/20">
                🌱 Платформа Точной Агрономии
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="text-[#00897b] drop-shadow-lg">МРТ-сканер</span>
              <br />
              <span className="text-white drop-shadow-lg">для современных садов</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Превращаем хаос в точность. Miarisa заменяет статичные календари 
              фермерства динамической аналитикой с ИИ-рекомендациями.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="primary" size="large" className="group" onClick={() => setDemoModalOpen(true)}>
                Запросить демо
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="large" className="group border-white/30 text-white hover:bg-white/10" onClick={() => setDemoModalOpen(true)}>
                <Play className="inline-block mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Смотреть демо
              </Button>
            </motion.div>

            {/* Индикатор скролла */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center text-white/60"
              >
                <span className="text-xs mb-2 uppercase tracking-widest">Скролл</span>
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Секция 2: Проблема */}
        <section className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={sectionVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="glassmorphism rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-red/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <span className="text-accent-red font-semibold uppercase tracking-wider text-sm">Проблема</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Традиционные методы устарели
              </h2>
              
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Фермеры теряют до <span className="text-[#00897b] font-bold">30% урожая</span> из-за 
                неточных прогнозов, устаревших календарей и реактивного подхода к защите растений. 
                Каждый день промедления — это потерянные деньги.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-accent-red mb-2">30%</div>
                  <div className="text-white/60 text-sm">Потери урожая</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-accent-amber mb-2">40%</div>
                  <div className="text-white/60 text-sm">Перерасход химии</div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-3xl font-bold text-white mb-2">∞</div>
                  <div className="text-white/60 text-sm">Упущенных возможностей</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Секция 3: Решение */}
        <section className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={sectionVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="glassmorphism rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#00897b]/20 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-[#00897b]" />
                </div>
                <span className="text-[#00897b] font-semibold uppercase tracking-wider text-sm">Решение</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Miarisa Intelligence
              </h2>
              
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Интеллектуальная платформа, которая анализирует данные в реальном времени 
                и даёт <span className="text-[#00897b] font-bold">точные рекомендации</span> — 
                что опрыскивать, когда и в каком количестве.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Database className="w-8 h-8 text-[#00897b]" />
                  <div>
                    <div className="font-semibold text-white">IoT Сенсоры</div>
                    <div className="text-white/60 text-sm">Непрерывный мониторинг 24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Cpu className="w-8 h-8 text-[#00897b]" />
                  <div>
                    <div className="font-semibold text-white">ИИ Аналитика</div>
                    <div className="text-white/60 text-sm">Прогнозирование рисков болезней</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Target className="w-8 h-8 text-[#00897b]" />
                  <div>
                    <div className="font-semibold text-white">Точные рекомендации</div>
                    <div className="text-white/60 text-sm">Динамическая техкарта каждый день</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Секция 4: Результаты */}
        <section className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={sectionVariants}
            className="max-w-4xl mx-auto"
          >
            <div className="glassmorphism rounded-3xl p-8 md:p-12 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent-green/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent-green" />
                </div>
                <span className="text-accent-green font-semibold uppercase tracking-wider text-sm">Результаты</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Доказанная эффективность
              </h2>
              
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                Наши клиенты видят измеримые результаты уже в первый сезон использования платформы.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-[#00897b]/20 to-transparent rounded-2xl border border-[#00897b]/30">
                  <div className="text-5xl font-bold text-[#00897b] mb-2">+25%</div>
                  <div className="text-white font-semibold mb-1">Рост урожайности</div>
                  <div className="text-white/60 text-sm">За счет оптимального времени обработки</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-accent-green/20 to-transparent rounded-2xl border border-accent-green/30">
                  <div className="text-5xl font-bold text-accent-green mb-2">-35%</div>
                  <div className="text-white font-semibold mb-1">Снижение затрат</div>
                  <div className="text-white/60 text-sm">На химические препараты</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/20">
                  <div className="text-5xl font-bold text-white mb-2">3x</div>
                  <div className="text-white font-semibold mb-1">ROI</div>
                  <div className="text-white/60 text-sm">Окупаемость в первый год</div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/20">
                  <div className="text-5xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white font-semibold mb-1">Мониторинг</div>
                  <div className="text-white/60 text-sm">Непрерывный контроль сада</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Секция 5: CTA */}
        <section className="sticky top-0 h-screen flex items-center justify-center px-6 z-10 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.5 }}
            variants={sectionVariants}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="glassmorphism rounded-3xl p-8 md:p-16 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <div className="w-20 h-20 bg-[#00897b]/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-[#00897b]" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Готовы к трансформации?
              </h2>
              
              <p className="text-xl text-white/70 leading-relaxed mb-10">
                Присоединяйтесь к инновационным хозяйствам, которые уже 
                используют силу ИИ для защиты своих садов.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="primary" 
                  size="large" 
                  className="group text-lg px-10 py-4"
                  onClick={() => setDemoModalOpen(true)}
                >
                  Начать бесплатно
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <p className="mt-6 text-white/50 text-sm">
                Без кредитной карты • 14 дней бесплатно • Отмена в любое время
              </p>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Обычный контент после видео-секций */}
      <div className="relative z-10 bg-white">
        {/* The "Why" Section */}
        <section id="why" className="py-24 px-6 relative">
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
      </div>

      {/* Demo Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} />
    </main>
  )
}
