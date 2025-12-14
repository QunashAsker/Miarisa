'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { 
  Droplet, 
  Wind, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Cloud,
  Thermometer
} from 'lucide-react'

export default function ProductPage() {
  const tasks = [
    { id: 1, title: 'Spray Fungicide Score', priority: 'High', status: 'Critical', time: '08:00 AM' },
    { id: 2, title: 'Irrigation Block A', priority: 'Medium', status: 'Active', time: '10:00 AM' },
    { id: 3, title: 'Soil Sampling Block C', priority: 'Low', status: 'Pending', time: '02:00 PM' },
  ]

  const sensorReadings = [
    { label: 'Leaf Wetness', value: '8.2h', status: 'warning', icon: Droplet },
    { label: 'Soil Moisture', value: '65%', status: 'healthy', icon: Activity },
    { label: 'Wind Speed', value: '3.2 m/s', status: 'healthy', icon: Wind },
    { label: 'Temperature', value: '22°C', status: 'healthy', icon: Thermometer },
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
              The Dynamic TechMap
            </h1>
            <p className="text-xl text-primary/70 max-w-3xl mx-auto">
              Your digital agronomist. Real-time prescriptions that adapt to weather, disease pressure, and biological models.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Mockup */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glassmorphism rounded-2xl p-8 shadow-2xl"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content - Task List */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary">Today's Prescriptions</h2>
                  <span className="px-3 py-1 bg-accent-red/20 text-accent-red rounded-full text-sm font-medium">
                    {tasks.length} Active Tasks
                  </span>
                </div>
                
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-lg p-6 border border-background-grey hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-primary">{task.title}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              task.status === 'Critical' 
                                ? 'bg-accent-red/20 text-accent-red' 
                                : task.status === 'Active'
                                ? 'bg-accent-teal/20 text-accent-teal'
                                : 'bg-accent-amber/20 text-accent-amber'
                            }`}>
                              {task.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-primary/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.time}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              task.priority === 'High' 
                                ? 'bg-accent-red/10 text-accent-red' 
                                : task.priority === 'Medium'
                                ? 'bg-accent-amber/10 text-accent-amber'
                                : 'bg-background-grey text-primary/60'
                            }`}>
                              Priority: {task.priority}
                            </span>
                          </div>
                        </div>
                        {task.status === 'Critical' && (
                          <AlertTriangle className="w-6 h-6 text-accent-red flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Sidebar - Sensor Readings */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Sensor Readings</h3>
                  <div className="space-y-3">
                    {sensorReadings.map((sensor, index) => {
                      const Icon = sensor.icon
                      return (
                        <motion.div
                          key={sensor.label}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-white rounded-lg p-4 border border-background-grey"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                sensor.status === 'healthy' 
                                  ? 'bg-accent-green/10' 
                                  : 'bg-accent-amber/10'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  sensor.status === 'healthy' 
                                    ? 'text-accent-green' 
                                    : 'text-accent-amber'
                                }`} />
                              </div>
                              <div>
                                <p className="text-sm text-primary/60">{sensor.label}</p>
                                <p className="text-lg font-semibold text-primary">{sensor.value}</p>
                              </div>
                            </div>
                            {sensor.status === 'healthy' && (
                              <CheckCircle className="w-5 h-5 text-accent-green" />
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4">Risk Assessment</h3>
                  <div className="space-y-2">
                    <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-accent-red">Scab Risk</span>
                        <span className="text-sm font-bold text-accent-red">Critical</span>
                      </div>
                      <div className="h-2 bg-accent-red/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '85%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1 }}
                          className="h-full bg-accent-red"
                        />
                      </div>
                    </div>
                    <div className="bg-accent-amber/10 border border-accent-amber/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-accent-amber">Water Deficit</span>
                        <span className="text-sm font-bold text-accent-amber">Moderate</span>
                      </div>
                      <div className="h-2 bg-accent-amber/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '45%' }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-accent-amber"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Intelligent Automation
            </h2>
            <p className="text-xl text-primary/70 max-w-2xl mx-auto">
              AI that thinks like an agronomist, reacts like a machine
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-8"
            >
              <div className="w-16 h-16 bg-accent-teal/10 rounded-lg flex items-center justify-center mb-6">
                <Wind className="w-8 h-8 text-accent-teal" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Real-time Weather Adjustment</h3>
              <p className="text-primary/70 leading-relaxed mb-4">
                The AI automatically cancels spraying operations if wind speed exceeds 5 m/s, preventing drift and waste. Weather data updates every 15 minutes.
              </p>
              <div className="flex items-center gap-2 text-accent-teal">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Active Protection Enabled</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="glassmorphism rounded-xl p-8"
            >
              <div className="w-16 h-16 bg-accent-green/10 rounded-lg flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-accent-green" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">Automated Fertigation</h3>
              <p className="text-primary/70 leading-relaxed mb-4">
                Exact NPK calculation based on yield targets, soil analysis, and phenological stage. The system calculates precise nutrient ratios for optimal fruit quality.
              </p>
              <div className="flex items-center gap-2 text-accent-green">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Precision Dosing Active</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}

