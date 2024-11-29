import { ReactorK296 } from "../../../models/ReactorModel.js";
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateChart = async (
  ReactorModel,
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
   const reactorDocuments = await ReactorModel.find({
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ timestamp: 1 });

  if (!reactorDocuments || reactorDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Создаем массивы для временных меток и значений
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа
  let totalDataPoints = 0;


  // Обрабатываем каждый документ
  for (const doc of reactorDocuments) {
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



const generateTemperatureArchiveChartReactor = async (ReactorModel, chartTitle, userDate) => {
  const keys = [
    `Температура реактора 45/1`,
    `Температура реактора 45/2`,
    `Температура реактора 45/3`,
    `Температура реактора 45/4`,
  ];

  const labels = [
    'Смоляной реактор №1',
    'Смоляной реактор №2',
    'Смоляной реактор №3',
    'Смоляной реактор №4',
  ];

  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChart(
    ReactorModel,
    keys,
    labels,
    'Температура (°C)',
    titleWithDate,
    0,   // yMin
    100, // yMax - настройте в соответствии с вашими данными
    5,  // yAxisStep - настройте в соответствии с вашими данными
    userDate
  );
};

const generateLevelArchiveChartReactor = async (ReactorModel, chartTitle, userDate) => {
  const keys = [
    `Уровень реактора 45/1`,
    `Уровень реактора 45/2`,
    `Уровень реактора 45/3`,
    `Уровень реактора 45/4`
  ];

  const labels = [
    'Смоляной реактор №1',
    'Смоляной реактор №2',
    'Смоляной реактор №3',
    'Смоляной реактор №4',
  ];

  const titleWithDate = `${chartTitle} за ${userDate}`;


  return generateChart(
    ReactorModel,
    keys,
    labels,
    'Уровень (мм)',
    titleWithDate,
    0,   // yMin
    2500, // yMax - настройте в соответствии с вашими данными
    100,  // yAxisStep - настройте в соответствии с вашими данными
    userDate
  );
};

export const generateTemperatureArchiveChartReactorK296 = (userDate) =>
  generateTemperatureArchiveChartReactor(
    ReactorK296,
    'График температуры смоляных реакторов (к.296)',
    userDate
  );

export const generateLevelArchiveChartReactorK296 = (userDate) =>
  generateLevelArchiveChartReactor(
    ReactorK296,
    'График уровня смоляных реакторов (к.296)',
    userDate
  );
