import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/sensors/ingest
 * Приём данных от реальных IoT датчиков (метеостанции)
 * 
 * Формат запроса:
 * {
 *   "temperature": 22.5,
 *   "humidity": 65,
 *   "leafWetness": 4.5,
 *   "windSpeed": 2.3,
 *   "soilMoisture": 70
 * }
 * 
 * Также поддерживаются альтернативные имена полей:
 * - temp / t → temperature
 * - hum / h → humidity
 * - leaf / lw → leafWetness
 * - wind / w → windSpeed
 * - soil / sm → soilMoisture
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Маппинг альтернативных имён полей
    const temperature = body.temperature ?? body.temp ?? body.t
    const humidity = body.humidity ?? body.hum ?? body.h ?? 50 // default
    const leafWetness = body.leafWetness ?? body.leaf ?? body.lw ?? 0
    const windSpeed = body.windSpeed ?? body.wind ?? body.w ?? 0
    const soilMoisture = body.soilMoisture ?? body.soil ?? body.sm ?? 50

    // Валидация обязательных полей
    if (temperature === undefined) {
      return NextResponse.json(
        { error: 'Поле temperature обязательно' },
        { status: 400 }
      )
    }

    // Создаём запись в БД
    const record = await prisma.sensorLog.create({
      data: {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        leafWetness: parseFloat(leafWetness),
        windSpeed: parseFloat(windSpeed),
        soilMoisture: parseFloat(soilMoisture),
      },
    })

    console.log(`[API] Получены данные от датчика: ${temperature}°C, ${windSpeed} м/с`)

    return NextResponse.json({
      success: true,
      id: record.id,
      timestamp: record.timestamp.toISOString(),
    })
  } catch (error) {
    console.error('[API] Ошибка приёма данных датчиков:', error)
    
    return NextResponse.json(
      {
        error: 'Ошибка сервера',
        message: error instanceof Error ? error.message : 'Не удалось сохранить данные',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/sensors/ingest
 * Информация об endpoint для разработчиков
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/sensors/ingest',
    method: 'POST',
    description: 'Приём данных от IoT датчиков',
    fields: {
      temperature: { type: 'number', required: true, unit: '°C' },
      humidity: { type: 'number', required: false, unit: '%', default: 50 },
      leafWetness: { type: 'number', required: false, unit: 'hours', default: 0 },
      windSpeed: { type: 'number', required: false, unit: 'm/s', default: 0 },
      soilMoisture: { type: 'number', required: false, unit: '%', default: 50 },
    },
    example: {
      temperature: 22.5,
      humidity: 65,
      leafWetness: 4.5,
      windSpeed: 2.3,
      soilMoisture: 70,
    },
  })
}
