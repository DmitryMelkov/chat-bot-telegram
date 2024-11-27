import { Mill1, Mill2, Mill10b } from '../../../models/MillModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

// Универсальная функция для генерации графика по дате
const generateVibrationChartForDate = async (
  millModel,
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
  const millDocuments = await millModel.find({
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: 1 });

  if (!millDocuments || millDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный день (${userDate}).`);
  }

  // Создаём массивы для временных меток и данных
  const timestamps = [];
  const datasets = keys.map(() => []);
  let totalDataPoints = 0;

  for (const doc of millDocuments) {
    if (totalDataPoints >= 250000) break;

    const data = doc.data;
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
const generateVibrationChartArchive = async (millModel, chartTitle, userDate, keys, labels) => {
  return generateVibrationChartForDate(
    millModel,
    keys,
    labels,
    'Вибрация (мм/с)',
    chartTitle,
    0, // Минимум оси Y
    30, // Максимум оси Y
    1, // Шаг оси Y
    userDate // Дата пользователя
  );
};

// Мельница №1
export const generateVibrationChartArchiveMill1 = (userDate) =>
  generateVibrationChartArchive(
    Mill1,
    'График вибрации Мельницы №1',
    userDate,
    ['Фронтальная вибрация Мельница №1', 'Поперечная вибрация Мельница №1', 'Осевая вибрация Мельница №1'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

// Мельница №2
export const generateVibrationChartArchiveMill2 = (userDate) =>
  generateVibrationChartArchive(
    Mill2,
    'График вибрации Мельницы №2',
    userDate,
    ['Фронтальная вибрация Мельница №2', 'Поперечная вибрация Мельница №2', 'Осевая вибрация Мельница №2'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

// Мельница YGM-9517
export const generateVibrationChartArchiveYGM9517 = (userDate) =>
  generateVibrationChartArchive(
    Mill10b,
    'График вибрации YGM-9517',
    userDate,
    ['Фронтальная вибрация YGM-9517', 'Поперечная вибрация YGM-9517', 'Осевая вибрация YGM-9517'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

// Мельница ШБМ3
export const generateVibrationChartArchiveSBM3 = (userDate) =>
  generateVibrationChartArchive(
    Mill10b,
    'График вибрации ШБМ №3',
    userDate,
    ['Вертикальная вибрация ШБМ3', 'Поперечная вибрация ШБМ3', 'Осевая вибрация ШБМ3'],
    ['Вертикальная', 'Поперечная', 'Осевая']
  );

// Мельница YCVOK-130
export const generateVibrationChartArchiveYCVOK130 = (userDate) =>
  generateVibrationChartArchive(
    Mill10b,
    'График вибрации YCVOK-130',
    userDate,
    ['Фронтальная вибрация YCVOK-130', 'Поперечная вибрация YCVOK-130', 'Осевая вибрация YCVOK-130'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );
