import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';
import { Kotel1, Kotel2, Kotel3 } from '../../../models/KotliModel.js';

const generateChart = async (
  KotelModel,
  keys,
  labels,
  yAxisTitle,
  chartTitle,
  yMin,
  yMax,
  yAxisStep,
  timeRangeInHours
) => {
  const currentTime = new Date();
  const timeRangeInMillis = timeRangeInHours * 60 * 60 * 1000;
  const timeAgo = new Date(currentTime.getTime() - timeRangeInMillis);

  const kotelDocuments = await KotelModel.find({ timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });

  if (!kotelDocuments || kotelDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  const timestamps = [];
  const datasets = keys.map(() => []);

  for (const doc of kotelDocuments) {
    if (!doc.parameters) {
      console.warn(`Документ с timestamp ${doc.timestamp} не содержит параметров.`);
      continue;
    }

    // Преобразуем данные в плоский объект, если используется Mongoose
    const dataMap = doc.parameters.toObject ? doc.parameters.toObject({ flattenMaps: true }) : doc.parameters;

    const timestamp = new Date(doc.timestamp);
    timestamps.push(timestamp.toLocaleString());

    keys.forEach((key, index) => {
      const value = dataMap[key];

      if (value !== undefined && value !== null) {
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        datasets[index].push(numericValue);
      } else {
        console.warn(`Ключ "${key}" не найден в документе с timestamp ${doc.timestamp}.`);
      }
    });
  }

  datasets.forEach((dataset, index) => {
    if (dataset.length === 0) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный период времени.`);
    }
  });

  if (timestamps.length === 0 || datasets.every((dataset) => dataset.length === 0)) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};

// Функция для генерации графика уровня в барабане котла
export const generateLevelChart = async (KotelModel, chartTitle, timeRange, kotelNumber) => {
  if (!kotelNumber) {
    throw new Error('Номер котла (kotelNumber) не указан.');
  }

  const Keys = [`Уровень в барабане котел №${kotelNumber}`]; // Динамически формируем ключ
  const labels = ['Уровень в барабане котла'];
  const timeRangeInHours = parseInt(timeRange); // Преобразуем "1h", "12h", "24h" в число

  return generateChart(
    KotelModel,
    Keys,
    labels,
    'Уровень (мм)',
    chartTitle,
    -100, // Минимальное значение уровня
    100, // Максимальное значение уровня
    5, // Шаг оси Y
    timeRangeInHours
  );
};

// Функция для генерации графика давления пара
export const generatePressureChart = async (KotelModel, chartTitle, timeRange, kotelNumber) => {
  if (!kotelNumber) {
    throw new Error('Номер котла (kotelNumber) не указан.');
  }

  const Keys = [`Давление пара котел №${kotelNumber}`]; // Динамически формируем ключ
  const labels = ['Давление пара'];
  const timeRangeInHours = parseInt(timeRange); // Преобразуем "1h", "12h", "24h" в число

  console.log(`Генерация графика давления для котла №${kotelNumber}...`); // Логирование

  return generateChart(
    KotelModel,
    Keys,
    labels,
    'Давление (кгс/см²)',
    chartTitle,
    -1, // Минимальное значение давления
    10, // Максимальное значение давления
    0,
    5, // Шаг оси Y
    timeRangeInHours
  );
};

// Генераторы графиков для Котла 1
export const generateLevel24HourChartKotel1 = () =>
  generateLevelChart(Kotel1, 'График уровня в барабане Котла 1 за сутки', 24, '1');
export const generateLevel12HourChartKotel1 = () =>
  generateLevelChart(Kotel1, 'График уровня в барабане Котла 1 за 12 часов', 12, '1');
export const generateLevel1HourChartKotel1 = () =>
  generateLevelChart(Kotel1, 'График уровня в барабане Котла 1 за 1 час', 1, '1');

export const generatePressure24HourChartKotel1 = () =>
  generatePressureChart(Kotel1, 'График давления пара Котла 1 за сутки', 24, '1');
export const generatePressure12HourChartKotel1 = () =>
  generatePressureChart(Kotel1, 'График давления пара Котла 1 за 12 часов', 12, '1');
export const generatePressure1HourChartKotel1 = () =>
  generatePressureChart(Kotel1, 'График давления пара Котла 1 за 1 час', 1, '1');

// Генераторы графиков для Котла 2
export const generateLevel24HourChartKotel2 = () =>
  generateLevelChart(Kotel2, 'График уровня в барабане Котла 2 за сутки', 24, '2');
export const generateLevel12HourChartKotel2 = () =>
  generateLevelChart(Kotel2, 'График уровня в барабане Котла 2 за 12 часов', 12, '2');
export const generateLevel1HourChartKotel2 = () =>
  generateLevelChart(Kotel2, 'График уровня в барабане Котла 2 за 1 час', 1, '2');

export const generatePressure24HourChartKotel2 = () =>
  generatePressureChart(Kotel2, 'График давления пара Котла 2 за сутки', 24, '2');
export const generatePressure12HourChartKotel2 = () =>
  generatePressureChart(Kotel2, 'График давления пара Котла 2 за 12 часов', 12, '2');
export const generatePressure1HourChartKotel2 = () =>
  generatePressureChart(Kotel2, 'График давления пара Котла 2 за 1 час', 1, '2');

// Генераторы графиков для Котла 3
export const generateLevel24HourChartKotel3 = () =>
  generateLevelChart(Kotel3, 'График уровня в барабане Котла 3 за сутки', 24, '3');
export const generateLevel12HourChartKotel3 = () =>
  generateLevelChart(Kotel3, 'График уровня в барабане Котла 3 за 12 часов', 12, '3');
export const generateLevel1HourChartKotel3 = () =>
  generateLevelChart(Kotel3, 'График уровня в барабане Котла 3 за 1 час', 1, '3');

export const generatePressure24HourChartKotel3 = () =>
  generatePressureChart(Kotel3, 'График давления пара Котла 3 за сутки', 24, '3');
export const generatePressure12HourChartKotel3 = () =>
  generatePressureChart(Kotel3, 'График давления пара Котла 3 за 12 часов', 12, '3');
export const generatePressure1HourChartKotel3 = () =>
  generatePressureChart(Kotel3, 'График давления пара Котла 3 за 1 час', 1, '3');
