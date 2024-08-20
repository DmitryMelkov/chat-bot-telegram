import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { FurnaceVR1, FurnaceVR2 } from "../models/FurnanceModel.js";

export const generateChartVR1 = async () => {
  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

  const dataVR1 = await FurnaceVR1.find({
    key: 'Температура 1-СК печь ВР1',
    timestamp: { $gte: oneHourAgo.toLocaleString('ru-RU') }
  }).sort({ timestamp: 1 });

  if (dataVR1.length === 0) {
    throw new Error('Нет данных для графика за последний час для ВР1.');
  }

  const timestampsVR1 = dataVR1.map(d => d.timestamp);
  const valuesVR1 = dataVR1.map(d => d.value);

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const config = {
    type: 'line',
    data: {
      labels: timestampsVR1,
      datasets: [{
        label: 'Температура 1-СК печь ВР1',
        data: valuesVR1,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Температура' } }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  if (!buffer || buffer.length === 0) {
    throw new Error('Не удалось создать график для ВР1');
  }

  return buffer;
};

export const generateChartVR2 = async () => {
  const currentTime = new Date();
  const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

  const dataVR2 = await FurnaceVR2.find({
    key: 'Температура 1-СК печь ВР2',
    timestamp: { $gte: oneHourAgo.toLocaleString('ru-RU') }
  }).sort({ timestamp: 1 });

  if (dataVR2.length === 0) {
    throw new Error('Нет данных для графика за последний час для ВР2.');
  }

  const timestampsVR2 = dataVR2.map(d => d.timestamp);
  const valuesVR2 = dataVR2.map(d => d.value);

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
  const config = {
    type: 'line',
    data: {
      labels: timestampsVR2,
      datasets: [{
        label: 'Температура 1-СК печь ВР2',
        data: valuesVR2,
        fill: false,
        borderColor: 'rgb(192, 75, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Время' } },
        y: { title: { display: true, text: 'Температура' } }
      }
    }
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(config);
  if (!buffer || buffer.length === 0) {
    throw new Error('Не удалось создать график для ВР2');
  }

  return buffer;
};
