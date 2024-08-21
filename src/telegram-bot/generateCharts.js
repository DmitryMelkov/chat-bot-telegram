import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { FurnaceVR1, FurnaceVR2 } from '../models/FurnanceModel.js';

const generateChart = async (FurnaceModel, keys, labels, yAxisTitle, chartTitle, yMin, yMax) => {
  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 1 * 60 * 60 * 1000);

  const datasetsPromises = keys.map((key) => {
    return FurnaceModel.find({ key, timestamp: { $gte: oneHourAgo.toLocaleString('ru-RU') } }).sort({ timestamp: 1 });
  });

  const datasets = await Promise.all(datasetsPromises);

  datasets.forEach((dataset, index) => {
    if (dataset.length === 0) {
      console.error(`No data found for ${keys[index]}`);
      throw new Error(`Нет данных для ${keys[index]} за последний час для ${chartTitle}.`);
    } else {
      // console.log(`Data for ${keys[index]}:`, dataset); // Логируем данные, которые были извлечены из базы данных
    }
  });

  const timestamps = datasets[0].map((d) => d.timestamp);
  const values = datasets.map((dataset) => dataset.map((d) => parseFloat(d.value.replace(',', '.'))));

  const colors = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(255, 159, 64)',
    'rgb(201, 203, 207)',
    'rgb(100, 100, 100)',
    'rgb(0, 200, 100)',
    'rgb(255, 100, 0)',
    'rgb(0, 0, 255)',
    'rgb(100, 255, 100)',
    'rgb(255, 0, 255)',
    'rgb(200, 200, 0)',
    'rgb(0, 255, 255)',
  ];

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1280, height: 1024 });
  const config = {
    type: 'line',
    data: {
      labels: timestamps,
      datasets: values.map((data, index) => ({
        label: labels[index],
        data,
        fill: false,
        borderColor: colors[index % colors.length], // разные цвета для каждого графика
        tension: 0.1,
      })),
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Время' },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          title: { display: true, text: yAxisTitle },
          min: yMin,
          max: yMax,
        },
      },
      plugins: {
        title: { display: true, text: chartTitle },
      },
    },
  };

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
    [
      'Температура 1-СК печь ВР1',
      'Температура 2-СК печь ВР1',
      'Температура 3-СК печь ВР1',
      'Температура в топке печь ВР1',
      'Температура на входе печи дожига печь ВР1',
      'Температура на выходе печи дожига печь ВР1',
      'Температура камеры выгрузки печь ВР1',
      'Температура дымовых газов котла печь ВР1',
      'Температура газов до скруббера печь ВР1',
      'Температура газов после скруббера печь ВР1',
      'Температура воды в ванне скруббер печь ВР1',
    ],
    [
      'Температура 1-СК',
      'Температура 2-СК',
      'Температура 3-СК',
      'Температура в топке',
      'Температура на входе печи дожига',
      'Температура на выходе печи дожига',
      'Температура камеры выгрузки',
      'Температура дымовых газов котла',
      'Температура газов до скруббера',
      'Температура газов после скруббера',
      'Температура воды в ванне скруббер',
    ],
    'Температура',
    'График температуры ВР1',
    0,
    1500
  );
};

export const generateTemperatureChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    [
      'Температура 1-СК печь ВР2',
      'Температура 2-СК печь ВР2',
      'Температура 3-СК печь ВР2',
      'Температура в топке печь ВР2',
      'Температура вверху камеры загрузки печь ВР2',
      'Температура внизу камеры загрузки печь ВР2',
      'Температура на входе печи дожига печь ВР2',
      'Температура на выходе печи дожига печь ВР2',
      'Температура камеры выгрузки печь ВР2',
      'Температура дымовых газов котла печь ВР2',
      'Температура газов до скруббера печь ВР2',
      'Температура газов после скруббера печь ВР2',
      'Температура воды в ванне скруббер печь ВР2',
      'Температура гранул после холод-ка печь ВР2',
    ],
    [
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
    ],
    'Температура',
    'График температуры ВР2',
    0,
    1500
  );
};

// Давление/Разрежение: от -20 до 20
export const generatePressureChartVR1 = async () => {
  return generateChart(
    FurnaceVR1,
    [
      'Давление газов после скруббера печь ВР1',
      'Давление пара в барабане котла печь ВР1',
      'Разрежение в топке печи печь ВР1',
      'Разрежение в пространстве котла утилизатора печь ВР1',
      'Разрежение низ загрузочной камеры печь ВР1',
    ],
    [
      'Давление газов после скруббера',
      'Давление пара в барабане котла',
      'Разрежение в топке',
      'Разрежение в пространстве котла утилизатора',
      'Разрежение низ загрузочной камеры',
    ],
    'Давление/Разрежение',
    'График давления/разрежения ВР1',
    -30,
    30
  );
};

export const generatePressureChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    [
      'Давление газов после скруббера печь ВР2',
      'Давление пара в барабане котла печь ВР2',
      'Разрежение в топке печи печь ВР2',
      'Разрежение в пространстве котла утилизатора печь ВР2',
      'Разрежение низ загрузочной камеры печь ВР2',
    ],
    [
      'Давление газов после скруббера',
      'Давление пара в барабане котла',
      'Разрежение в топке',
      'Разрежение в пространстве котла утилизатора',
      'Разрежение низ загрузочной камеры',
    ],
    'Давление/Разрежение',
    'График давления/разрежения ВР2',
    -30,
    30
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
    -200,
    200
  );
};

export const generateWaterLevelChartVR2 = async () => {
  return generateChart(
    FurnaceVR2,
    ['Уровень воды в барабане котла печь ВР2'],
    ['Уровень воды'],
    'Уровень',
    'График уровня воды ВР2',
    -200,
    200
  );
};
