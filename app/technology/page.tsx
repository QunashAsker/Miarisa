'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { 
  TrendingUp, 
  Calculator, 
  Brain, 
  Zap,
  Smartphone,
  Wifi,
  BarChart3
} from 'lucide-react'

export default function TechnologyPage() {
  // Mock GDD data for visualization
  const gddData = [
    { day: 'Day 1', value: 12 },
    { day: 'Day 2', value: 15 },
    { day: 'Day 3', value: 18 },
    { day: 'Day 4', value: 22 },
    { day: 'Day 5', value: 25 },
    { day: 'Day 6', value: 28 },
    { day: 'Day 7', value: 30 },
  ]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Точная наука, реальные результаты
            </h1>
            <p className="text-xl text-primary/70 max-w-3xl mx-auto">
              Основано на проверенных биологических моделях. Не магия — математика.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Science Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-primary">Биологические модели</h2>
              </div>
              <p className="text-lg text-primary/70 mb-6 leading-relaxed">
                Miarisa использует десятилетия агрономических исследований, включая таблицу Миллса для прогнозирования парши яблони и модели градусо-дней роста (GDD) для фенологического отслеживания.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-teal rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Интеграция таблицы Миллса</h4>
                    <p className="text-primary/70 text-sm">
                      Рассчитывает риск заражения паршой на основе температуры и продолжительности увлажнения листьев. Обновляется в реальном времени при изменении условий.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-teal rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Накопление GDD</h4>
                    <p className="text-primary/70 text-sm">
                      Отслеживает накопление тепла для точного прогнозирования распускания почек, цветения и сроков сбора урожая.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent-teal rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Континуум почва-растение-атмосфера</h4>
                    <p className="text-primary/70 text-sm">
                      Моделирует движение воды от почвы через растение в атмосферу для оптимального планирования орошения.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Graph Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-8"
            >
              <h3 className="text-xl font-bold text-primary mb-6">Накопление GDD (7 дней)</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {gddData.map((item, index) => (
                  <motion.div
                    key={item.day}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${(item.value / 30) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="flex-1 bg-gradient-to-t from-accent-teal to-primary rounded-t flex flex-col items-center justify-end pb-2"
                  >
                    <span className="text-xs text-white font-medium mb-1">{item.value}</span>
                    <div className="w-full bg-white/20 h-full rounded-t"></div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-sm text-primary/60">
                {gddData.map((item) => (
                  <span key={item.day} className="text-xs">{item.day}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calculator className="w-10 h-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold text-primary">
                Калькулятор ROI
              </h2>
            </div>
            <p className="text-xl text-primary/70 max-w-2xl mx-auto">
              Цифры говорят сами за себя. Увидьте, как окупается точность.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Savings Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-8 border-2 border-accent-green/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-accent-green/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-accent-green" />
                </div>
                <span className="text-4xl font-bold text-accent-green">20%</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Экономия на химикатах</h3>
              <p className="text-primary/70 leading-relaxed">
                Точное дозирование устраняет отходы. Применяйте ровно столько, сколько нужно, когда нужно. Больше никаких избыточных опрыскиваний по календарю.
              </p>
              <div className="mt-6 pt-6 border-t border-background-grey">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary/60">Средняя экономия на гектар:</span>
                  <span className="font-bold text-primary">€450/год</span>
                </div>
              </div>
            </motion.div>

            {/* Yield Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glassmorphism rounded-xl p-8 border-2 border-accent-teal/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-accent-teal/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-accent-teal" />
                </div>
                <span className="text-4xl font-bold text-accent-teal">15%</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-3">Увеличение урожая класса 1</h3>
              <p className="text-primary/70 leading-relaxed">
                Лучший контроль болезней благодаря своевременным вмешательствам. Больше премиальных фруктов означает более высокие рыночные цены и лучшую маржу.
              </p>
              <div className="mt-6 pt-6 border-t border-background-grey">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary/60">Дополнительный доход на гектар:</span>
                  <span className="font-bold text-primary">€1,200/год</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Total ROI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-xl p-8 bg-gradient-to-br from-primary/5 to-accent-teal/5 border-2 border-primary/20"
          >
            <div className="text-center">
              <p className="text-lg text-primary/70 mb-4">Общая годовая выгода на гектар</p>
              <p className="text-6xl font-bold text-primary mb-6">€1,650</p>
              <p className="text-primary/60 mb-8">
                На основе среднего сада в 50 гектар: <span className="font-bold text-primary">€82,500/год</span>
              </p>
              <Button variant="primary" size="large">
                Рассчитать ваш ROI
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Ecosystem */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Экосистема интеграций
            </h2>
            <p className="text-xl text-primary/70 max-w-2xl mx-auto">
              Работает с оборудованием, которое у вас уже есть — или выберите из наших рекомендованных партнеров
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Compatible Sensors */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wifi className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Совместимые датчики</h3>
              <p className="text-primary/70 mb-6">
                Метеостанции, почвенные зонды, датчики влажности листьев. Мы поддерживаем отраслевые стандартные протоколы.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">LoRaWAN</span>
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">Modbus</span>
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">MQTT</span>
              </div>
            </motion.div>

            {/* Scouting App */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="glassmorphism rounded-xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-accent-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-accent-teal" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Приложение для разведки</h3>
              <p className="text-primary/70 mb-6">
                Мобильное приложение для полевых наблюдений. Фото, GPS-координаты и идентификация болезней синхронизируются автоматически.
              </p>
              <div className="bg-background-grey rounded-lg p-4 h-32 flex items-center justify-center">
                <div className="text-center">
                  <Smartphone className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                  <p className="text-xs text-primary/50">Мобильный вид</p>
                </div>
              </div>
            </motion.div>

            {/* API Access */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="glassmorphism rounded-xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-accent-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-accent-green" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">Доступ к API</h3>
              <p className="text-primary/70 mb-6">
                Интегрируйтесь с вашими существующими системами управления фермой. RESTful API с подробной документацией.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">REST API</span>
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">Webhooks</span>
                <span className="px-3 py-1 bg-background-grey rounded-full text-sm">JSON</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

