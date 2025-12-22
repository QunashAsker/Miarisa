import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const excelFilePath = path.join(process.cwd(), 'data base.xlsx');

console.log('Reading Excel file:', excelFilePath);

// Читаем Excel файл
const workbook = XLSX.readFile(excelFilePath);

console.log('\n=== Анализ структуры Excel файла ===\n');
console.log(`Всего вкладок: ${workbook.SheetNames.length}\n`);

// Анализируем каждую вкладку
workbook.SheetNames.forEach((sheetName, index) => {
  console.log(`\n--- Вкладка ${index + 1}: "${sheetName}" ---`);
  
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  
  if (data.length === 0) {
    console.log('  Пустая вкладка');
    return;
  }
  
  // Первая строка - заголовки
  const headers = data[0] as any[];
  const rows = data.slice(1);
  
  console.log(`  Строк данных: ${rows.length}`);
  console.log(`  Колонок: ${headers.length}`);
  console.log(`  Заголовки:`, headers);
  
  // Показываем первые несколько строк данных для понимания структуры
  console.log(`  Примеры данных (первые 3 строки):`);
  rows.slice(0, Math.min(3, rows.length)).forEach((row, i) => {
    console.log(`    Строка ${i + 1}:`, row);
  });
  
  // Анализируем типы данных в колонках
  console.log(`  Типы данных по колонках:`);
  headers.forEach((header, colIndex) => {
    const columnData = rows
      .map((row: any) => row[colIndex])
      .filter(val => val !== null && val !== undefined && val !== '');
    
    if (columnData.length > 0) {
      const sampleValues = columnData.slice(0, 5);
      const types = new Set(sampleValues.map(val => typeof val));
      console.log(`    "${header}": ${types.size > 0 ? Array.from(types).join(', ') : 'unknown'} | Примеры: ${sampleValues.slice(0, 3).join(', ')}`);
    }
  });
});

console.log('\n=== Анализ завершен ===\n');

