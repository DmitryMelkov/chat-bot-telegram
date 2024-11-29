import { FurnaceMPA2, FurnaceMPA3 } from '../../../models/FurnanceMPAModel.js';
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
    `Температура верх регенератора левый ${suffix}`,
    `Температура верх регенератора правый ${suffix}`,
    `Температура верх ближний левый ${suffix}`,
    `Температура верх ближний правый ${suffix}`,
    `Температура верх дальний левый ${suffix}`,
    `Температура верх дальний правый ${suffix}`,
    `Температура середина ближняя левый ${suffix}`,
    `Температура середина ближняя правый ${suffix}`,
    `Температура середина дальняя левый ${suffix}`,
    `Температура середина дальняя правый ${suffix}`,
    `Температура низ ближний левый ${suffix}`,
    `Температура низ ближний правый ${suffix}`,
    `Температура низ дальний левый ${suffix}`,
    `Температура низ дальний правый ${suffix}`,
    `Температура камера сгорания ${suffix}`,
    `Температура дымовой боров ${suffix}`,
  ];

  const labels = [
    'Верх регенератора левый',
    'Верх регенератора правый',
    'Верх ближний левый',
    'Верх ближний правый',
    'Верх дальний левый',
    'Верх дальний правый',
    'Середина ближняя левая',
    'Середина ближняя правая',
    'Середина дальняя левая',
    'Середина дальняя правая',
    'Низ ближний левый',
    'Низ ближний правый',
    'Низ дальний левый',
    'Низ дальний правый',
    'Камера сгорания',
    'Дымовой боров',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Температура (°C)', titleWithDate, 0, 1200, 50, userDate);
};

const generatePressureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Разрежение дымовой боров ${suffix}`,
    `Давление воздух левый ${suffix}`,
    `Давление воздух правый ${suffix}`,
    `Давление низ ближний левый ${suffix}`,
    `Давление низ ближний правый ${suffix}`,
    `Давление середина ближняя левый ${suffix}`,
    `Давление середина ближняя правый ${suffix}`,
    `Давление середина дальняя левый ${suffix}`,
    `Давление середина дальняя правый ${suffix}`,
    `Давление верх дальний левый ${suffix}`,
    `Давление верх дальний правый ${suffix}`,
  ];

  const labels = [
    'Дымовой боров',
    'Воздух левый',
    'Воздух правый',
    'Низ ближний левый',
    'Низ ближний правый',
    'Середина ближняя левая',
    'Середина ближняя правая',
    'Середина дальняя левая',
    'Середина дальняя правая',
    'Верх дальний левый',
    'Верх дальний правый',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(
    FurnaceModel,
    Keys,
    labels,
    'Давление/Разрежение (кгс/м2, кгс/см2)',
    titleWithDate,
    -15,
    150,
    5,
    userDate
  );
};

// Вызов архива температур
export const generateTemperatureChartArchiveMPA2 = (userDate) =>
  generateTemperatureChartArchive(FurnaceMPA2, 'График температуры печи МПА2', userDate, 'МПА2');
export const generateTemperatureChartArchiveMPA3 = (userDate) =>
  generateTemperatureChartArchive(FurnaceMPA3, 'График температуры печи МПА3', userDate, 'МПА3');

// Вызов архива давления/разрежения
export const generatePressureChartArchiveMPA2 = (userDate) =>
  generatePressureChartArchive(FurnaceMPA2, 'График давления/разрежения печи МПА2', userDate, 'МПА2');
export const generatePressureChartArchiveMPA3 = (userDate) =>
  generatePressureChartArchive(FurnaceMPA3, 'График давления/разрежения печи МПА3', userDate, 'МПА3');