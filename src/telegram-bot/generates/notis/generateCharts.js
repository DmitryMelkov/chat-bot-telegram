import { NotisVR1, NotisVR2 } from "../../../models/NotisModel.js";
import { createChartConfig, renderChartToBuffer } from "../../chartConfig.js";


// Общая функция генерации графика
const generateChart = async (
  FurnaceModel,
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
  const furnaceDocuments = await FurnaceModel.find({ timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });
  if (!furnaceDocuments || furnaceDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Создаем массивы для временных меток и значений
  const timestamps = [];
  const datasets = keys.map(() => []); // Создаем массив для каждого ключа

  // Обрабатываем каждый документ
  for (const doc of furnaceDocuments) {
    // Преобразуем Map в массив пар [ключ, значение]
    const dataEntries = Array.from(doc.data.entries());

    // Ограничиваем количество записей до 250 000 (как указано в вашем коде)
    const limitedDataEntries = dataEntries.slice(0, 250000);

    // Преобразуем обратно в объект для дальнейшей обработки
    const dataMap = Object.fromEntries(limitedDataEntries);

    const timestamp = new Date(doc.timestamp).toLocaleString();

    // Проверяем каждый ключ
    keys.forEach((key, index) => {
      if (dataMap[key] !== undefined && dataMap[key] !== null) {
        let value;
        if (typeof dataMap[key] === 'string') {
          value = parseFloat(dataMap[key].replace(',', '.'));
          if (isNaN(value)) {
            console.warn(`Некорректное строковое значение для ключа "${key}" в документе _id=${doc._id}: ${dataMap[key]}`);
            return; // Пропускаем некорректные значения
          }
        } else if (typeof dataMap[key] === 'number') {
          value = dataMap[key];
        } else {
          console.warn(`Некорректный тип данных для ключа "${key}" в документе _id=${doc._id}: ${dataMap[key]}`);
          return; // Пропускаем некорректные типы данных
        }
        datasets[index].push(value);
      } else {
        // Если значение отсутствует, можно либо пропустить, либо добавить null
        // В данном случае пропускаем
        console.warn(`Отсутствует значение для ключа "${key}" в документе _id=${doc._id}`);
      }
    });

    timestamps.push(timestamp); // Добавляем временную метку
  }

  // Проверяем, есть ли данные для каждого ключа
  datasets.forEach((dataset, index) => {
    if (dataset.length === 0) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный период времени.`);
    }
  });

  if (timestamps.length === 0 || datasets.every((dataset) => dataset.length === 0)) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  // Генерация конфигурации графика
  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};

// Функция генерации графика для дозы Кг/ч
const generateDoseChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
  // Определяем ключ на основе суффикса
  const key = `Нотис ВР${suffix} Кг/час`;

  // Метка для графика
  const label = 'Доза (Кг/ч)';

  // Параметры для оси Y (настройте при необходимости)
  const yMin = 0;
  const yMax = 1000; // Примерное максимальное значение, измените по необходимости
  const yAxisStep = 50; // Шаг оси Y

  return generateChart(
    FurnaceModel,
    [key],           // Массив ключей (только один)
    [label],         // Массив меток (только одна)
    'Доза (Кг/ч)',   // Название оси Y
    chartTitle,      // Заголовок графика
    yMin,            // Минимальное значение оси Y
    yMax,            // Максимальное значение оси Y
    yAxisStep,       // Шаг оси Y
    timeRangeInHours // Диапазон времени в часах
  );
};



// Вызов графика дозы для нотисов за 24 часа
export const generateDose24HourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за сутки', 24, '1');
export const generateDose24HourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за сутки', 24, '2');

// Вызов графика дозы для нотисов за 12 часов
export const generateDose12HourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за 12 часов', 12, '1');
export const generateDose12HourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за 12 часов', 12, '2');

// Вызов графика дозы для нотисов за 1 час
export const generateDoseOneHourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за последний час', 1, '1');
export const generateDoseOneHourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за последний час', 1, '2');
