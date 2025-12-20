import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начало импорта данных из Excel...\n');

  const excelFilePath = path.join(process.cwd(), 'data base.xlsx');
  const workbook = XLSX.readFile(excelFilePath);

  // 1. Импорт Словаря
  console.log('📚 Импорт Словаря...');
  const dictionarySheet = workbook.Sheets['Словарь'];
  if (dictionarySheet) {
    const dictionaryData = XLSX.utils.sheet_to_json(dictionarySheet) as any[];
    for (const row of dictionaryData) {
      await prisma.dictionary.upsert({
        where: { code: row.Code },
        update: {
          entityType: row.Entity_Type,
          nameRu: row.Name_RU,
          scientificName: row.Scientific_Name || null,
          notes: row.Notes || null,
        },
        create: {
          entityType: row.Entity_Type,
          code: row.Code,
          nameRu: row.Name_RU,
          scientificName: row.Scientific_Name || null,
          notes: row.Notes || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${dictionaryData.length} записей`);
  }

  // 2. Импорт Фенологии
  console.log('\n🌿 Импорт Фенологии...');
  const phenologySheet = workbook.Sheets['Фенология'];
  if (phenologySheet) {
    const phenologyData = XLSX.utils.sheet_to_json(phenologySheet) as any[];
    for (const row of phenologyData) {
      await prisma.phenology.upsert({
        where: { bbchCode: row.BBCH_Code },
        update: {
          stageNameRu: row.Stage_Name_RU,
          gddThresholdBase5: row.GDD_Threshold_Base5 ?? 0,
          description: row.Description || null,
          imageLink: row.Image_Link || null,
          sourceUrl: row.Source_URL || null,
        },
        create: {
          bbchCode: row.BBCH_Code,
          stageNameRu: row.Stage_Name_RU,
          gddThresholdBase5: row.GDD_Threshold_Base5 ?? 0,
          description: row.Description || null,
          imageLink: row.Image_Link || null,
          sourceUrl: row.Source_URL || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${phenologyData.length} записей`);
  }

  // 3. Импорт Болезней
  console.log('\n🦠 Импорт Болезней...');
  const diseasesSheet = workbook.Sheets['Болезни'];
  if (diseasesSheet) {
    const diseasesData = XLSX.utils.sheet_to_json(diseasesSheet) as any[];
    for (const row of diseasesData) {
      await prisma.disease.create({
        data: {
          diseaseCode: row.Disease_Code,
          model: row.Model,
          tempF: row.Temp_F || null,
          tempC: row.Temp_C || null,
          leafWetnessHoursLight: row.Leaf_Wetness_Hours_Light || null,
          leafWetnessHoursModerate: row.Leaf_Wetness_Hours_Moderate || null,
          leafWetnessHoursSevere: row.Leaf_Wetness_Hours_Severe || null,
          notes: row.Notes || null,
          sourceUrl: row.Source_URL || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${diseasesData.length} записей`);
  }

  // 4. Импорт Питания
  console.log('\n💊 Импорт Питания...');
  const nutritionSheet = workbook.Sheets['Питание'];
  if (nutritionSheet) {
    const nutritionData = XLSX.utils.sheet_to_json(nutritionSheet, { header: 1 }) as any[][];
    // Пропускаем первую строку (заголовки) и обрабатываем данные
    let category = '';
    for (let i = 1; i < nutritionData.length; i++) {
      const row = nutritionData[i];
      if (!row || row.length === 0) continue;
      
      const parameter = row[0];
      if (!parameter) continue;
      
      // Определяем категорию по параметру
      if (parameter.includes('урожай')) category = 'yield';
      else if (parameter.includes('Площадь')) category = 'area';
      else if (parameter.includes('Removal')) category = 'removal';
      else if (parameter.includes('Fertilizer')) category = 'fertilizer';
      
      await prisma.nutrition.create({
        data: {
          parameter: String(parameter),
          value: row[1] ? String(row[1]) : null,
          unit: row[2] ? String(row[2]) : null,
          category: category || null,
          notes: row[11] ? String(row[11]) : null,
          sourceUrl: row[12] ? String(row[12]) : null,
        },
      });
    }
    console.log(`   ✓ Импортировано записей из таблицы Питание`);
  }

  // 5. Импорт Препаратов
  console.log('\n🧪 Импорт Препаратов...');
  const pesticidesSheet = workbook.Sheets['Препараты'];
  if (pesticidesSheet) {
    const pesticidesData = XLSX.utils.sheet_to_json(pesticidesSheet) as any[];
    for (const row of pesticidesData) {
      await prisma.pesticide.create({
        data: {
          tradeName: row.Trade_Name,
          activeIngredient: row.Active_Ingredient,
          targetPestCodes: row.Target_Pest_Codes,
          dosageMinLHa: row.Dosage_Min_L_ha || null,
          dosageMaxLHa: row.Dosage_Max_L_ha || null,
          dosageUnit: row.Dosage_Unit,
          minTempC: row.Min_Temp_C || null,
          maxTempC: row.Max_Temp_C || null,
          rainfastnessHours: row.Rainfastness_Hours || null,
          actionType: row.Action_Type,
          phiDays: row.PHI_Days || null,
          fracIrac: row.FRAC_IRAC || null,
          chemGroupCode: row.Chem_Group_Code || null,
          notes: row.Notes || null,
          sourceUrl: row.Source_URL || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${pesticidesData.length} записей`);
  }

  // 6. Импорт Погоды
  console.log('\n🌤️ Импорт Параметров Погоды...');
  const weatherSheet = workbook.Sheets['Погода'];
  if (weatherSheet) {
    const weatherData = XLSX.utils.sheet_to_json(weatherSheet) as any[];
    for (const row of weatherData) {
      await prisma.weatherParameter.upsert({
        where: { parameter: row.Parameter },
        update: {
          value: String(row.Value), // Преобразуем в строку (может быть число или время)
          unit: row.Unit,
          description: row.Description || null,
          sourceUrl: row.Source_URL || null,
        },
        create: {
          parameter: row.Parameter,
          value: String(row.Value), // Преобразуем в строку
          unit: row.Unit,
          description: row.Description || null,
          sourceUrl: row.Source_URL || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${weatherData.length} записей`);
  }

  // 7. Импорт Совместимости
  console.log('\n🔗 Импорт Совместимости...');
  const compatibilitySheet = workbook.Sheets['Совместимость'];
  if (compatibilitySheet) {
    const compatibilityData = XLSX.utils.sheet_to_json(compatibilitySheet, { header: 1 }) as any[][];
    const headers = compatibilityData[0] as string[];
    
    // Пропускаем первую строку (заголовки)
    for (let i = 1; i < compatibilityData.length; i++) {
      const row = compatibilityData[i];
      if (!row || row.length === 0) continue;
      
      const chemGroup1 = row[0];
      if (!chemGroup1) continue;
      
      // Обрабатываем каждую колонку совместимости
      for (let j = 1; j < headers.length && j < row.length; j++) {
        const chemGroup2 = headers[j];
        const compatibility = row[j];
        
        if (chemGroup2 && compatibility && (compatibility === 'OK' || compatibility === 'CAUTION' || compatibility === 'NO')) {
          await prisma.compatibility.upsert({
            where: {
              chemGroup1_chemGroup2: {
                chemGroup1: String(chemGroup1),
                chemGroup2: String(chemGroup2),
              },
            },
            update: {
              compatibility: String(compatibility),
            },
            create: {
              chemGroup1: String(chemGroup1),
              chemGroup2: String(chemGroup2),
              compatibility: String(compatibility),
            },
          });
        }
      }
    }
    console.log(`   ✓ Импортирована матрица совместимости`);
  }

  // 8. Импорт ЧП_Протоколы
  console.log('\n🚨 Импорт Протоколов Экстренных Мер...');
  const protocolsSheet = workbook.Sheets['ЧП_Протоколы'];
  if (protocolsSheet) {
    const protocolsData = XLSX.utils.sheet_to_json(protocolsSheet) as any[];
    for (const row of protocolsData) {
      await prisma.emergencyProtocol.upsert({
        where: { ruleId: row.Rule_ID },
        update: {
          triggerType: row.Trigger_Type,
          entityCode: row.Entity_Code,
          metric: row.Metric,
          threshold: String(row.Threshold),
          window: row.Window,
          ifYesAction: row.If_Yes_Action,
          ifNoAction: row.If_No_Action,
          constraints: row.Constraints || null,
          linkToPesticidesDb: row.Link_to_Pesticides_DB || null,
          notes: row.Notes || null,
          sourceUrl: row.Source_URL || null,
        },
        create: {
          ruleId: row.Rule_ID,
          triggerType: row.Trigger_Type,
          entityCode: row.Entity_Code,
          metric: row.Metric,
          threshold: String(row.Threshold),
          window: row.Window,
          ifYesAction: row.If_Yes_Action,
          ifNoAction: row.If_No_Action,
          constraints: row.Constraints || null,
          linkToPesticidesDb: row.Link_to_Pesticides_DB || null,
          notes: row.Notes || null,
          sourceUrl: row.Source_URL || null,
        },
      });
    }
    console.log(`   ✓ Импортировано ${protocolsData.length} записей`);
  }

  console.log('\n✅ Импорт данных завершен успешно!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при импорте данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
