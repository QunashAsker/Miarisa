'use client'

import { motion } from 'framer-motion'
import { Wind, Droplet, Thermometer, AlertTriangle, CheckCircle2, Clock, FileText, Sprout, Calendar } from 'lucide-react'

// Helper component for sparkline chart
function Sparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Circular progress indicator for risk radar
function CircularRiskIndicator({ value, size = 80 }: { value: number, size?: number }) {
  const radius = size / 2 - 4
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-primary/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-accent-red transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-accent-red font-mono">{value}%</span>
      </div>
    </div>
  )
}

// Pre-defined irregular polygon shapes for the map
const POLYGON_SHAPES = [
  "50,20 70,25 75,45 65,60 45,65 25,55 20,35 30,25",
  "120,30 140,35 145,50 135,70 115,75 95,65 90,45 100,30",
  "200,25 220,30 225,55 215,75 195,80 175,70 170,50 185,30",
  "280,35 300,40 305,60 295,80 275,85 255,75 250,55 265,40",
  "60,100 80,105 85,125 75,145 55,150 35,140 30,120 45,105",
  "150,110 170,115 175,135 165,155 145,160 125,150 120,130 135,115",
  "240,105 260,110 265,130 255,150 235,155 215,145 210,125 225,110",
  "320,100 340,105 345,125 335,145 315,150 295,140 290,120 305,105",
]

export default function DashboardMockup() {
  // Generate irregular polygon shapes for the map
  const polygons = [
    { color: '#1a365d', path: POLYGON_SHAPES[0], delay: 0.5 },
    { color: '#00897b', path: POLYGON_SHAPES[1], delay: 0.6 },
    { color: '#00897b', path: POLYGON_SHAPES[2], delay: 0.7 },
    { color: '#dc2626', path: POLYGON_SHAPES[3], delay: 0.8 },
    { color: '#1a365d', path: POLYGON_SHAPES[4], delay: 0.9 },
    { color: '#00897b', path: POLYGON_SHAPES[5], delay: 1.0 },
    { color: '#1a365d', path: POLYGON_SHAPES[6], delay: 1.1 },
    { color: '#dc2626', path: POLYGON_SHAPES[7], delay: 1.2 },
  ]

  // Sparkline data
  const windData = [2.1, 2.3, 2.0, 1.8, 1.9, 2.2, 2.1, 2.0, 1.9, 2.0, 1.8, 1.9]
  const deltaTData = [3.2, 3.5, 3.8, 4.1, 4.0, 3.9, 4.2, 4.0, 3.8, 3.9, 4.0, 4.1]
  const gddData = [220, 225, 230, 235, 240, 242, 245, 245, 245, 245, 245, 245]

  // Tech card tasks
  const techTasks = [
    {
      id: 1,
      type: 'Защита',
      name: 'Скор + Делан',
      priority: 'Высокий',
      status: 'pending',
      time: null
    },
    {
      id: 2,
      type: 'Фертигация',
      name: 'Кальциевая селитра',
      priority: 'Средний',
      status: 'scheduled',
      time: '21:00'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative"
    >
      {/* Main Dashboard Container */}
      <div className="glassmorphism rounded-2xl p-6 shadow-2xl border border-white/30 backdrop-blur-xl bg-white/90">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-accent-teal rounded-full animate-pulse"></div>
            <h3 className="text-sm font-semibold text-primary">Обзор сада</h3>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 bg-accent-green rounded-full"></div>
            <div className="h-2 w-2 bg-accent-amber rounded-full"></div>
            <div className="h-2 w-2 bg-accent-red rounded-full"></div>
          </div>
        </div>

        {/* Top Row: Map + Operational Window */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">
          {/* Map - Takes 2 columns */}
          <div className="lg:col-span-2">
          <div className="relative rounded-lg p-4 border border-primary/10 overflow-hidden" style={{ 
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #2d3748 100%)',
            minHeight: '200px'
          }}>
            {/* Satellite texture overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 1px, transparent 1px),
                radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 2px, transparent 2px)
              `,
              backgroundSize: '40px 40px, 60px 60px, 80px 80px'
            }} />
            
            {/* Irregular orchard polygons */}
            <svg className="w-full h-full absolute inset-0" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
              {polygons.map((poly, i) => (
                <motion.polygon
                  key={i}
                  points={poly.path}
                  fill={poly.color}
                  fillOpacity="0.4"
                  stroke={poly.color}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: poly.delay, duration: 0.4 }}
                />
              ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-2 left-2 flex gap-3 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded" style={{ backgroundColor: '#1a365d' }}></div>
                <span className="text-white/80">Здоровый</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded" style={{ backgroundColor: '#00897b' }}></div>
                <span className="text-white/80">Активный</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-white/80">Критично</span>
              </div>
            </div>
          </div>
        </div>

          {/* Operational Window - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-background-grey rounded-lg p-4 border border-primary/10"
          >
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-primary/5">
              <Wind className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Операционное окно</span>
            </div>
            
            {/* Main Status Badge */}
            <div className="mb-4">
              <div className="px-4 py-3 bg-accent-green/20 border border-accent-green/40 rounded-lg text-center">
                <div className="text-2xl mb-1">🟢</div>
                <div className="text-sm font-bold text-accent-green">Работа разрешена</div>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-primary/60">Скорость ветра</span>
                <span className="font-mono font-semibold text-primary">1.9 м/с</span>
              </div>
              <div className="h-8 mb-1 relative">
                <Sparkline data={windData} color="#00897b" />
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 border-t border-primary/5">
                <span className="text-primary/60">Delta T</span>
                <span className="font-mono font-semibold text-primary">4.1°C</span>
              </div>
              <div className="h-8 mb-1 relative">
                <Sparkline data={deltaTData} color="#d97706" />
              </div>
              
              <div className="flex items-center justify-between text-xs pt-2 border-t border-primary/5">
                <span className="text-primary/60">Влажность листа</span>
                <span className="font-mono font-semibold text-accent-teal">Сухо</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Row: Risk Radar + Tech Card */}
        <div className="grid lg:grid-cols-3 gap-4 mb-4">
          {/* Risk Radar - Left, smaller */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-background-grey rounded-lg p-4 border border-primary/10"
          >
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-primary/5">
              <AlertTriangle className="w-4 h-4 text-accent-red" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Радар Биологических Рисков</span>
            </div>
            
            <div className="flex flex-col items-center mb-3">
              <CircularRiskIndicator value={95} size={100} />
              <div className="mt-3 text-center">
                <div className="text-lg font-bold text-accent-red mb-1">КРИТИЧЕСКИЙ</div>
                <div className="text-xs text-primary/70 font-medium">Риск Парши</div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-primary/5">
              <p className="text-xs text-primary/60 leading-relaxed text-center">
                Период инфицирования длится уже <span className="font-semibold text-primary">12 часов</span>
              </p>
            </div>
          </motion.div>

          {/* Tech Card - Right, larger (2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 bg-background-grey rounded-lg p-4 border border-primary/10"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-primary/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Динамическая Техкарта</span>
              </div>
              <span className="text-xs text-primary/50 font-mono">ИИ Агроном</span>
            </div>
            
            <div className="space-y-3">
              {techTasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + idx * 0.1 }}
                  className="bg-white/50 rounded-lg p-3 border border-primary/10 hover:border-accent-teal/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-semibold text-primary/50 uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">
                          {task.type}
                        </span>
                        {task.priority === 'Высокий' && (
                          <span className="text-[10px] font-semibold text-accent-red bg-accent-red/10 px-2 py-0.5 rounded">
                            {task.priority}
                          </span>
                        )}
                        {task.priority === 'Средний' && (
                          <span className="text-[10px] font-semibold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded">
                            {task.priority}
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-primary mb-1">{task.name}</div>
                      {task.time && (
                        <div className="flex items-center gap-1.5 text-xs text-primary/60">
                          <Clock className="w-3 h-3" />
                          <span>Запланировано на {task.time}</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="w-5 h-5 border-2 border-primary/30 rounded-sm flex items-center justify-center">
                        {task.status === 'completed' && (
                          <CheckCircle2 className="w-4 h-4 text-accent-green" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Phenology and Growth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-background-grey rounded-lg p-4 border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-primary/5">
            <Sprout className="w-4 h-4 text-accent-teal" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Фенология и Рост</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* GDD Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-primary/60">GDD График</span>
                <span className="text-xs font-mono font-semibold text-primary">GDD: 245</span>
              </div>
              <div className="h-20 mb-3 relative bg-white/30 rounded border border-primary/5 p-2">
                <Sparkline data={gddData} color="#00897b" />
              </div>
            </div>

            {/* Stage Info */}
            <div className="flex flex-col justify-between">
              <div className="mb-3">
                <div className="text-xs text-primary/60 mb-1">Текущая стадия</div>
                <div className="text-base font-bold text-primary mb-1">
                  BBCH 67 <span className="text-sm font-normal text-primary/70">(Завязывание плодов)</span>
                </div>
              </div>
              <div className="pt-3 border-t border-primary/5">
                <div className="flex items-center gap-2 text-xs text-primary/60">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Следующая стадия <span className="font-semibold text-primary">(Лесной орех)</span> через <span className="font-semibold text-accent-teal">3 дня</span>
                  </span>
                </div>
              </div>
            </div>
        </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -right-6 w-24 h-24 bg-accent-teal/10 rounded-xl backdrop-blur-sm border border-accent-teal/20 -z-10"
      />
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-lg backdrop-blur-sm border border-primary/20 -z-10"
      />
    </motion.div>
  )
}
