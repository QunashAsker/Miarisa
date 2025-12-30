import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/sensors/seed
 * Генерирует тестовые данные для таблицы sensor_logs
 */
export async function POST() {
  try {
    console.log('📡 Генерация тестовых данных датчиков...')
    
    const baseTime = new Date()
    const records = []
    
    // Генерируем 20 записей с плавными волнами
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(baseTime.getTime() - (i * 5000))
      
      // Плавные синусоидальные изменения
      const temperature = 20 + Math.sin(i * 0.5) * 5 + Math.random() * 0.5
      const humidity = 65 + Math.sin(i * 0.3) * 10 + Math.random() * 2
      const leafWetness = 4 + Math.sin(i * 0.4) * 3 + Math.random() * 0.5
      const windSpeed = 2 + Math.sin(i * 0.6) * 1.5 + Math.random() * 0.3
      const soilMoisture = 70 + Math.sin(i * 0.2) * 8 + Math.random() * 2
      
      records.push({
        timestamp,
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round(humidity * 10) / 10,
        leafWetness: Math.round(leafWetness * 10) / 10,
        windSpeed: Math.round(windSpeed * 10) / 10,
        soilMoisture: Math.round(soilMoisture * 10) / 10,
      })
    }
    
    // Вставляем все записи
    const created = await prisma.sensorLog.createMany({
      data: records,
    })
    
    console.log(`✅ Создано ${created.count} записей`)
    
    return NextResponse.json({
      success: true,
      message: `Создано ${created.count} тестовых записей`,
      count: created.count,
    })
    
  } catch (error) {
    console.error('❌ Ошибка генерации данных:', error)
    
    return NextResponse.json(
      {
        error: 'Ошибка генерации данных',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sensors/seed
 * Информация об endpoint
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/sensors/seed',
    method: 'POST',
    description: 'Генерирует 20 тестовых записей с данными датчиков',
    usage: 'curl -X POST https://your-app.railway.app/api/sensors/seed',
  })
}
