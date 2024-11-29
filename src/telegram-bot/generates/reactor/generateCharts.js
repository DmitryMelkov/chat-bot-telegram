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
  timeRangeInHours
) => {
  const currentTime = new Date();
  const timeRangeInMillis = timeRangeInHours * 60 * 60 * 1000;
  const timeAgo = new Date(currentTime.getTime() - timeRangeInMillis);

  // Извлекаем все документы за указанный временной диапазон
  const reactorDocuments = await ReactorModel.find({ timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });

  if (!reactorDocuments || reactorDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Создаем массивы для временных меток и значений
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа

  // Обрабатываем каждый документ
  for (const doc of reactorDocuments) {
    const data = doc.data; // Получаем объект данных

    const timestamp = new Date(doc.timestamp);
    timestamps.push(timestamp.toLocaleString()); // Добавляем временную метку

    // Проверяем каждый ключ
    keys.forEach((key, index) => {
      const value = data.get(key); // Так как data - Map
      if (value !== undefined && value !== null) {
        const numericValue =
          typeof value === 'string'
            ? parseFloat(value.replace(',', '.')) // Преобразуем строку в число
            : value;

        if (!isNaN(numericValue)) {
          datasets[index].push(numericValue); // Добавляем числовое значение
        } else {
          datasets[index].push(null); // Если значение некорректное
          console.warn(`Некорректное значение для ключа "${key}": ${value}`);
        }
      } else {
        datasets[index].push(null); // Если данных нет
        console.warn(`Нет данных для ключа "${key}" в документе с timestamp ${doc.timestamp}`);
      }
    });
  }

  // Проверяем, есть ли данные для каждого ключа
  datasets.forEach((dataset, index) => {
    if (dataset.every((val) => val === null)) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный период времени.`);
    }
  });

  if (timestamps.length === 0 || datasets.every((dataset) => dataset.every((val) => val === null))) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Генерация конфигурации графика
  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  // console.log(`Генерация графика "${chartTitle}" завершена.`);
  return await renderChartToBuffer(config);
};


const generateTemperatureChartReactor = async (ReactorModel, chartTitle, timeRangeInHours) => {
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

  return generateChart(
    ReactorModel,
    keys,
    labels,
    'Температура (°C)',
    chartTitle,
    0,   // yMin
    100, // yMax - настройте в соответствии с вашими данными
    5,  // yAxisStep - настройте в соответствии с вашими данными
    timeRangeInHours
  );
};

const generateLevelChartReactor = async (ReactorModel, chartTitle, timeRangeInHours) => {
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

  return generateChart(
    ReactorModel,
    keys,
    labels,
    'Уровень (мм)',
    chartTitle,
    0,   // yMin
    2500, // yMax - настройте в соответствии с вашими данными
    100,  // yAxisStep - настройте в соответствии с вашими данными
    timeRangeInHours
  );
};

// Генерация графиков температуры за 24 часа для реактора K296
export const generateTemperatureChartReactorK296 = () =>
  generateTemperatureChartReactor(
    ReactorK296,
    'График температуры смоляных реакторов (к.296) за сутки',
    24
  );

// Генерация графиков уровня за 24 часа для реактора K296
export const generateLevelChartReactorK296 = () =>
  generateLevelChartReactor(
    ReactorK296,
    'График уровня смоляных реакторов (к.296) за сутки',
    24
  );
