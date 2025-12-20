import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listTables() {
  try {
    // Получаем список всех таблиц в базе данных
    const result = await prisma.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    console.log('\n📊 Таблицы в базе данных PostgreSQL:\n');
    result.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    console.log(`\nВсего таблиц: ${result.length}\n`);

    // Разделяем на пользовательские и системные
    const userTables = result.filter(t => !t.table_name.startsWith('_'));
    const systemTables = result.filter(t => t.table_name.startsWith('_'));

    console.log('📋 Пользовательские таблицы (из Excel):');
    userTables.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });

    if (systemTables.length > 0) {
      console.log('\n🔧 Системные таблицы (Prisma):');
      systemTables.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTables();
