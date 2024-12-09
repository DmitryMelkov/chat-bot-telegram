import { NotisVR1, NotisVR2 } from "../../../models/NotisModel.js";
import { createChartConfig, renderChartToBuffer } from "../../chartConfig.js";

// Общая функция генерации графика для заданной даты
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

  // Проверка корректности даты
  if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
    throw new Error('Некорректная дата. Пожалуйста, введите дату в формате ДД.ММ.ГГГГ.');
  }

  // Определяем начало и конец дня
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

    // Преобразуем Map в объект
    const dataMap = Object.fromEntries(doc.data);
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

      const rawValue = dataMap[key];

      if (rawValue !== undefined && rawValue !== null) {
        let value;
        if (typeof rawValue === 'string') {
          value = parseFloat(rawValue.replace(',', '.'));
          if (isNaN(value)) {
            console.warn(`Некорректное строковое значение для ключа "${key}" в документе _id=${doc._id}: ${rawValue}`);
            datasets[index].push(null); // Добавляем null для некорректных значений
            totalDataPoints++;
            return; // Переходим к следующему значению
          }
        } else if (typeof rawValue === 'number') {
          value = rawValue;
        } else {
          console.warn(`Некорректный тип данных для ключа "${key}" в документе _id=${doc._id}: ${rawValue}`);
          datasets[index].push(null); // Добавляем null для некорректных типов данных
          totalDataPoints++;
          return; // Переходим к следующему значению
        }
        datasets[index].push(value);
      } else {
        datasets[index].push(null); // Если данных нет, добавляем null
      }
      totalDataPoints++; // Увеличиваем счетчик точек данных
    });
  }

  // Проверяем, есть ли данные для каждого ключа
  datasets.forEach((dataset, index) => {
    if (dataset.every((value) => value === null)) {
      console.warn(`Нет данных для "${keys[index]}" за выбранный день (${userDate}).`);
    }
  });

  // Проверяем, есть ли вообще данные для графика
  const hasData = datasets.some((dataset) => dataset.some((value) => value !== null));
  if (!hasData) {
    throw new Error(`Нет корректных данных для отображения графика "${chartTitle}" за выбранный день (${userDate}).`);
  }

  // Генерация конфигурации графика
  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};

// Функция генерации графика для дозы Кг/ч за выбранный день
const generateDoseChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  try {
    // Определяем ключ на основе суффикса
    const key = `Нотис ВР${suffix} Кг/час`;

    // Метка для графика
    const label = 'Доза (Кг/ч)';

    // Параметры для оси Y (настройте при необходимости)
    const yMin = 0;
    const yMax = 1000; // Примерное максимальное значение, измените по необходимости
    const yAxisStep = 50; // Шаг оси Y

    // Добавляем дату в заголовок графика
    const titleWithDate = `${chartTitle} за ${userDate}`;

    // Вызов общей функции генерации графика для даты
    return await generateChartForDate(
      FurnaceModel,
      [key],           // Массив ключей (только один)
      [label],         // Массив меток (только одна)
      'Доза (Кг/ч)',   // Название оси Y
      titleWithDate,   // Заголовок графика с датой
      yMin,            // Минимальное значение оси Y
      yMax,            // Максимальное значение оси Y
      yAxisStep,       // Шаг оси Y
      userDate         // Пользовательская дата
    );
  } catch (error) {
    // Логируем и возвращаем ошибку с сообщением
    console.error(error.message);
    return `Ошибка: ${error.message}. Пожалуйста, попробуйте еще раз или нажмите "Назад" для выхода.`;
  }
};



// Вызов архива дозы для нотисов
export const generateDoseChartArchiveVR1 = (userDate) =>
  generateDoseChartArchive(NotisVR1, 'График дозы нотиса печи карбонизации №1', userDate, '1');
export const generateDoseChartArchiveVR2 = (userDate) =>
  generateDoseChartArchive(NotisVR2, 'График дозы нотиса печи карбонизации №2', userDate, '2');
