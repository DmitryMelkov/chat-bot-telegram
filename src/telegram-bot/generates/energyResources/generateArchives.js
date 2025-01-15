import {
  imDE093Model,
  imDD972Model,
  imDD973Model,
  imDD576Model,
  imDD569Model,
  imDD923Model,
  imDD924Model,
} from '../../../models/EnergyResourcesModel.js';
import { createChartConfig, renderChartToBuffer } from '../../chartConfig.js';

const generateEnergyChart = async (models, keys, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep, userDate) => {
  // Разбиваем пользовательскую дату
  const [day, month, year] = userDate.split('.').map(Number);
  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0); // Начало дня
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999); // Конец дня

  // Загружаем данные из всех моделей за указанный день
  const energyDocuments = await Promise.all(
    models.map(
      (model) =>
        model
          .find({ lastUpdated: { $gte: startOfDay, $lte: endOfDay } })
          .sort({ lastUpdated: 1 })
          .limit(500) // Ограничиваем количество документов
    )
  );

  // Собираем все уникальные временные метки
  const allTimestamps = new Set();
  energyDocuments.forEach((docs) => {
    docs.forEach((doc) => {
      allTimestamps.add(doc.lastUpdated.getTime());
    });
  });

  // Преобразуем Set в массив и сортируем
  const sortedTimestamps = Array.from(allTimestamps)
    .sort((a, b) => a - b)
    .slice(0, 5000); // Ограничиваем количество точек данных

  // Функция для поиска ближайшего значения по временной метке
  const findNearestValue = (docs, timestamp, key) => {
    let nearestDoc = null;
    let minDiff = Infinity;

    for (const doc of docs) {
      const diff = Math.abs(doc.lastUpdated.getTime() - timestamp);
      if (diff < minDiff && doc.data.has(key)) {
        minDiff = diff;
        nearestDoc = doc;
      }
    }

    return nearestDoc ? nearestDoc.data.get(key) : null;
  };

  // Интерполируем данные для каждой модели
  const datasets = keys.map(() => []);
  for (let i = 0; i < sortedTimestamps.length; i++) {
    const timestamp = sortedTimestamps[i];

    keys.forEach((key, index) => {
      let value = null;
      // Ищем ближайшее значение для текущей временной метки
      for (const docs of energyDocuments) {
        const nearestValue = findNearestValue(docs, timestamp, key);
        if (nearestValue !== null) {
          value = nearestValue;
          break;
        }
      }
      datasets[index].push(value);
    });
  }

  // Проверяем, есть ли данные для построения графика
  if (sortedTimestamps.length === 0 || datasets.every((dataset) => dataset.every((val) => val === null))) {
    throw new Error(`Нет данных для графика "${chartTitle}" за выбранный день.`);
  }

  // Создаем конфигурацию графика
  const config = createChartConfig(
    sortedTimestamps.map((t) => new Date(t).toLocaleString()),
    datasets,
    labels,
    yAxisTitle,
    chartTitle,
    yMin,
    yMax,
    yAxisStep
  );

  // Рендерим график
  return await renderChartToBuffer(config);
};

// Генерация архивного графика давления
const generatePressureChartEnergyArchive = async (userDate) => {
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

  const titleWithDate = `График давления за ${userDate} (МПа)`;

  return generateEnergyChart(
    models,
    keys,
    labels,
    'Давление (МПа)',
    titleWithDate,
    0,
    0.5,
    0.02,
    userDate // Передаем userDate
  );
};

// Генерация архивного графика расхода
const generateConsumptionChartEnergyArchive = async (userDate) => {
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

  const titleWithDate = `График расхода за ${userDate} (т/ч)`;

  return generateEnergyChart(
    models,
    keys,
    labels,
    'Расход (т/ч)',
    titleWithDate,
    0,
    5,
    1,
    userDate // Передаем userDate
  );
};

// Экспорт функций генерации архивных графиков
export const generatePressureChartEnergyResourcesArchive = (userDate) => generatePressureChartEnergyArchive(userDate);

export const generateConsumptionChartEnergyResourcesArchive = (userDate) =>
  generateConsumptionChartEnergyArchive(userDate);
