import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import { getChartConfig } from '../../chartConfigSizod.js';

export const getDateRangeAndLabelGenerator = (period) => {
  let startDate, endDate, groupFormat, labelGenerator;

  if (period === 'daily') {
    startDate = moment().startOf('day').toDate();
    endDate = moment().toDate();
    groupFormat = 'HH:00';
    labelGenerator = (i) => moment().startOf('day').add(i, 'hours').format('HH:00');
  } else if (period === 'monthly') {
    startDate = moment().startOf('month').toDate();
    endDate = moment().endOf('month').toDate();
    groupFormat = 'DD.MM';
    labelGenerator = (i) => moment().startOf('month').add(i - 1, 'days').format('DD.MM');
  } else {
    throw new Error(`Unsupported period: ${period}`);
  }

  return { startDate, endDate, groupFormat, labelGenerator };
};

export const generateLabels = (period, labelGenerator) => {
  const labels = [];

  if (period === 'daily') {
    for (let i = 0; i < 24; i++) {
      labels.push(labelGenerator(i));
    }
  } else if (period === 'monthly') {
    const daysInMonth = moment().daysInMonth();
    for (let i = 1; i <= daysInMonth; i++) {
      labels.push(labelGenerator(i));
    }
  }

  return labels;
};

const width = 1280;
const height = 1024;

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  plugins: {
    modern: [ChartDataLabels],
  },
});

export const generateHistogram = async ({ model, key, period, title, threshold = 15000 }) => {
  try {
    const { startDate, endDate, groupFormat, labelGenerator } = getDateRangeAndLabelGenerator(period);

    const reportData = await model.find({
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    if (reportData.length === 0) {
      return null;
    }

    const groupedData = {};
    reportData.forEach((entry) => {
      const group = moment(entry.timestamp).format(groupFormat);
      if (!groupedData[group]) {
        groupedData[group] = [];
      }
      const value = entry.data.get(key) || 0;
      groupedData[group].push(Number(value));
    });

    // Рассчитываем разницу между максимальным и минимальным значением с фильтрацией выбросов
    Object.keys(groupedData).forEach(group => {
      const values = groupedData[group];
      const diff = Math.max(...values) - Math.min(...values);
      groupedData[group] = diff > threshold ? 0 : diff;
    });

    const labels = generateLabels(period, labelGenerator);
    const data = labels.map(label => groupedData[label] || 0);

    const configuration = getChartConfig({ labels, data, title });
    const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

    return imageBuffer;
  } catch (error) {
    console.error('Ошибка при генерации гистограммы:', error);
    return null;
  }
};
