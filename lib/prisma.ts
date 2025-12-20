import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Получаем DATABASE_URL с поддержкой различных имен переменных в Railway
const getDatabaseUrl = (): string | undefined => {
  // Стандартное имя
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Railway может также использовать эти имена
  if (process.env.DATABASE_PRIVATE_URL) {
    return process.env.DATABASE_PRIVATE_URL;
  }
  
  if (process.env.DATABASE_PUBLIC_URL) {
    return process.env.DATABASE_PUBLIC_URL;
  }
  
  // PostgreSQL специфичные переменные Railway
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
    return `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}`;
  }
  
  return undefined;
};

const databaseUrl = getDatabaseUrl();

if (!databaseUrl) {
  console.error('❌ DATABASE_URL не найдена!');
  console.error('Проверьте, что в Railway Variables добавлена переменная DATABASE_URL');
  console.error('Доступные переменные:', Object.keys(process.env).filter(k => 
    k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('PG') || k.includes('RAILWAY')
  ));
}

// Создаем клиент с явным указанием URL если он найден
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: databaseUrl ? {
      db: {
        url: databaseUrl,
      },
    } : undefined,
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
