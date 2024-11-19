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

  // Проверка индекса и оптимизация запросов
  const datasetsPromises = keys.map((key) => {
    return FurnaceModel.aggregate([
      { $match: { key, timestamp: { $gte: timeAgo } } },
      { $sort: { timestamp: 1 } },
      { $limit: 250000 } // Ограничение количества записей
    ]);
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

// Температура: от 0 до 1200
// Функция генерации графиков температуры
const generateTemperatureChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
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
    'Середина ближний левый',
    'Середина ближний правый',
    'Середина дальний левый',
    'Середина дальний правый',
    'Низ ближний левый',
    'Низ ближний правый',
    'Низ дальний левый',
    'Низ дальний правый',
    'Камера смешения',
    'Дымовой боров',
  ];

  return generateChart(FurnaceModel, Keys, labels, 'Температура (°C)', chartTitle, 0, 1200, 50, timeRangeInHours);
};

// Функция генерации графиков давления/разрежения
const generatePressureChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
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
