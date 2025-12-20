# Настройка подключения к PostgreSQL

## Вариант 1: Использование DATABASE_URL (рекомендуется)

Если у вас есть переменная `DATABASE_URL` в Railway:

1. Скопируйте значение `DATABASE_URL` из Railway
2. Добавьте его в файл `.env` в корне проекта:

```env
DATABASE_URL="postgresql://postgres:пароль@хост:порт/база?sslmode=require"
```

## Вариант 2: Использование отдельных переменных

Если у вас есть отдельные переменные (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`):

1. Экспортируйте их в терминале или добавьте в `.env`:

```env
PGHOST=ваш_хост
PGPORT=5432
PGUSER=postgres
PGPASSWORD=ваш_пароль
PGDATABASE=postgres
```

2. Запустите скрипт для автоматического формирования `DATABASE_URL`:

```bash
npx tsx scripts/setup-database-url.ts
```

## После настройки подключения

Выполните следующие команды:

```bash
# 1. Генерация Prisma Client
npx prisma generate

# 2. Создание и применение миграций
npx prisma migrate dev --name init

# 3. Импорт данных из Excel
npx prisma db seed
```

## Проверка подключения

Для проверки подключения к базе данных:

```bash
npx tsx scripts/test-connection.ts
```

## Какие переменные нужны из Railway?

**Минимально необходимые:**
- `DATABASE_URL` (предпочтительно) ИЛИ
- `PGHOST` (или `DATABASE_PUBLIC_URL`) + `PGPASSWORD` (или `POSTGRES_PASSWORD`)

**Дополнительные (если нет DATABASE_URL):**
- `PGPORT` (по умолчанию 5432)
- `PGUSER` (или `POSTGRES_USER`, по умолчанию postgres)
- `PGDATABASE` (или `POSTGRES_DB`, по умолчанию postgres)
