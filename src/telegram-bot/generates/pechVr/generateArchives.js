import { FurnaceVR1, FurnaceVR2 } from '../../../models/FurnanceModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateChartForDate = async (
  FurnaceModel,
  keys,
  labels,
  yAxisTitle,
  chartTitle,
  yMin,
  yMax,
  yAxisStep,
  userDate
) => {
  // Разбиваем пользовательскую дату на компоненты (день, месяц, год)
  const [day, month, year] = userDate.split('.').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  // Получаем все документы за выбранный день
  const furnaceDocuments = await FurnaceModel.find({
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: 1 });

  if (!furnaceDocuments || furnaceDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный день (${userDate}).`);
  }

  // Создаем массивы для временных меток и данных
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа
  let totalDataPoints = 0; // Счетчик общего числа обработанных данных

  // Проходим по всем документам
  for (const doc of furnaceDocuments) {
    if (totalDataPoints >= 250000) {
      break; // Прекращаем обработку, если достигли лимита
    }

    const dataMap = Object.fromEntries(doc.data); // Преобразуем Map в объект
    const timestamp = new Date(doc.timestamp).toLocaleString(); // Форматируем временную метку

    // Добавляем временную метку, если она еще не добавлена
    if (!timestamps.includes(timestamp)) {
      timestamps.push(timestamp);
    }

    // Обрабатываем данные для каждого ключа
    keys.forEach((key, index) => {
      if (totalDataPoints >= 250000) {
        return; // Останавливаем добавление данных, если достигнут лимит
      }

      if (dataMap[key]) {
        const value = typeof dataMap[key] === 'string' ? parseFloat(dataMap[key].replace(',', '.')) : dataMap[key];
        datasets[index].push(value);
        totalDataPoints++; // Увеличиваем счетчик точек данных
      } else {
        datasets[index].push(null); // Если данных нет, добавляем null
        totalDataPoints++; // Увеличиваем счетчик точек данных
      }
    });
  }

  // Проверяем, есть ли данные для каждого ключа
  datasets.forEach((dataset, index) => {
    if (dataset.every((value) => value === null)) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный день (${userDate}).`);
    }
  });

  // Генерация конфигурации графика
  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};


const generateTemperatureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Температура 1-СК печь ${suffix}`,
    `Температура 2-СК печь ${suffix}`,
    `Температура 3-СК печь ${suffix}`,
    `Температура в топке печь ${suffix}`,
    `Температура вверху камеры загрузки печь ${suffix}`,
    `Температура внизу камеры загрузки печь ${suffix}`,
    `Температура на входе печи дожига печь ${suffix}`,
    `Температура на выходе печи дожига печь ${suffix}`,
    `Температура камеры выгрузки печь ${suffix}`,
    `Температура дымовых газов котла печь ${suffix}`,
    `Температура газов до скруббера печь ${suffix}`,
    `Температура газов после скруббера печь ${suffix}`,
    `Температура воды в ванне скруббер печь ${suffix}`,
    `Температура гранул после холод-ка печь ${suffix}`,
  ];

  const labels = [
    'Температура 1-СК',
    'Температура 2-СК',
    'Температура 3-СК',
    'Температура в топке',
    'Температура вверху камеры загрузки',
    'Температура внизу камеры загрузки',
    'Температура на входе печи дожига',
    'Температура на выходе печи дожига',
    'Температура камеры выгрузки',
    'Температура дымовых газов котла',
    'Температура газов до скруббера',
    'Температура газов после скруббера',
    'Температура воды в ванне скруббер',
    'Температура гранул после холод-ка',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Температура (°C)', titleWithDate, 0, 1500, 50, userDate);
};

const generatePressureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Давление газов после скруббера печь ${suffix}`,
    `Давление пара в барабане котла печь ${suffix}`,
    `Разрежение в топке печи печь ${suffix}`,
    `Разрежение в пространстве котла утилизатора печь ${suffix}`,
    `Разрежение низ загрузочной камеры печь ${suffix}`,
  ];

  const labels = [
    'Давление газов после скруббера',
    'Давление пара в барабане котла',
    'Разрежение в топке',
    'Разрежение в пространстве котла утилизатора',
    'Разрежение низ загрузочной камеры',
    'Мощность горелки',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(
    FurnaceModel,
    Keys,
    labels,
    'Давление/Разрежение (кгс/м2, кгс/см2)',
    titleWithDate,
    -30,
    30,
    5,
    userDate
  );
};

// Функция генерации графиков уровня
const generateWaterLevelChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [`Уровень воды в барабане котла печь ${suffix}`, `Исполнительный механизм котла печь ${suffix}`];

  const labels = ['Уровень воды', 'Степень открытия исполнительного механизма'];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Уровень (мм)', titleWithDate, -200, 200, 10, userDate);
};

// Вызов архива температур
export const generateTemperatureChartArchiveVR1 = (userDate) =>
  generateTemperatureChartArchive(FurnaceVR1, 'График температуры печи карбонизации №1', userDate, 'ВР1');
export const generateTemperatureChartArchiveVR2 = (userDate) =>
  generateTemperatureChartArchive(FurnaceVR2, 'График температуры печи карбонизации №2', userDate, 'ВР2');
// Вызов архива давления/разрежения
export const generatePressureChartArchiveVR1 = (userDate) =>
  generatePressureChartArchive(FurnaceVR1, 'График давления/разрежения печи карбонизации №1', userDate, 'ВР1');
export const generatePressureChartArchiveVR2 = (userDate) =>
  generatePressureChartArchive(FurnaceVR2, 'График давления/разрежения печи карбонизации №2', userDate, 'ВР2');
// Вызов архива уровня
export const generateWaterLevelChartArchiveVR1 = (userDate) =>
  generateWaterLevelChartArchive(FurnaceVR1, 'График уровня печи карбонизации №1', userDate, 'ВР1');
export const generateWaterLevelChartArchiveVR2 = (userDate) =>
  generateWaterLevelChartArchive(FurnaceVR2, 'График уровня печи карбонизации №2', userDate, 'ВР2');
