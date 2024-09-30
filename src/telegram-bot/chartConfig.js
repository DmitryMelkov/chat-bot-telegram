import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import moment from 'moment';

const colors = [
  'rgb(54, 162, 235)',
  'rgb(255, 99, 132)',
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

export const createChartConfig = (timestamps, values, labels, yAxisTitle, chartTitle, yMin, yMax, yAxisStep) => {
  return {
    type: 'line',
    data: {
      labels: timestamps.map((timestamp) => {
        const formattedDate = moment(timestamp, 'DD.MM.YYYY, HH:mm:ss').format('HH:mm');
        return formattedDate; // Преобразование в формат часы:минуты
      }),
      datasets: values.map((data, index) => ({
        label: labels[index],
        data,
        fill: false,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length],
        borderWidth: 1.5,
        tension: 0.1,
        pointRadius: 0,
      })),
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: 'Время' },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 20,
          },
        },
        y: {
          title: { display: true, text: yAxisTitle },
          min: yMin,
          max: yMax,
          beginAtZero: false,
          ticks: {
            stepSize: yAxisStep,
          },
        },
        y2: {
          title: { display: true, text: yAxisTitle },
          position: 'right',
          min: yMin,
          max: yMax,
          beginAtZero: false,
          ticks: {
            stepSize: yAxisStep,
          },
        },
      },
      plugins: {
        title: { display: true, text: chartTitle },
      },
    },
  };
};

export const renderChartToBuffer = async (config) => {
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 1280, height: 1024 });
  const buffer = await chartJSNodeCanvas.renderToBuffer(config);

  if (!buffer || buffer.length === 0) {
    throw new Error('Не удалось создать график');
  }

  return buffer;
};
