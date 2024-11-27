import { Mill1, Mill2, Mill10b } from '../../../models/MillModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

// Универсальная функция для генерации графика вибрации
const generateChartMill = async (
  millModel,
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
  const millDocuments = await millModel.find({ timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });

  if (!millDocuments || millDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Создаем массивы для временных меток и значений
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа

  // Обрабатываем каждый документ
  for (const doc of millDocuments) {
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
        // console.warn(`Нет данных для ключа "${key}" в документе с timestamp ${doc.timestamp}`);
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

// Функции для генерации графиков вибрации для мельниц
const generateVibrationChartMill = async (millModel, chartTitle, keys, labels) => {
  return generateChartMill(
    millModel,
    keys,
    labels,
    'Вибрация (мм/с)',
    chartTitle,
    0, // Минимум оси Y
    30, // Максимум оси Y
    1, // Шаг оси Y
    24 // Временной диапазон в часах
  );
};

// Графики для Мельницы №1
export const generateVibrationChartMill1 = async () =>
  generateVibrationChartMill(
    Mill1,
    'График вибрации Мельницы №1 за сутки',
    ['Фронтальная вибрация Мельница №1', 'Поперечная вибрация Мельница №1', 'Осевая вибрация Мельница №1'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

// Графики для Мельницы №2
export const generateVibrationChartMill2 = async () =>
  generateVibrationChartMill(
    Mill2,
    'График вибрации Мельницы №2 за сутки',
    ['Фронтальная вибрация Мельница №2', 'Поперечная вибрация Мельница №2', 'Осевая вибрация Мельница №2'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

// Графики для мельниц из Mill10b
export const generateVibrationChartYGM9517 = async () =>
  generateVibrationChartMill(
    Mill10b,
    'График вибрации YGM-9517 за сутки',
    ['Фронтальная вибрация YGM-9517', 'Поперечная вибрация YGM-9517', 'Осевая вибрация YGM-9517'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );

export const generateVibrationChartSBM3 = async () =>
  generateVibrationChartMill(
    Mill10b,
    'График вибрации ШБМ №3 за сутки',
    ['Вертикальная вибрация ШБМ3', 'Поперечная вибрация ШБМ3', 'Осевая вибрация ШБМ3'],
    ['Вертикальная', 'Поперечная', 'Осевая']
  );

export const generateVibrationChartYCVOK130 = async () =>
  generateVibrationChartMill(
    Mill10b,
    'График вибрации YCVOK-130 за сутки',
    ['Фронтальная вибрация YCVOK-130', 'Поперечная вибрация YCVOK-130', 'Осевая вибрация YCVOK-130'],
    ['Фронтальная', 'Поперечная', 'Осевая']
  );
