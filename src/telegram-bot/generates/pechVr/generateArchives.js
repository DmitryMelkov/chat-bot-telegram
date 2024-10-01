import { FurnaceVR1, FurnaceVR2 } from '../../../models/FurnanceModel.js';
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
  const [day, month, year] = userDate.split('.').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  const datasetsPromises = keys.map((key) => {
    return FurnaceModel.find({ key, timestamp: { $gte: startOfDay, $lte: endOfDay } }).sort({ timestamp: 1 });
  });

  const datasets = await Promise.all(datasetsPromises);

  datasets.forEach((dataset, index) => {
    if (dataset.length === 0) {
      throw new Error(`Нет данных для ${keys[index]} за выбранный период времени для ${chartTitle}.`);
    }
  });

  const timestamps = datasets[0].map((d) => new Date(d.timestamp).toLocaleString());
  const values = datasets.map((dataset) =>
    dataset.map((d) => {
      // Проверяем, является ли d.value строкой
      if (typeof d.value === 'string') {
        // Если это строка, заменяем запятую на точку
        return parseFloat(d.value.replace(',', '.'));
      } else if (typeof d.value === 'number') {
        // Если это уже число, просто возвращаем его
        return d.value;
      } else {
        throw new Error(`Некорректный тип данных для значения: ${d.value}`);
      }
    })
  );

  const config = createChartConfig(timestamps, values, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return renderChartToBuffer(config);
};

const generateTemperatureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Температура 1-СК печь ${suffix}`,
    `Температура 2-СК печь ${suffix}`,
    `Температура 3-СК печь ${suffix}`,
    `Температура в топке печь ${suffix}`,
    `Температура вверху камеры загрузки печь ${suffix}`,
    `Температура внизу камеры загрузки печь ${suffix}`,
    `Температура на входе печи дожига печь ${suffix}`,
    `Температура на выходе печи дожига печь ${suffix}`,
    `Температура камеры выгрузки печь ${suffix}`,
    `Температура дымовых газов котла печь ${suffix}`,
    `Температура газов до скруббера печь ${suffix}`,
    `Температура газов после скруббера печь ${suffix}`,
    `Температура воды в ванне скруббер печь ${suffix}`,
    `Температура гранул после холод-ка печь ${suffix}`,
  ];

  const labels = [
    'Температура 1-СК',
    'Температура 2-СК',
    'Температура 3-СК',
    'Температура в топке',
    'Температура вверху камеры загрузки',
    'Температура внизу камеры загрузки',
    'Температура на входе печи дожига',
    'Температура на выходе печи дожига',
    'Температура камеры выгрузки',
    'Температура дымовых газов котла',
    'Температура газов до скруббера',
    'Температура газов после скруббера',
    'Температура воды в ванне скруббер',
    'Температура гранул после холод-ка',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Температура (°C)', titleWithDate, 0, 1500, 50, userDate);
};

const generatePressureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Давление газов после скруббера печь ${suffix}`,
    `Давление пара в барабане котла печь ${suffix}`,
    `Разрежение в топке печи печь ${suffix}`,
    `Разрежение в пространстве котла утилизатора печь ${suffix}`,
    `Разрежение низ загрузочной камеры печь ${suffix}`,
  ];

  const labels = [
    'Давление газов после скруббера',
    'Давление пара в барабане котла',
    'Разрежение в топке',
    'Разрежение в пространстве котла утилизатора',
    'Разрежение низ загрузочной камеры',
    'Мощность горелки',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(
    FurnaceModel,
    Keys,
    labels,
    'Давление/Разрежение (кгс/м2, кгс/см2)',
    titleWithDate,
    -30,
    30,
    5,
    userDate
  );
};

// Функция генерации графиков уровня
const generateWaterLevelChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [`Уровень воды в барабане котла печь ${suffix}`, `Исполнительный механизм котла печь ${suffix}`];

  const labels = ['Уровень воды', 'Степень открытия исполнительного механизма'];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Уровень (мм)', titleWithDate, -200, 200, 10, userDate);
};

// Вызов архива температур
export const generateTemperatureChartArchiveVR1 = (userDate) =>
  generateTemperatureChartArchive(FurnaceVR1, 'График температуры печи карбонизации №1', userDate, 'ВР1');
export const generateTemperatureChartArchiveVR2 = (userDate) =>
  generateTemperatureChartArchive(FurnaceVR2, 'График температуры печи карбонизации №2', userDate, 'ВР2');
// Вызов архива давления/разрежения
export const generatePressureChartArchiveVR1 = (userDate) =>
  generatePressureChartArchive(FurnaceVR1, 'График давления/разрежения печи карбонизации №1', userDate, 'ВР1');
export const generatePressureChartArchiveVR2 = (userDate) =>
  generatePressureChartArchive(FurnaceVR2, 'График давления/разрежения печи карбонизации №2', userDate, 'ВР2');
// Вызов архива уровня
export const generateWaterLevelChartArchiveVR1 = (userDate) =>
  generateWaterLevelChartArchive(FurnaceVR1, 'График уровня печи карбонизации №1', userDate, 'ВР1');
export const generateWaterLevelChartArchiveVR2 = (userDate) =>
  generateWaterLevelChartArchive(FurnaceVR2, 'График уровня печи карбонизации №2', userDate, 'ВР2');
