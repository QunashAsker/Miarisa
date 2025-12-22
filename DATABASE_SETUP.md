# Настройка базы данных PostgreSQL

## Структура проекта

Проект использует Prisma ORM для работы с PostgreSQL. Все таблицы созданы на основе данных из файла `data base.xlsx`.

## Таблицы базы данных

1. **dictionary** - Словарь сущностей (болезни, вредители)
2. **phenology** - Фенологические стадии развития (BBCH)
3. **diseases** - Модели заражения болезнями (таблица Миллса)
4. **nutrition** - Параметры питания и удобрений
5. **pesticides** - Справочник пестицидов и препаратов
6. **weather_parameters** - Параметры погодных условий
7. **compatibility** - Матрица совместимости химических групп
8. **emergency_protocols** - Протоколы экстренных мер

## Настройка подключения

1. Создайте файл `.env` в корне проекта (если его нет)
2. Добавьте строку подключения к PostgreSQL:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

Для Railway используйте формат:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@switchyard.proxy.rlwy.net:40807/postgres?sslmode=require"
```

**Важно:** Замените `YOUR_PASSWORD` на ваш реальный пароль из Railway.

## Создание таблиц и импорт данных

После настройки подключения выполните:

```bash
# 1. Генерация Prisma Client
npx prisma generate

# 2. Создание миграций и применение схемы к БД
npx prisma migrate dev --name init

# 3. Импорт данных из Excel в PostgreSQL
npx prisma db seed
```

## Использование Prisma Client

В ваших Server Actions и API роутах импортируйте Prisma Client:

```typescript
import { prisma } from '@/lib/prisma';

// Пример использования
const diseases = await prisma.disease.findMany({
  where: {
    diseaseCode: 'APPLE_SCAB'
  }
});
```

## Проверка подключения

Если возникают проблемы с подключением, проверьте:

1. Правильность пароля в `DATABASE_URL`
2. Правильность имени базы данных (может быть `railway` вместо `postgres`)
3. Что база данных создана в Railway
4. Что порт и хост указаны правильно

Для тестирования подключения:
```bash
npx tsx scripts/test-connection.ts
```

## Структура файлов

```
prisma/
  ├── schema.prisma      # Схема базы данных
  ├── seed.ts            # Скрипт импорта данных из Excel
  └── migrations/        # Миграции (создаются автоматически)

lib/
  └── prisma.ts          # Singleton Prisma Client для Next.js

scripts/
  ├── analyze-excel.ts   # Анализ структуры Excel файла
  └── test-connection.ts # Тест подключения к БД
```

