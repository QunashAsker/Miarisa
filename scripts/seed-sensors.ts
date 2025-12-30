/**
 * Скрипт для заполнения таблицы sensor_logs начальными данными
 * Запускается один раз при деплое или вручную
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSensorData() {
  console.log('📡 Заполнение таблицы sensor_logs начальными данными...');
  
  try {
    // Генерируем 10 записей с плавными изменениями
    const baseTime = new Date();
    const records = [];
    
    for (let i = 0; i < 10; i++) {
      const timestamp = new Date(baseTime.getTime() - (i * 5000)); // каждые 5 секунд назад
      
      // Плавные волны температуры
      const temperature = 20 + Math.sin(i * 0.5) * 5 + Math.random() * 0.5;
      const humidity = 65 + Math.sin(i * 0.3) * 10 + Math.random() * 2;
      const leafWetness = 4 + Math.sin(i * 0.4) * 3 + Math.random() * 0.5;
      const windSpeed = 2 + Math.sin(i * 0.6) * 1.5 + Math.random() * 0.3;
      const soilMoisture = 70 + Math.sin(i * 0.2) * 8 + Math.random() * 2;
      
      records.push({
        timestamp,
        temperature: Math.round(temperature * 10) / 10,
        humidity: Math.round(humidity * 10) / 10,
        leafWetness: Math.round(leafWetness * 10) / 10,
        windSpeed: Math.round(windSpeed * 10) / 10,
        soilMoisture: Math.round(soilMoisture * 10) / 10,
      });
    }
    
    // Вставляем записи
    for (const record of records) {
      await prisma.sensorLog.create({ data: record });
      console.log(`✅ Добавлено: ${record.temperature}°C, ${record.windSpeed} м/с`);
    }
    
    console.log(`\n🎉 Добавлено ${records.length} записей в sensor_logs`);
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedSensorData();
