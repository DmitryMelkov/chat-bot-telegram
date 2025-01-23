import { Kotel1, Kotel2, Kotel3 } from '../../../models/KotliModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

// Универсальная функция для генерации графика по дате
const generateKotelChartForDate = async (
  kotelModel,
  keys,
  labels,
  yAxisTitle,
  chartTitle,
  yMin,
  yMax,
  yAxisStep,
  userDate
) => {
  // Разбиваем дату пользователя
  const [day, month, year] = userDate.split('.').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  // Извлекаем записи за указанный день
  const kotelDocuments = await kotelModel
    .find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    })
    .sort({ timestamp: 1 });

  if (!kotelDocuments || kotelDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный день (${userDate}).`);
  }

  // Создаём массивы для временных меток и данных
  const timestamps = [];
  const datasets = keys.map(() => []);
  let totalDataPoints = 0;

  for (const doc of kotelDocuments) {
    if (totalDataPoints >= 250000) break;

    const data = doc.parameters;
    const dataMap = data instanceof Map ? Object.fromEntries(data) : data;
    const timestamp = new Date(doc.timestamp).toLocaleString();

    if (!timestamps.includes(timestamp)) timestamps.push(timestamp);

    keys.forEach((key, index) => {
      if (totalDataPoints >= 250000) return;

      const value = dataMap[key];
      if (value !== undefined && value !== null) {
        const numericValue = parseFloat(value.toString().replace(',', '.'));
        datasets[index].push(!isNaN(numericValue) ? numericValue : null);
      } else {
        datasets[index].push(null);
      }
      totalDataPoints++;
    });
  }

  // Проверяем наличие данных для каждого ключа
  datasets.forEach((dataset, index) => {
    if (dataset.every((value) => value === null)) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный день (${userDate}).`);
    }
  });

  // Генерация конфигурации графика
  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};

// Функции для архивных графиков вибрации мельниц
const generateLevelKotelChartArchive = async (kotelModel, chartTitle, userDate, keys, labels) => {
  return generateKotelChartForDate(
    kotelModel,
    keys,
    labels,
    'мм',
    chartTitle,
    -100, // Минимум оси Y
    100, // Максимум оси Y
    10, // Шаг оси Y
    userDate // Дата пользователя
  );
};

const generateParKotelChartArchive = async (kotelModel, chartTitle, userDate, keys, labels) => {
  return generateKotelChartForDate(
    kotelModel,
    keys,
    labels,
    'кгс/см2',
    chartTitle,
    -1, // Минимум оси Y
    10, // Максимум оси Y
    0.5, // Шаг оси Y
    userDate // Дата пользователя
  );
};

// Котел №1 Уровень
export const generateLevelChartArchiveKotel1 = (userDate) =>
  generateLevelKotelChartArchive(
    Kotel1,
    'График уровня в барабане котла №1',
    userDate,
    ['Уровень в барабане котел №1'],
    ['Уровень в барабане котла']
  );

// Котел №2 Уровень
export const generateLevelChartArchiveKotel2 = (userDate) =>
  generateLevelKotelChartArchive(
    Kotel2,
    'График уровня в барабане котла №2',
    userDate,
    ['Уровень в барабане котел №2'],
    ['Уровень в барабане котла']
  );

// Котел №3 Уровень
export const generateLevelChartArchiveKotel3 = (userDate) =>
  generateLevelKotelChartArchive(
    Kotel3,
    'График уровня в барабане котла №3',
    userDate,
    ['Уровень в барабане котел №3'],
    ['Уровень в барабане котла']
  );

// Котел №1 Пар
export const generateParChartArchiveKotel1 = (userDate) =>
  generateParKotelChartArchive(
    Kotel1,
    'График давления пара Котла №1',
    userDate,
    ['Давление пара котел №1'],
    ['Давление пара']
  );

// Котел №2 Пар
export const generateParChartArchiveKotel2 = (userDate) =>
  generateParKotelChartArchive(
    Kotel2,
    'График давления пара Котла №1',
    userDate,
    ['Давление пара котел №2'],
    ['Давление пара']
  );

  // Котел №3 Пар
export const generateParChartArchiveKotel3 = (userDate) =>
generateParKotelChartArchive(
  Kotel3,
  'График давления пара Котла №3',
  userDate,
  ['Давление пара котел №3'],
  ['Давление пара']
);
