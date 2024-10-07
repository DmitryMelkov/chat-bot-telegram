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
      if (typeof d.value === 'string') {
        return parseFloat(d.value.replace(',', '.'));
      } else if (typeof d.value === 'number') {
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
    `Температура Верх регенератора левый ${suffix}`,
    `Температура Верх регенератора правый ${suffix}`,
    `Температура Верх ближний левый ${suffix}`,
    `Температура Верх ближний правый ${suffix}`,
    `Температура Верх дальний левый ${suffix}`,
    `Температура Верх дальний правый ${suffix}`,
    `Температура Середина ближняя левая ${suffix}`,
    `Температура Середина ближняя правая ${suffix}`,
    `Температура Середина дальняя левая ${suffix}`,
    `Температура Середина дальняя правая ${suffix}`,
    `Температура Низ ближний левый ${suffix}`,
    `Температура Низ ближний правый ${suffix}`,
    `Температура Низ дальний левый ${suffix}`,
    `Температура Низ дальний правый ${suffix}`,
    `Температура Камера смешения ${suffix}`,
    `Температура Дымовой боров ${suffix}`,
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
    'Камера смешения',
    'Дымовой боров',
  ];

  // Добавляем дату в заголовок графика
  const titleWithDate = `${chartTitle} за ${userDate}`;

  return generateChartForDate(FurnaceModel, Keys, labels, 'Температура (°C)', titleWithDate, 0, 1200, 50, userDate);
};

const generatePressureChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  const Keys = [
    `Давление Дымовой боров ${suffix}`,
    `Давление Воздух левый ${suffix}`,
    `Давление Воздух правый ${suffix}`,
    `Давление Низ ближний левый ${suffix}`,
    `Давление Низ ближний правый ${suffix}`,
    `Давление Середина ближняя левая ${suffix}`,
    `Давление Середина ближняя правая ${suffix}`,
    `Давление Середина дальняя левая ${suffix}`,
    `Давление Середина дальняя правая ${suffix}`,
    `Давление Верх дальний левый ${suffix}`,
    `Давление Верх дальний правый ${suffix}`,
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