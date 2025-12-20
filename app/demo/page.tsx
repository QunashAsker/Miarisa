'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ArrowRight, Apple, Sliders, Thermometer, Droplet, Wind, Bug, CheckCircle2, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { calculateOrchardState, type SimulationResult } from '@/app/actions/simulation'

type Step = 'auth' | 'onboarding' | 'dashboard'

export default function DemoPage() {
  const [step, setStep] = useState<Step>('auth')
  const [password, setPassword] = useState('')
  const [selectedCrop, setSelectedCrop] = useState('Яблоня Гала')
  const [targetYield, setTargetYield] = useState(40)
  const [gdd, setGdd] = useState(0) // Накопленные градусо-дни (Base 5°C)
  const [temperature, setTemperature] = useState(22)
  const [leafWetness, setLeafWetness] = useState(8)
  const [windSpeed, setWindSpeed] = useState(2)
  const [codlingMothTraps, setCodlingMothTraps] = useState(0)
  
  // Состояние для результатов симуляции
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Расчет потребности в азоте (упрощенная формула)
  const nitrogenRequirement = Math.round(targetYield * 0.6)

  // Вызов серверного экшена при изменении параметров
  useEffect(() => {
    if (step === 'dashboard') {
      const fetchSimulation = async () => {
        setIsLoading(true)
        try {
          console.log('Вызов calculateOrchardState с параметрами:', { gdd, temperature, leafWetness, windSpeed, codlingMothTraps })
          const result = await calculateOrchardState({
            gdd,
            temperature,
            leafWetness,
            windSpeed,
            codlingMothTraps,
          })
          console.log('Получен результат от сервера:', result)
          if (result && result.phenoPhase) {
            setSimulationResult(result)
          } else {
            throw new Error('Неверный формат ответа от сервера')
          }
        } catch (error) {
          console.error('Ошибка расчета симуляции:', error)
          // Устанавливаем fallback результат при ошибке
          setSimulationResult({
            phenoPhase: {
              bbchCode: 0,
              stageNameRu: 'Ошибка загрузки',
              gddThreshold: 0,
              description: error instanceof Error ? error.message : 'Не удалось загрузить данные из БД',
            },
            diseaseRisk: {
              level: 'Низкий',
              reason: 'Не удалось рассчитать',
            },
            weatherWindow: {
              status: 'Открыто',
              reason: 'Не удалось рассчитать',
            },
            recommendations: [{
              type: 'warning',
              title: 'Ошибка',
              message: error instanceof Error ? `Ошибка: ${error.message}` : 'Не удалось загрузить данные из базы данных. Проверьте подключение.',
            }],
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      // Уменьшенный дебаунс для более быстрой реакции, особенно для GDD
      const timeoutId = setTimeout(fetchSimulation, 150)
      return () => clearTimeout(timeoutId)
    }
  }, [step, gdd, temperature, leafWetness, windSpeed, codlingMothTraps])

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('onboarding')
  }

  const handleOnboardingComplete = () => {
    setStep('dashboard')
  }

  // Получение стилей для риска болезней
  const getDiseaseRiskStyles = () => {
    if (!simulationResult) {
      return { level: 'Низкий', color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' }
    }
    const level = simulationResult.diseaseRisk.level
    if (level === 'Высокий') {
      return { level, color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' }
    }
    if (level === 'Средний') {
      return { level, color: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/30' }
    }
    return { level, color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' }
  }

  // Получение стилей для погодного окна
  const getWeatherWindowStyles = () => {
    if (!simulationResult) {
      return { status: 'Открыто', color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' }
    }
    const status = simulationResult.weatherWindow.status
    if (status === 'Закрыто') {
      return { status, color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' }
    }
    return { status, color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' }
  }

  const diseaseRisk = getDiseaseRiskStyles()
  const weatherWindow = getWeatherWindowStyles()

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {/* 1. Экран входа */}
        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="glassmorphism rounded-2xl p-8 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/90 max-w-md w-full"
            >
              <div className="flex justify-center mb-6">
                <Logo />
              </div>
              
              <h1 className="text-2xl font-bold text-primary text-center mb-2">
                Доступ к системе Miarisa Intelligence
              </h1>
              <p className="text-primary/60 text-center text-sm mb-8">
                Симулятор агрономических процессов
              </p>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                    Пароль доступа
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/40" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Введите пароль"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  className="w-full"
                >
                  Войти в систему
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* 2. Мастер настройки */}
        {step === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6 bg-black/20"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glassmorphism rounded-2xl p-8 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/90 max-w-2xl w-full"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">
                Инициализация Цифрового Двойника
              </h2>

              <div className="space-y-8">
                {/* Шаг 1: Выбор культуры */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                    Шаг 1: Выбор культуры
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Яблоня Гала', 'Груша', 'Вишня'].map((crop) => (
                      <motion.button
                        key={crop}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedCrop(crop)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedCrop === crop
                            ? 'border-primary bg-primary/5'
                            : 'border-primary/10 hover:border-primary/30'
                        }`}
                      >
                        <Apple className={`w-8 h-8 mx-auto mb-2 ${selectedCrop === crop ? 'text-primary' : 'text-primary/40'}`} />
                        <div className={`text-sm font-medium ${selectedCrop === crop ? 'text-primary' : 'text-primary/60'}`}>
                          {crop}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Шаг 2: Целевая урожайность */}
                <div>
                  <label className="block text-sm font-semibold text-primary mb-4 uppercase tracking-wider">
                    Шаг 2: Целевая урожайность
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary/60 text-sm">Урожайность</span>
                      <span className="text-xl font-bold text-primary">{targetYield} т/га</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="80"
                      value={targetYield}
                      onChange={(e) => setTargetYield(Number(e.target.value))}
                      className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-primary/40">
                      <span>20 т/га</span>
                      <span>80 т/га</span>
                    </div>
                    
                    <div className="mt-4 p-4 bg-accent-teal/5 border border-accent-teal/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary/70">Расчетная потребность в Азоте:</span>
                        <span className="text-lg font-bold text-accent-teal">{nitrogenRequirement} кг/га</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleOnboardingComplete}
                  variant="primary"
                  size="large"
                  className="w-full"
                >
                  Запустить симуляцию
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* 3. Дашборд Симулятора */}
        {step === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">Симулятор Miarisa Intelligence</h1>
                  <p className="text-primary/60">Цифровой двойник сада: {selectedCrop}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-accent-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary/60">Система активна</span>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Левая колонка: Панель управления */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glassmorphism rounded-2xl p-6 shadow-xl border border-white/30 backdrop-blur-xl bg-white/90"
                >
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary/10">
                    <Sliders className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">Параметры среды</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Слайдер 1: Накопленные GDD */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary/60" />
                          <label className="text-sm font-medium text-primary">Накопленные GDD (Base 5°C)</label>
                        </div>
                        <span className="text-sm font-bold text-primary">{gdd}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2500"
                        value={gdd}
                        onChange={(e) => setGdd(Number(e.target.value))}
                        className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-primary/40 mt-1">
                        <span>0</span>
                        <span>2500</span>
                      </div>
                      <p className="text-xs text-primary/50 mt-2">
                        Сумма активных температур с начала сезона (базовая температура 5°C)
                      </p>
                    </div>

                    {/* Слайдер 2: Температура */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-primary/60" />
                          <label className="text-sm font-medium text-primary">Температура воздуха</label>
                        </div>
                        <span className="text-sm font-bold text-primary">{temperature}°C</span>
                      </div>
                      <input
                        type="range"
                        min="-5"
                        max="35"
                        value={temperature}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-xs text-primary/40 mt-1">
                        <span>-5°C</span>
                        <span>+35°C</span>
                      </div>
                      <p className="text-xs text-primary/50 mt-2">
                        Используется для расчета риска болезней и эффективности препаратов
                      </p>
                    </div>

                    {/* Слайдер 3: Влажность листа */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-4 h-4 text-primary/60" />
                          <label className="text-sm font-medium text-primary">Влажность листа</label>
                        </div>
                        <span className={`text-sm font-bold ${leafWetness > 10 ? 'text-accent-red' : 'text-primary'}`}>
                          {leafWetness} ч
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="24"
                          value={leafWetness}
                          onChange={(e) => setLeafWetness(Number(e.target.value))}
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                          style={{
                            background: leafWetness > 10 
                              ? `linear-gradient(to right, #dc2626 0%, #dc2626 ${(leafWetness / 24) * 100}%, #e5e7eb ${(leafWetness / 24) * 100}%, #e5e7eb 100%)`
                              : undefined
                          }}
                        />
                        {leafWetness > 10 && (
                          <div className="absolute top-0 left-[41.67%] w-[8.33%] h-2 bg-accent-red/30 pointer-events-none"></div>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-primary/40 mt-1">
                        <span>0 ч</span>
                        <span className={leafWetness > 10 ? 'text-accent-red font-semibold' : ''}>10+ ч (риск)</span>
                        <span>24 ч</span>
                      </div>
                    </div>

                    {/* Слайдер 4: Скорость ветра */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4 text-primary/60" />
                          <label className="text-sm font-medium text-primary">Скорость ветра</label>
                        </div>
                        <span className={`text-sm font-bold ${windSpeed > 5 ? 'text-accent-red' : 'text-primary'}`}>
                          {windSpeed} м/с
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="15"
                          value={windSpeed}
                          onChange={(e) => setWindSpeed(Number(e.target.value))}
                          className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        {windSpeed > 5 && (
                          <div className="absolute top-0 left-[33.33%] w-[66.67%] h-2 bg-accent-red/30 pointer-events-none"></div>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-primary/40 mt-1">
                        <span>0 м/с</span>
                        <span className={windSpeed > 5 ? 'text-accent-red font-semibold' : ''}>5+ м/с (риск)</span>
                        <span>15 м/с</span>
                      </div>
                    </div>

                    {/* Инпут: Ловушка плодожорки */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Bug className="w-4 h-4 text-primary/60" />
                          <label className="text-sm font-medium text-primary">Ловушка плодожорки</label>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setCodlingMothTraps(Math.max(0, codlingMothTraps - 1))}
                          className="w-10 h-10 rounded-lg border border-primary/20 hover:border-primary/40 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                        >
                          −
                        </button>
                        <div className="flex-1 text-center py-2 px-4 bg-background-grey rounded-lg border border-primary/10">
                          <span className="text-2xl font-bold text-primary">{codlingMothTraps}</span>
                          <span className="text-xs text-primary/60 ml-2">шт/неделю</span>
                        </div>
                        <button
                          onClick={() => setCodlingMothTraps(codlingMothTraps + 1)}
                          className="w-10 h-10 rounded-lg border border-primary/20 hover:border-primary/40 flex items-center justify-center text-primary hover:bg-primary/5 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Правая колонка: Результат */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Верхний блок: Статус сада */}
                  <div className="glassmorphism rounded-2xl p-6 shadow-xl border border-white/30 backdrop-blur-xl bg-white/90">
                    <h2 className="text-lg font-semibold text-primary mb-4">Статус сада</h2>
                    {isLoading ? (
                      <div className="text-center py-4 text-primary/60">Расчет...</div>
                    ) : simulationResult ? (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-background-grey rounded-lg border border-primary/5">
                          <div className="text-xs text-primary/60 mb-1">Фенофаза</div>
                          <div className="text-sm font-semibold text-primary">
                            {simulationResult.phenoPhase.stageNameRu}
                          </div>
                          <div className="text-xs text-primary/50 mt-1">
                            BBCH {simulationResult.phenoPhase.bbchCode} • GDD ≥ {simulationResult.phenoPhase.gddThreshold}
                          </div>
                        </div>
                        <div className={`p-3 rounded-lg border ${diseaseRisk.bg} ${diseaseRisk.border}`}>
                          <div className="text-xs text-primary/60 mb-1">Риск болезней</div>
                          <div className={`text-sm font-semibold ${diseaseRisk.color}`}>{diseaseRisk.level}</div>
                        </div>
                        <div className={`p-3 rounded-lg border ${weatherWindow.bg} ${weatherWindow.border}`}>
                          <div className="text-xs text-primary/60 mb-1">Погодное окно</div>
                          <div className={`text-sm font-semibold ${weatherWindow.color}`}>{weatherWindow.status}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-primary/60 mb-2">Инициализация...</div>
                        <div className="text-xs text-primary/40">Загрузка данных из базы</div>
                      </div>
                    )}
                  </div>

                  {/* Центральный блок: Техкарта */}
                  <div className="glassmorphism rounded-2xl p-6 shadow-xl border border-white/30 backdrop-blur-xl bg-white/90">
                    <h2 className="text-lg font-semibold text-primary mb-4">Техкарта</h2>
                    {isLoading ? (
                      <div className="text-center py-8 text-primary/60">Расчет рекомендаций...</div>
                    ) : simulationResult && simulationResult.recommendations.length > 0 ? (
                      <div className="space-y-3">
                        {simulationResult.recommendations.map((rec, index) => {
                          const Icon = rec.type === 'critical' ? AlertTriangle : rec.type === 'warning' ? XCircle : CheckCircle2
                          const bgColor = rec.type === 'critical' ? 'bg-accent-red/10 border-accent-red/30' 
                            : rec.type === 'warning' ? 'bg-accent-amber/10 border-accent-amber/30'
                            : 'bg-accent-green/10 border-accent-green/30'
                          const textColor = rec.type === 'critical' ? 'text-accent-red'
                            : rec.type === 'warning' ? 'text-accent-amber'
                            : 'text-accent-green'
                          
                          return (
                            <div key={index} className={`p-4 ${bgColor} border rounded-lg`}>
                              <div className="flex items-start gap-3">
                                <Icon className={`w-5 h-5 ${textColor} mt-0.5`} />
                                <div className="flex-1">
                                  <div className={`font-semibold ${textColor} mb-1`}>{rec.title}</div>
                                  <div className="text-sm text-primary/70">{rec.message}</div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-accent-green mx-auto mb-3" />
                        <div className="text-lg font-semibold text-primary mb-1">Мониторинг</div>
                        <div className="text-sm text-primary/60">Задач нет. Система работает в штатном режиме.</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
