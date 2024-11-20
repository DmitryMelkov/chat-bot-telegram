import { Sushilka1, Sushilka2 } from '../../../models/SushilkaModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateChartForDate = async (
  SushilkaModel,
  keys,
  labels,
  yAxisTitle,
  chartTitle,
  yMin,
  yMax,
  yAxisStep,
  userDate
) => {
  // Разбиваем пользовательскую дату
  const [day, month, year] = userDate.split('.').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  // Извлекаем записи за указанный день
  const sushilkaDocuments = await SushilkaModel.find({
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: 1 });

  if (!sushilkaDocuments || sushilkaDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный день (${userDate}).`);
  }

  // Создаём массивы для временных меток и данных
  const timestamps = [];
  const datasets = keys.map(() => []);
  let totalDataPoints = 0;

  for (const doc of sushilkaDocuments) {
    if (totalDataPoints >= 250000) break;

    const data = doc.data;
    // Преобразуем Map в объект, если необходимо
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




const generateTemperatureChartArchive = async (SushilkaModel, chartTitle, userDate, suffix) => {
  const keys = [
    `Температура в топке Сушилка${suffix}`,
    `Температура в камере смешения Сушилка${suffix}`,
    `Температура уходящих газов Сушилка${suffix}`,
  ];

  const labels = [
    'Температура в топке',
    'Температура в камере смешения',
    'Температура уходящих газов',
  ];

  const titleWithDate = `${chartTitle} за ${userDate}`;
  return generateChartForDate(SushilkaModel, keys, labels, 'Температура (°C)', titleWithDate, 0, 600, 40, userDate);
};


const generatePressureChartArchive = async (SushilkaModel, chartTitle, userDate, suffix) => {
  const keys = [
    `Разрежение в топке Сушилка${suffix}`,
    `Разрежение в камере выгрузки Сушилка${suffix}`,
    `Разрежение воздуха на разбавление Сушилка${suffix}`,
  ];

  const labels = [
    'Разрежение в топке',
    'Разрежение в камере выгрузки',
    'Разрежение воздуха на разбавление',
  ];

  const titleWithDate = `${chartTitle} за ${userDate}`;
  return generateChartForDate(SushilkaModel, keys, labels, 'Разрежение (кгс/м²)', titleWithDate, -20, 10, 2, userDate);
};

// Температура
export const generateTemperatureChartArchiveSushilka1 = (userDate) =>
generateTemperatureChartArchive(Sushilka1, 'График температуры Сушилки №1', userDate, 1);
export const generateTemperatureChartArchiveSushilka2 = (userDate) =>
generateTemperatureChartArchive(Sushilka2, 'График температуры Сушилки №2', userDate, 2);

// Давление/разрежение
export const generatePressureChartArchiveSushilka1 = (userDate) =>
  generatePressureChartArchive(Sushilka1, 'График разрежения Сушилки №1', userDate, 1);
export const generatePressureChartArchiveSushilka2 = (userDate) =>
  generatePressureChartArchive(Sushilka2, 'График разрежения Сушилки №2', userDate, 2);