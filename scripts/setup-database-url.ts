/**
 * Скрипт для формирования DATABASE_URL из отдельных переменных PostgreSQL
 * Запустите: npx tsx scripts/setup-database-url.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Читаем переменные окружения
const pgHost = process.env.PGHOST || process.env.DATABASE_PUBLIC_URL;
const pgPort = process.env.PGPORT || '5432';
const pgUser = process.env.PGUSER || process.env.POSTGRES_USER || 'postgres';
const pgPassword = process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD;
const pgDatabase = process.env.PGDATABASE || process.env.POSTGRES_DB || 'postgres';

// Проверяем наличие обязательных переменных
if (!pgHost) {
  console.error('❌ Ошибка: PGHOST или DATABASE_PUBLIC_URL не установлены');
  process.exit(1);
}

if (!pgPassword) {
  console.error('❌ Ошибка: PGPASSWORD или POSTGRES_PASSWORD не установлены');
  process.exit(1);
}

// Формируем DATABASE_URL
const databaseUrl = `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}?sslmode=require`;

console.log('📝 Сформированная строка подключения:');
console.log(`DATABASE_URL="${databaseUrl}"\n`);

// Читаем существующий .env файл
const envPath = path.join(process.cwd(), '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
}

// Обновляем или добавляем DATABASE_URL
if (envContent.includes('DATABASE_URL=')) {
  // Заменяем существующую строку
  envContent = envContent.replace(
    /DATABASE_URL="[^"]*"/g,
    `DATABASE_URL="${databaseUrl}"`
  );
  console.log('✅ Обновлена существующая переменная DATABASE_URL в .env');
} else {
  // Добавляем новую строку
  envContent += `\n# PostgreSQL connection string\nDATABASE_URL="${databaseUrl}"\n`;
  console.log('✅ Добавлена новая переменная DATABASE_URL в .env');
}

// Записываем обратно в файл
fs.writeFileSync(envPath, envContent);
console.log('\n✅ Файл .env обновлен!');
console.log('\nТеперь можно выполнить:');
console.log('  npx prisma migrate dev --name init');
console.log('  npx prisma db seed');
