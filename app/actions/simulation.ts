'use server'

import { prisma } from '@/lib/prisma'

export interface SimulationParams {
  gdd: number // Накопленные градусо-дни (Base 5°C)
  temperature: number // Текущая температура воздуха (°C)
  leafWetness: number // Влажность листа (часы)
  windSpeed: number // Скорость ветра (м/с)
  codlingMothTraps: number // Количество ловушек плодожорки
}

export interface SimulationResult {
  phenoPhase: {
    bbchCode: number
    stageNameRu: string
    gddThreshold: number
    description: string | null
  }
  diseaseRisk: {
    level: 'Низкий' | 'Средний' | 'Высокий'
    reason: string
  }
  weatherWindow: {
    status: 'Открыто' | 'Закрыто'
    reason: string
  }
  recommendations: Array<{
    type: 'warning' | 'info' | 'critical'
    title: string
    message: string
  }>
}

/**
 * Вычисляет состояние сада на основе параметров симуляции
 */
export async function calculateOrchardState(
  params: SimulationParams
): Promise<SimulationResult> {
  const { gdd, temperature, leafWetness, windSpeed, codlingMothTraps } = params

  // 1. Определение фенофазы на основе GDD
  // Находим стадию, у которой GDD_Threshold <= введенному значению
  let currentPhenoPhase
  
  try {
    const phenologyStages = await prisma.phenology.findMany({
      where: {
        gddThresholdBase5: {
          lte: gdd, // Меньше или равно текущему GDD
        },
      },
      orderBy: {
        gddThresholdBase5: 'desc', // Сортируем по убыванию, чтобы взять максимальную подходящую стадию
      },
      take: 1, // Берем только одну (самую подходящую)
    })

    if (phenologyStages.length > 0) {
      currentPhenoPhase = phenologyStages[0]
    } else {
      // Если ничего не найдено (GDD < минимального порога), берем первую стадию
      const firstStage = await prisma.phenology.findFirst({
        orderBy: {
          gddThresholdBase5: 'asc',
        },
      })
      currentPhenoPhase = firstStage || {
        bbchCode: 0,
        stageNameRu: 'Период покоя',
        gddThresholdBase5: 0,
        description: 'GDD еще не накоплены',
      }
    }
  } catch (error) {
    console.error('Ошибка при получении фенофазы из БД:', error)
    // Fallback на дефолтное значение при ошибке
    currentPhenoPhase = {
      bbchCode: 0,
      stageNameRu: 'Период покоя',
      gddThresholdBase5: 0,
      description: 'Ошибка загрузки данных',
    }
  }

  // 2. Определение риска болезней на основе влажности листа
  let diseaseRiskLevel: 'Низкий' | 'Средний' | 'Высокий' = 'Низкий'
  let diseaseRiskReason = 'Влажность листа в норме'

  if (leafWetness > 10) {
    diseaseRiskLevel = 'Высокий'
    diseaseRiskReason = `Высокая влажность листа (${leafWetness} ч) создает условия для развития парши`
  } else if (leafWetness > 5) {
    diseaseRiskLevel = 'Средний'
    diseaseRiskReason = `Умеренная влажность листа (${leafWetness} ч) требует внимания`
  }

  // 3. Определение погодного окна для опрыскивания
  let weatherWindowStatus: 'Открыто' | 'Закрыто' = 'Открыто'
  let weatherWindowReason = 'Условия подходят для опрыскивания'

  const reasons: string[] = []
  if (windSpeed > 5) {
    weatherWindowStatus = 'Закрыто'
    reasons.push(`скорость ветра ${windSpeed} м/с превышает безопасный порог`)
  }
  if (temperature < 10) {
    weatherWindowStatus = 'Закрыто'
    reasons.push(`температура ${temperature}°C слишком низкая для эффективности препаратов`)
  }
  if (temperature > 25) {
    weatherWindowStatus = 'Закрыто'
    reasons.push(`температура ${temperature}°C слишком высокая (риск ожога)`)
  }

  if (reasons.length > 0) {
    weatherWindowReason = reasons.join(', ')
  }

  // 4. Формирование рекомендаций
  const recommendations: Array<{
    type: 'warning' | 'info' | 'critical'
    title: string
    message: string
  }> = []

  // Рекомендации по влажности листа
  if (leafWetness > 10) {
    recommendations.push({
      type: 'critical',
      title: 'Защита от парши',
      message: `Высокая влажность листа (${leafWetness} ч). Рекомендуется обработка фунгицидом согласно таблице Миллса при температуре ${temperature}°C.`,
    })
  }

  // Рекомендации по погодному окну
  if (weatherWindowStatus === 'Закрыто') {
    recommendations.push({
      type: 'warning',
      title: 'Опрыскивание запрещено',
      message: weatherWindowReason,
    })
  }

  // Рекомендации по плодожорке
  if (codlingMothTraps > 5) {
    recommendations.push({
      type: 'critical',
      title: 'Обработка от плодожорки',
      message: `Порог превышен (${codlingMothTraps} шт/неделю). Рекомендуется инсектицид.`,
    })
  }

  // Если рекомендаций нет
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      title: 'Мониторинг',
      message: 'Задач нет. Система работает в штатном режиме.',
    })
  }

  return {
    phenoPhase: {
      bbchCode: currentPhenoPhase.bbchCode,
      stageNameRu: currentPhenoPhase.stageNameRu,
      gddThreshold: currentPhenoPhase.gddThresholdBase5,
      description: currentPhenoPhase.description,
    },
    diseaseRisk: {
      level: diseaseRiskLevel,
      reason: diseaseRiskReason,
    },
    weatherWindow: {
      status: weatherWindowStatus,
      reason: weatherWindowReason,
    },
    recommendations,
  }
}
