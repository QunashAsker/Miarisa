import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Хранение состояния для плавных волн (в памяти сервера)
let simulationStep = 0

/**
 * Генерирует новые данные с плавными изменениями
 */
function generateNewSensorData(previous: {
  temperature: number
  humidity: number
  leafWetness: number
  windSpeed: number
  soilMoisture: number
} | null) {
  simulationStep++
  
  // Базовые значения с синусоидальными волнами
  const baseTemp = 20 + Math.sin(simulationStep * 0.1) * 5
  const baseHumidity = 65 + Math.sin(simulationStep * 0.08) * 15
  const baseLeafWet = 5 + Math.sin(simulationStep * 0.12) * 4
  const baseWind = 2.5 + Math.sin(simulationStep * 0.15) * 2
  const baseSoil = 70 + Math.sin(simulationStep * 0.05) * 10
  
  // Добавляем небольшой шум
  const noise = () => (Math.random() - 0.5) * 0.5
  
  // Если есть предыдущие данные, делаем плавный переход
  if (previous) {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    return {
      temperature: Math.round(lerp(previous.temperature, baseTemp + noise(), 0.3) * 10) / 10,
      humidity: Math.round(lerp(previous.humidity, baseHumidity + noise(), 0.3) * 10) / 10,
      leafWetness: Math.round(lerp(previous.leafWetness, baseLeafWet + noise(), 0.3) * 10) / 10,
      windSpeed: Math.round(lerp(previous.windSpeed, baseWind + noise(), 0.3) * 10) / 10,
      soilMoisture: Math.round(lerp(previous.soilMoisture, baseSoil + noise(), 0.2) * 10) / 10,
    }
  }
  
  return {
    temperature: Math.round((baseTemp + noise()) * 10) / 10,
    humidity: Math.round((baseHumidity + noise()) * 10) / 10,
    leafWetness: Math.round((baseLeafWet + noise()) * 10) / 10,
    windSpeed: Math.round((baseWind + noise()) * 10) / 10,
    soilMoisture: Math.round((baseSoil + noise()) * 10) / 10,
  }
}

/**
 * GET /api/sensors/latest
 * Возвращает последние данные с датчиков
 * Автоматически генерирует новые данные каждые 5 секунд
 */
export async function GET() {
  try {
    // Получаем последнюю запись
    const latest = await prisma.sensorLog.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    })

    const now = new Date()
    
    // Проверяем, нужно ли создать новую запись
    // Если нет записей или последняя старше 5 секунд
    const needNewRecord = !latest || 
      (now.getTime() - latest.timestamp.getTime()) > 5000

    if (needNewRecord) {
      // Генерируем новые данные на основе предыдущих (для плавности)
      const newData = generateNewSensorData(latest)
      
      // Создаём новую запись
      const newRecord = await prisma.sensorLog.create({
        data: {
          timestamp: now,
          ...newData,
        },
      })
      
      return NextResponse.json({
        id: newRecord.id,
        timestamp: newRecord.timestamp.toISOString(),
        temperature: newRecord.temperature,
        humidity: newRecord.humidity,
        leafWetness: newRecord.leafWetness,
        windSpeed: newRecord.windSpeed,
        soilMoisture: newRecord.soilMoisture,
      })
    }

    // Возвращаем существующую запись
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
