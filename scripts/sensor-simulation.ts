/**
 * Скрипт симуляции IoT датчиков
 * 
 * Генерирует реалистичные данные погоды с "волнами":
 * - Температура плавно растёт/падает (не скачет)
 * - Ветер налетает порывами
 * - Влажность листа накапливается ночью
 * 
 * Запуск: npx tsx scripts/sensor-simulation.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// Используем публичный URL для локального подключения
const databaseUrl = process.env.DATABASE_URL;
console.log('🔗 Подключение к БД:', databaseUrl?.replace(/:[^:@]+@/, ':***@'));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

// Состояние симулятора (плавные волны)
interface SimulatorState {
  temperature: number;      // Текущая температура
  tempDirection: number;    // Направление изменения (-1, 0, 1)
  tempCycleStep: number;    // Шаг в цикле (для синусоиды)
  
  humidity: number;         // Влажность воздуха
  
  leafWetness: number;      // Влажность листа
  leafWetDirection: number; // Накопление или высыхание
  
  windSpeed: number;        // Скорость ветра
  windGustChance: number;   // Вероятность порыва
  
  soilMoisture: number;     // Влажность почвы
}

// Начальное состояние
const state: SimulatorState = {
  temperature: 18,
  tempDirection: 1,
  tempCycleStep: 0,
  
  humidity: 65,
  
  leafWetness: 4,
  leafWetDirection: 1,
  
  windSpeed: 2,
  windGustChance: 0.1,
  
  soilMoisture: 70,
};

// Константы
const INTERVAL_MS = 5000; // 5 секунд
const TEMP_MIN = 8;
const TEMP_MAX = 32;
const WIND_MIN = 0;
const WIND_MAX = 12;
const HUMIDITY_MIN = 35;
const HUMIDITY_MAX = 98;
const LEAF_WET_MIN = 0;
const LEAF_WET_MAX = 24;
const SOIL_MIN = 25;
const SOIL_MAX = 95;

/**
 * Ограничивает значение в диапазоне
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Генерирует случайное число в диапазоне
 */
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Обновляет температуру с плавной синусоидой (имитация дня/ночи)
 */
function updateTemperature(): void {
  state.tempCycleStep += 0.05; // Медленный цикл
  
  // Базовая синусоида (имитация дневного цикла)
  const baseSine = Math.sin(state.tempCycleStep);
  const baseTemp = 20 + baseSine * 8; // 12-28°C
  
  // Небольшой шум
  const noise = random(-0.3, 0.3);
  
  state.temperature = clamp(baseTemp + noise, TEMP_MIN, TEMP_MAX);
}

/**
 * Обновляет влажность воздуха (обратно пропорционально температуре)
 */
function updateHumidity(): void {
  // Чем выше температура, тем ниже влажность
  const tempFactor = (state.temperature - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
  const baseHumidity = 85 - tempFactor * 40; // 45-85%
  
  // Небольшой шум
  const noise = random(-2, 2);
  
  state.humidity = clamp(baseHumidity + noise, HUMIDITY_MIN, HUMIDITY_MAX);
}

/**
 * Обновляет влажность листа (накопление влаги с течением времени)
 */
function updateLeafWetness(): void {
  // Если высокая влажность воздуха - лист намокает
  if (state.humidity > 80) {
    state.leafWetDirection = 1;
  } else if (state.humidity < 50) {
    state.leafWetDirection = -1;
  } else {
    // Случайное направление
    state.leafWetDirection = Math.random() > 0.5 ? 0.5 : -0.5;
  }
  
  // Изменяем влажность листа
  const change = state.leafWetDirection * random(0.2, 0.8);
  state.leafWetness = clamp(state.leafWetness + change, LEAF_WET_MIN, LEAF_WET_MAX);
}

/**
 * Обновляет скорость ветра с порывами
 */
function updateWindSpeed(): void {
  // Базовый ветер (плавные волны)
  const baseWind = 2 + Math.sin(state.tempCycleStep * 0.3) * 1.5;
  
  // Порывы ветра (случайные)
  let gustBonus = 0;
  if (Math.random() < state.windGustChance) {
    gustBonus = random(2, 6); // Порыв 2-6 м/с
    console.log('💨 Порыв ветра!');
  }
  
  // После порыва ветер затухает
  const currentGust = state.windSpeed - baseWind;
  if (currentGust > 0) {
    gustBonus = Math.max(gustBonus, currentGust * 0.7); // Затухание
  }
  
  state.windSpeed = clamp(baseWind + gustBonus + random(-0.3, 0.3), WIND_MIN, WIND_MAX);
}

/**
 * Обновляет влажность почвы (медленные изменения)
 */
function updateSoilMoisture(): void {
  // Очень медленные изменения (почва не сохнет быстро)
  const change = random(-0.5, 0.3);
  state.soilMoisture = clamp(state.soilMoisture + change, SOIL_MIN, SOIL_MAX);
}

/**
 * Генерирует новые данные
 */
function generateSensorData() {
  updateTemperature();
  updateHumidity();
  updateLeafWetness();
  updateWindSpeed();
  updateSoilMoisture();
  
  return {
    temperature: Math.round(state.temperature * 10) / 10,
    humidity: Math.round(state.humidity * 10) / 10,
    leafWetness: Math.round(state.leafWetness * 10) / 10,
    windSpeed: Math.round(state.windSpeed * 10) / 10,
    soilMoisture: Math.round(state.soilMoisture * 10) / 10,
  };
}

/**
 * Записывает данные в базу
 */
async function saveSensorData(data: ReturnType<typeof generateSensorData>) {
  try {
    const record = await prisma.sensorLog.create({
      data: {
        temperature: data.temperature,
        humidity: data.humidity,
        leafWetness: data.leafWetness,
        windSpeed: data.windSpeed,
        soilMoisture: data.soilMoisture,
      },
    });
    return record;
  } catch (error) {
    console.error('❌ Ошибка записи в БД:', error);
    throw error;
  }
}

/**
 * Форматирует время для лога
 */
function formatTime(): string {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Главный цикл симуляции
 */
async function runSimulation() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       🌡️  IoT Sensor Simulator — Miarisa                   ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  Интервал: 5 секунд                                        ║');
  console.log('║  Для остановки нажмите Ctrl+C                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Проверяем подключение к БД
  try {
    await prisma.$connect();
    console.log('✅ Подключено к базе данных\n');
  } catch (error) {
    console.error('❌ Не удалось подключиться к БД:', error);
    process.exit(1);
  }
  
  // Бесконечный цикл
  const tick = async () => {
    const data = generateSensorData();
    
    try {
      await saveSensorData(data);
      
      console.log(
        `[${formatTime()}] 📡 ` +
        `Temp: ${data.temperature.toFixed(1)}°C | ` +
        `Humidity: ${data.humidity.toFixed(0)}% | ` +
        `Leaf: ${data.leafWetness.toFixed(1)}h | ` +
        `Wind: ${data.windSpeed.toFixed(1)} м/с | ` +
        `Soil: ${data.soilMoisture.toFixed(0)}%`
      );
    } catch (error) {
      console.error(`[${formatTime()}] ❌ Ошибка:`, error);
    }
  };
  
  // Первый тик сразу
  await tick();
  
  // Затем каждые 5 секунд
  setInterval(tick, INTERVAL_MS);
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Остановка симулятора...');
  await prisma.$disconnect();
  console.log('👋 До свидания!\n');
  process.exit(0);
});

// Запуск
runSimulation().catch(async (error) => {
  console.error('💥 Критическая ошибка:', error);
  await prisma.$disconnect();
  process.exit(1);
});
