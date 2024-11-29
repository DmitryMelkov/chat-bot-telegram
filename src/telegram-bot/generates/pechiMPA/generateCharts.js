import { FurnaceMPA2, FurnaceMPA3 } from '../../../models/FurnanceMPAModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

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

  // Ограничиваем количество записей до 100 000
  const limitedDataEntries = dataEntries.slice(0, 250000);

  // Преобразуем обратно в объект для дальнейшей обработки
  const dataMap = Object.fromEntries(limitedDataEntries);

  const timestamp = new Date(doc.timestamp);

  // Проверяем каждый ключ
  keys.forEach((key, index) => {
    if (dataMap[key]) {
      const value =
        typeof dataMap[key] === 'string'
          ? parseFloat(dataMap[key].replace(',', '.'))
          : dataMap[key];
      datasets[index].push(value);
    }
  });

  timestamps.push(timestamp.toLocaleString()); // Добавляем временную метку
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


// Температура: от 0 до 1200
// Функция генерации графиков температуры
const generateTemperatureChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
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
    'Середина ближний левый',
    'Середина ближний правый',
    'Середина дальний левый',
    'Середина дальний правый',
    'Низ ближний левый',
    'Низ ближний правый',
    'Низ дальний левый',
    'Низ дальний правый',
    'Камера сгорания',
    'Дымовой боров',
  ];

  return generateChart(FurnaceModel, Keys, labels, 'Температура (°C)', chartTitle, 0, 1200, 50, timeRangeInHours);
};

// Функция генерации графиков давления/разрежения
const generatePressureChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
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

  return generateChart(
    FurnaceModel,
    Keys,
    labels,
    'Давление/Разрежение (кгс/м2, кгс/см2)',
    chartTitle,
    -15,
    150,
    5,
    timeRangeInHours
  );
};

// Вызов температур
export const generateTemperature24HourChartMPA2 = () =>
  generateTemperatureChart(FurnaceMPA2, 'График температуры печи МПА2 за сутки', 24, 'МПА2');
export const generateTemperature24HourChartMPA3 = () =>
  generateTemperatureChart(FurnaceMPA3, 'График температуры печи МПА3 за сутки', 24, 'МПА3');

export const generateTemperature12HourChartMPA2 = () =>
  generateTemperatureChart(FurnaceMPA2, 'График температуры печи МПА2 за 12 часов', 12, 'МПА2');
export const generateTemperature12HourChartMPA3 = () =>
  generateTemperatureChart(FurnaceMPA3, 'График температуры печи МПА3 за 12 часов', 12, 'МПА3');

export const generateTemperatureOneHourChartMPA2 = () =>
  generateTemperatureChart(FurnaceMPA2, 'График температуры печи МПА2 за последний час', 1, 'МПА2');
export const generateTemperatureOneHourChartMPA3 = () =>
  generateTemperatureChart(FurnaceMPA3, 'График температуры печи МПА3 за последний час', 1, 'МПА3');

// Вызов разрежения/давления
export const generatePressure24HourChartMPA2 = () =>
  generatePressureChart(FurnaceMPA2, 'График давления/разрежения печи МПА2 за сутки', 24, 'МПА2');
export const generatePressure24HourChartMPA3 = () =>
  generatePressureChart(FurnaceMPA3, 'График давления/разрежения печи МПА3 за сутки', 24, 'МПА3');

export const generatePressure12HourChartMPA2 = () =>
  generatePressureChart(FurnaceMPA2, 'График давления/разрежения печи МПА2 за 12 часов', 12, 'МПА2');
export const generatePressure12HourChartMPA3 = () =>
  generatePressureChart(FurnaceMPA3, 'График давления/разрежения печи МПА3 за 12 часов', 12, 'МПА3');

export const generatePressureOneHourChartMPA2 = () =>
  generatePressureChart(FurnaceMPA2, 'График давления/разрежения печи МПА2 за последний час', 1, 'МПА2');
export const generatePressureOneHourChartMPA3 = () =>
  generatePressureChart(FurnaceMPA3, 'График давления/разрежения печи МПА3 за последний час', 1, 'МПА3');
