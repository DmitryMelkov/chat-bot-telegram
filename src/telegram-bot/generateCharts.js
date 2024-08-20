import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { FurnaceVR1, FurnaceVR2 } from '../models/FurnanceModel.js';

const generateChart = async (FurnaceModel, keys, labels, yAxisTitle, chartTitle, yMin, yMax) => {
  const currentTime = new Date(); // Текущее время
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000); // Время час назад

  // Запрос данных из базы данных для каждого ключа
  const datasetsPromises = keys.map((key) =>
    FurnaceModel.find({ key, timestamp: { $gte: oneHourAgo.toLocaleString('ru-RU') } }).sort({ timestamp: 1 })
  );

  const datasets = await Promise.all(datasetsPromises); // Ожидаем завершения всех запросов

  // Проверка на наличие данных
  if (datasets.some((dataset) => dataset.length === 0)) {
    throw new Error(`Нет данных для одного из графиков за последний час для ${chartTitle}.`);
  }

  const timestamps = datasets[0].map((d) => d.timestamp); // Предполагается, что временные метки одинаковы для всех данных
  const values = datasets.map((dataset) => dataset.map((d) => parseFloat(d.value.replace(',', '.'))));

  // Создание объекта для отрисовки графика
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const config = {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: values.map((data, index) => ({
        label: labels[index],
        data,
        fill: false,
        borderColor: `rgb(${75 + index * 40}, ${192 - index * 40}, 192)`,
        tension: 0.1,
      })),
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Время' } },
        y: {
          title: { display: true, text: yAxisTitle },
          min: yMin, // Используем переданный min
          max: yMax  // Используем переданный max
        },
      },
      plugins: {
        title: { display: true, text: chartTitle },
      },
    },
  };

  // Генерация и возврат буфера с графиком
  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  if (!buffer || buffer.length === 0) {
    throw new Error(`Не удалось создать график для ${chartTitle}`);
  }

  return buffer;
};

// Температура: от 0 до 1500
export const generateTemperatureChartVR1 = async () => {
  return generateChart(
    FurnaceVR1,
    ['Температура 1-СК печь ВР1', 'Температура 2-СК печь ВР1', 'Температура 3-СК печь ВР1'],
    ['Температура 1-СК', 'Температура 2-СК', 'Температура 3-СК'],
    'Температура',
    'График температуры ВР1',
    0,  // min для температуры
    1500 // max для температуры
  );
};

export const generateTemperatureChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    ['Температура 1-СК печь ВР2', 'Температура 2-СК печь ВР2', 'Температура 3-СК печь ВР2'],
    ['Температура 1-СК', 'Температура 2-СК', 'Температура 3-СК'],
    'Температура',
    'График температуры ВР2',
    0,  // min для температуры
    1500 // max для температуры
  );
};

// Давление/Разрежение: от -20 до 20
export const generatePressureChartVR1 = async () => {
  return generateChart(
    FurnaceVR1,
    ['Давление пара в барабане котла печь ВР1', 'Разрежение в топке печи печь ВР1'],
    ['Давление пара', 'Разрежение в топке'],
    'Давление/Разрежение',
    'График давления/разрежения ВР1',
    -20,  // min для давления/разрежения
    20    // max для давления/разрежения
  );
};

export const generatePressureChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    ['Давление пара в барабане котла печь ВР2', 'Разрежение в топке печи печь ВР2'],
    ['Давление пара', 'Разрежение в топке'],
    'Давление/Разрежение',
    'График давления/разрежения ВР2',
    -20,  // min для давления/разрежения
    20    // max для давления/разрежения
  );
};

// Уровень воды: от -200 до 200
export const generateWaterLevelChartVR1 = async () => {
  return generateChart(
    FurnaceVR1,
    ['Уровень воды в барабане котла печь ВР1'],
    ['Уровень воды'],
    'Уровень',
    'График уровня воды ВР1',
    -200, // min для уровня воды
    200   // max для уровня воды
  );
};

export const generateWaterLevelChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    ['Уровень воды в барабане котла печь ВР2'],
    ['Уровень воды'],
    'Уровень',
    'График уровня воды ВР2',
    -200, // min для уровня воды
    200   // max для уровня воды
  );
};
