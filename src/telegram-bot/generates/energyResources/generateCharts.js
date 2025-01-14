import {
  imDE093Model,
  imDD972Model,
  imDD973Model,
  imDD576Model,
  imDD569Model,
  imDD923Model,
  imDD924Model,
} from '../../../models/EnergyResourcesModel.js'; // Убедитесь, что путь правильный
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateEnergyChart = async (
  models,
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

  const energyDocuments = await Promise.all(
    models.map((model) => model.find({ lastUpdated: { $gte: timeAgo } }).sort({ lastUpdated: 1 }))
  );

  const combinedDocuments = energyDocuments.flat();

  if (!combinedDocuments || combinedDocuments.length === 0) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  const timestamps = [];
  const datasets = keys.map(() => []);

  for (const doc of combinedDocuments) {
    const data = doc.data;

    const timestamp = new Date(doc.lastUpdated);
    timestamps.push(timestamp.toLocaleString());

    keys.forEach((key, index) => {
      const value = data.get(key);
      if (value !== undefined && value !== null) {
        datasets[index].push(value);
      } else {
        datasets[index].push(null);
      }
    });
  }

  if (timestamps.length === 0 || datasets.every((dataset) => dataset.every((val) => val === null))) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный период времени.`);
  }

  const config = createChartConfig(timestamps, datasets, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep);
  return await renderChartToBuffer(config);
};

// Генерация графика давления
const generatePressureChartEnergy = async (timeRangeInHours) => {
  const models = [imDE093Model, imDD972Model, imDD973Model, imDD576Model, imDD569Model, imDD923Model, imDD924Model];

  const keys = [
    'Давление DD973',
    'Давление DD924',
    'Давление DD569',
    'Давление DD576',
    'Давление DE093',
    'Давление DD923',
    'Давление DD972',
  ];

  const labels = [
    'МПА №4',
    'Котел утилизатор №2',
    'УТВХ от к.265 магистраль',
    'Carbon к. 10в1 общий коллектор',
    'МПА №2',
    'Котел утилизатор №1',
    'МПА №3',
  ];

  return generateEnergyChart(
    models,
    keys,
    labels,
    'Давление (МПа)',
    'График давления за сутки (МПа)',
    0,
    0.5,
    0.02,
    timeRangeInHours
  );
};

// Генерация графика расхода
const generateConsumptionChartEnergy = async (timeRangeInHours) => {
  const models = [imDE093Model, imDD972Model, imDD973Model, imDD576Model, imDD569Model, imDD923Model, imDD924Model];

  const keys = [
    'Тонн/ч DD973',
    'Тонн/ч DD924',
    'Тонн/ч DD569',
    'Тонн/ч DD576',
    'Тонн/ч DE093',
    'Тонн/ч DD923',
    'Тонн/ч DD972',
  ];

  const labels = [
    'МПА №4',
    'Котел утилизатор №2',
    'УТВХ от к.265 магистраль',
    'Carbon к. 10в1 общий коллектор',
    'МПА №2',
    'Котел утилизатор №1',
    'МПА №3',
  ];

  return generateEnergyChart(
    models,
    keys,
    labels,
    'Расход (т/ч)',
    'График расхода за сутки (т/ч)',
    0,
    5,
    1,
    timeRangeInHours
  );
};

// Экспорт функций генерации графиков
export const generatePressureChartEnergyResources = () => generatePressureChartEnergy(24);
export const generateConsumptionChartEnergyResources = () => generateConsumptionChartEnergy(24);
