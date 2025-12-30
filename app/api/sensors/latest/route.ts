import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/sensors/latest
 * Возвращает последние данные с датчиков (или симулятора)
 */
export async function GET() {
  try {
    // Получаем последнюю запись
    const latest = await prisma.sensorLog.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    })

    if (!latest) {
      return NextResponse.json(
        {
          error: 'Нет данных',
          message: 'В базе данных нет записей от датчиков. Запустите симулятор командой: npx tsx scripts/sensor-simulation.ts',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: latest.id,
      timestamp: latest.timestamp.toISOString(),
      temperature: latest.temperature,
      humidity: latest.humidity,
      leafWetness: latest.leafWetness,
      windSpeed: latest.windSpeed,
      soilMoisture: latest.soilMoisture,
    })
  } catch (error) {
    console.error('[API] Ошибка получения данных датчиков:', error)
    
    return NextResponse.json(
      {
        error: 'Ошибка сервера',
        message: error instanceof Error ? error.message : 'Не удалось получить данные',
      },
      { status: 500 }
    )
  }
}
