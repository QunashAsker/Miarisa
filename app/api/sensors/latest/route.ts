import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Хранение состояния для плавных волн (в памяти сервера)
let simulationStep = 0

/**
 * Генерирует новые данные с плавными изменениями
 * Включает периодические экстремальные значения для демонстрации алертов
 */
function generateNewSensorData(previous: {
  temperature: number
  humidity: number
  leafWetness: number
  windSpeed: number
  soilMoisture: number
} | null) {
  simulationStep++
  
  // Определяем фазу цикла (каждые ~60 шагов = ~5 минут меняется режим)
  const cyclePhase = Math.floor(simulationStep / 60) % 5
  
  // Базовые значения зависят от фазы цикла
  let baseTemp: number
  let baseHumidity: number
  let baseLeafWet: number
  let baseWind: number
  let baseSoil: number
  
  switch (cyclePhase) {
    case 0: // Нормальный режим
      baseTemp = 20 + Math.sin(simulationStep * 0.1) * 3
      baseHumidity = 65 + Math.sin(simulationStep * 0.08) * 10
      baseLeafWet = 4 + Math.sin(simulationStep * 0.12) * 2
      baseWind = 2 + Math.sin(simulationStep * 0.15) * 1.5
      baseSoil = 72 + Math.sin(simulationStep * 0.05) * 5
      break
      
    case 1: // 🔴 Высокий риск болезней (влажность листа > 10ч)
      baseTemp = 18 + Math.sin(simulationStep * 0.1) * 2
      baseHumidity = 85 + Math.sin(simulationStep * 0.08) * 8
      baseLeafWet = 14 + Math.sin(simulationStep * 0.12) * 4 // > 10ч — РИСК!
      baseWind = 1.5 + Math.sin(simulationStep * 0.15) * 1
      baseSoil = 75 + Math.sin(simulationStep * 0.05) * 5
      break
      
    case 2: // 🔴 Сильный ветер (> 5 м/с — закрытое окно)
      baseTemp = 22 + Math.sin(simulationStep * 0.1) * 3
      baseHumidity = 55 + Math.sin(simulationStep * 0.08) * 10
      baseLeafWet = 2 + Math.sin(simulationStep * 0.12) * 1.5
      baseWind = 8 + Math.sin(simulationStep * 0.15) * 3 // > 5 м/с — ВЕТЕР!
      baseSoil = 68 + Math.sin(simulationStep * 0.05) * 5
      break
      
    case 3: // 🔴 Низкая влажность почвы (< 60% — полив!)
      baseTemp = 28 + Math.sin(simulationStep * 0.1) * 4 // Жарко
      baseHumidity = 45 + Math.sin(simulationStep * 0.08) * 8
      baseLeafWet = 1 + Math.sin(simulationStep * 0.12) * 0.5
      baseWind = 3 + Math.sin(simulationStep * 0.15) * 1.5
      baseSoil = 48 + Math.sin(simulationStep * 0.05) * 8 // < 60% — ПОЛИВ!
      break
      
    case 4: // 🔴 Экстремальная температура (> 25°C — риск ожога)
      baseTemp = 30 + Math.sin(simulationStep * 0.1) * 3 // > 25°C — ЖАРА!
      baseHumidity = 40 + Math.sin(simulationStep * 0.08) * 8
      baseLeafWet = 0.5 + Math.sin(simulationStep * 0.12) * 0.3
      baseWind = 2.5 + Math.sin(simulationStep * 0.15) * 1.5
      baseSoil = 55 + Math.sin(simulationStep * 0.05) * 6
      break
      
    default:
      baseTemp = 20
      baseHumidity = 65
      baseLeafWet = 4
      baseWind = 2
      baseSoil = 70
  }
  
  // Добавляем небольшой шум
  const noise = () => (Math.random() - 0.5) * 0.8
  
  // Ограничиваем значения в разумных пределах
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))
  
  // Если есть предыдущие данные, делаем плавный переход
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  
  if (previous) {
    return {
      temperature: Math.round(clamp(lerp(previous.temperature, baseTemp + noise(), 0.25), -5, 40) * 10) / 10,
      humidity: Math.round(clamp(lerp(previous.humidity, baseHumidity + noise(), 0.25), 20, 100) * 10) / 10,
      leafWetness: Math.round(clamp(lerp(previous.leafWetness, baseLeafWet + noise(), 0.25), 0, 24) * 10) / 10,
      windSpeed: Math.round(clamp(lerp(previous.windSpeed, baseWind + noise(), 0.25), 0, 15) * 10) / 10,
      soilMoisture: Math.round(clamp(lerp(previous.soilMoisture, baseSoil + noise(), 0.2), 20, 100) * 10) / 10,
    }
  }
  
  return {
    temperature: Math.round(clamp(baseTemp + noise(), -5, 40) * 10) / 10,
    humidity: Math.round(clamp(baseHumidity + noise(), 20, 100) * 10) / 10,
    leafWetness: Math.round(clamp(baseLeafWet + noise(), 0, 24) * 10) / 10,
    windSpeed: Math.round(clamp(baseWind + noise(), 0, 15) * 10) / 10,
    soilMoisture: Math.round(clamp(baseSoil + noise(), 20, 100) * 10) / 10,
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
