import { Sushilka1, Sushilka2 } from '../../../models/SushilkaModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateChart = async (
  SushilkaModel,
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
  const sushilkaDocuments = await SushilkaModel.find({ timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });


  if (!sushilkaDocuments || sushilkaDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Создаем массивы для временных меток и значений
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа

  // Обрабатываем каждый документ
  for (const doc of sushilkaDocuments) {
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



// Генерация графиков температуры для сушилок
const generateTemperatureChartSushilka = async (SushilkaModel, chartTitle, timeRangeInHours, suffix) => {
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

  return generateChart(SushilkaModel, keys, labels, 'Температура (°C)', chartTitle, 0, 600, 50, timeRangeInHours);
};

// Генерация графиков разрежения для сушилок
const generateVacuumChartSushilka = async (SushilkaModel, chartTitle, timeRangeInHours, suffix) => {
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

  return generateChart(SushilkaModel, keys, labels, 'Разрежение (кгс/м2)', chartTitle, -20, 10, 2, timeRangeInHours);
};

// Вызов функций для графиков температуры
export const generateTemperature24HourChartSushilka1 = () =>
  generateTemperatureChartSushilka(Sushilka1, 'График температуры Сушилки №1 за сутки', 24, 1);
export const generateTemperature24HourChartSushilka2 = () =>
  generateTemperatureChartSushilka(Sushilka2, 'График температуры Сушилки №2 за сутки', 24, 2);

export const generateTemperature12HourChartSushilka1 = () =>
  generateTemperatureChartSushilka(Sushilka1, 'График температуры Сушилки №1 за 12 часов', 12, 1);
export const generateTemperature12HourChartSushilka2 = () =>
  generateTemperatureChartSushilka(Sushilka2, 'График температуры Сушилки №2 за 12 часов', 12, 2);

export const generateTemperatureOneHourChartSushilka1 = () =>
  generateTemperatureChartSushilka(Sushilka1, 'График температуры Сушилки №1 за последний час', 1, 1);
export const generateTemperatureOneHourChartSushilka2 = () =>
  generateTemperatureChartSushilka(Sushilka2, 'График температуры Сушилки №2 за последний час', 1, 2);

// Вызов функций для графиков разрежения
export const generateVacuum24HourChartSushilka1 = () =>
  generateVacuumChartSushilka(Sushilka1, 'График разрежения Сушилки №1 за сутки', 24, 1);
export const generateVacuum24HourChartSushilka2 = () =>
  generateVacuumChartSushilka(Sushilka2, 'График разрежения Сушилки №2 за сутки', 24, 2);

export const generateVacuum12HourChartSushilka1 = () =>
  generateVacuumChartSushilka(Sushilka1, 'График разрежения Сушилки №1 за 12 часов', 12, 1);
export const generateVacuum12HourChartSushilka2 = () =>
  generateVacuumChartSushilka(Sushilka2, 'График разрежения Сушилки №2 за 12 часов', 12, 2);

export const generateVacuumOneHourChartSushilka1 = () =>
  generateVacuumChartSushilka(Sushilka1, 'График разрежения Сушилки №1 за последний час', 1, 1);
export const generateVacuumOneHourChartSushilka2 = () =>
  generateVacuumChartSushilka(Sushilka2, 'График разрежения Сушилки №2 за последний час', 1, 2);