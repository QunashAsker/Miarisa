import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gdd, temperature, leafWetness, windSpeed, codlingMothTraps } = body

    console.log('[API Route] Получен запрос с GDD:', gdd)

    // 1. Определение фенофазы на основе GDD
    let currentPhenoPhase
    
    const phenologyStages = await prisma.phenology.findMany({
      where: {
        gddThresholdBase5: {
          lte: gdd,
        },
      },
      orderBy: {
        gddThresholdBase5: 'desc',
      },
      take: 1,
    })

    if (phenologyStages.length > 0) {
      currentPhenoPhase = phenologyStages[0]
      console.log('[API Route] Найдена стадия:', currentPhenoPhase.stageNameRu)
    } else {
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

    // 2. Определение риска болезней
    let diseaseRiskLevel: 'Низкий' | 'Средний' | 'Высокий' = 'Низкий'
    let diseaseRiskReason = 'Влажность листа в норме'

    if (leafWetness > 10) {
      diseaseRiskLevel = 'Высокий'
      diseaseRiskReason = `Высокая влажность листа (${leafWetness} ч) создает условия для развития парши`
    } else if (leafWetness > 5) {
      diseaseRiskLevel = 'Средний'
      diseaseRiskReason = `Умеренная влажность листа (${leafWetness} ч) требует внимания`
    }

    // 3. Определение погодного окна
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

    if (leafWetness > 10) {
      recommendations.push({
        type: 'critical',
        title: 'Защита от парши',
        message: `Высокая влажность листа (${leafWetness} ч). Рекомендуется обработка фунгицидом согласно таблице Миллса при температуре ${temperature}°C.`,
      })
    }

    if (weatherWindowStatus === 'Закрыто') {
      recommendations.push({
        type: 'warning',
        title: 'Опрыскивание запрещено',
        message: weatherWindowReason,
      })
    }

    if (codlingMothTraps > 5) {
      recommendations.push({
        type: 'critical',
        title: 'Обработка от плодожорки',
        message: `Порог превышен (${codlingMothTraps} шт/неделю). Рекомендуется инсектицид.`,
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'info',
        title: 'Мониторинг',
        message: 'Задач нет. Система работает в штатном режиме.',
      })
    }

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('[API Route] Ошибка:', error)
    return NextResponse.json(
      {
        error: 'Ошибка при расчете симуляции',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    )
  }
}
