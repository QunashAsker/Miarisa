'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, TreePine, Play, Loader2, Satellite, Cpu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Button from './Button'

interface DemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<'farmers' | 'demo' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: ''
  })

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    setSelectedMode(null)
    setIsLoading(false)
    setLoadingStep(0)
    setFormData({ name: '', email: '', area: '' })
    onClose()
  }

  const loadingSteps = [
    'Инициализация моделей GDD...',
    'Загрузка спутниковых карт...',
    'Подключение к датчикам IoT...',
    'Готово!'
  ]

  const handleFarmersClick = () => {
    setSelectedMode('farmers')
  }

  const handleDemoClick = () => {
    setSelectedMode('demo')
    setIsLoading(true)
    setLoadingStep(0)

    // Симуляция загрузки с переключением шагов
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            router.push('/dashboard')
            setIsLoading(false)
            handleClose()
          }, 500)
          return prev
        }
        return prev + 1
      })
    }, 1500)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика отправки формы
    console.log('Form submitted:', formData)
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.')
    handleClose()
  }

  const handleBack = () => {
    setSelectedMode(null)
    setIsLoading(false)
    setLoadingStep(0)
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            style={{ paddingTop: 'max(4rem, env(safe-area-inset-top) + 2rem)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[calc(100vh-4rem)] my-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-primary">
                  {selectedMode === null ? 'Выберите режим доступа' : selectedMode === 'farmers' ? 'Внедрить в моем саду' : 'Запуск симуляции'}
                </h2>
                {selectedMode === null && (
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-background-grey rounded-lg transition-colors"
                    aria-label="Закрыть"
                  >
                    <X className="w-5 h-5 text-primary" />
                  </button>
                )}
                {selectedMode !== null && (
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm text-primary hover:bg-background-grey rounded-lg transition-colors"
                  >
                    Назад
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {selectedMode === null && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Card 1: Для владельцев садов */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={handleFarmersClick}
                      className="cursor-pointer group"
                    >
                      <div className="p-6 rounded-xl border-2 border-slate-200 hover:border-accent-teal transition-all duration-200 hover:shadow-lg h-full">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                          <TreePine className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-primary mb-2">
                          Внедрить в моем саду
                        </h3>
                        <p className="text-primary/70 leading-relaxed">
                          Получить аудит, расчет стоимости и персональную настройку профиля поля.
                        </p>
                      </div>
                    </motion.div>

                    {/* Card 2: Интерактивное демо */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={handleDemoClick}
                      className="cursor-pointer group"
                    >
                      <div className="p-6 rounded-xl border-2 border-accent-teal bg-accent-teal/5 hover:bg-accent-teal/10 transition-all duration-200 hover:shadow-lg h-full relative overflow-hidden">
                        {/* Accent decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                        <div className="relative">
                          <div className="w-16 h-16 bg-accent-teal/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-teal/30 transition-colors">
                            <Play className="w-8 h-8 text-accent-teal" />
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-2">
                            Запустить симуляцию
                          </h3>
                          <p className="text-primary/70 leading-relaxed">
                            Посмотреть интерфейс платформы в режиме реального времени. Без регистрации.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Form for Farmers */}
                {selectedMode === 'farmers' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                  >
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                          Имя
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                          placeholder="Ваше имя"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="area" className="block text-sm font-medium text-primary mb-2">
                          Площадь сада (га)
                        </label>
                        <input
                          type="number"
                          id="area"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          required
                          min="0"
                          step="0.1"
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent transition-all font-mono"
                          placeholder="0.0"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        className="w-full"
                      >
                        Связаться с отделом внедрения
                      </Button>
                    </form>
                  </motion.div>
                )}

                {/* Loading Animation for Demo */}
                {selectedMode === 'demo' && isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-md mx-auto text-center py-12"
                  >
                    <div className="mb-6">
                      <Loader2 className="w-16 h-16 text-accent-teal animate-spin mx-auto mb-4" />
                      <motion.p
                        key={loadingStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-medium text-primary mb-2"
                      >
                        {loadingSteps[loadingStep]}
                      </motion.p>
                      <div className="flex items-center justify-center gap-2 mt-4">
                        {loadingStep === 0 && <Satellite className="w-5 h-5 text-accent-teal animate-pulse" />}
                        {loadingStep === 1 && <Satellite className="w-5 h-5 text-accent-teal" />}
                        {loadingStep === 2 && <Cpu className="w-5 h-5 text-accent-teal animate-pulse" />}
                        {loadingStep === 3 && <div className="w-5 h-5 bg-accent-green rounded-full"></div>}
                      </div>
                    </div>
                    <div className="w-full bg-background-grey rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-accent-teal rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render outside nav hierarchy
  if (!mounted) return null
  
  return createPortal(modalContent, document.body)
}
