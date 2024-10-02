import { NotisVR1, NotisVR2 } from "../../../models/NotisModel.js";
import { createChartConfig, renderChartToBuffer } from "../../chartConfig.js";


const generateDoseChart = async (FurnaceModel, chartTitle, timeRangeInHours, suffix) => {
  const currentTime = new Date();
  const timeRangeInMillis = timeRangeInHours * 60 * 60 * 1000;
  const timeAgo = new Date(currentTime.getTime() - timeRangeInMillis);

  const Keys = [`Нотис ВР${suffix} Кг/час`];

  const datasetsPromises = Keys.map((key) => {
    return FurnaceModel.find({ key, timestamp: { $gte: timeAgo } }).sort({ timestamp: 1 });
  });

  const datasets = await Promise.all(datasetsPromises);

  datasets.forEach((dataset, index) => {
    if (dataset.length === 0) {
      throw new Error(`Нет данных для ${Keys[index]} за выбранный период времени для ${chartTitle}.`);
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

  const labels = ['Доза Кг/час'];

  const config = createChartConfig(timestamps, values, labels, 'Доза (Кг/час)', chartTitle, 200, 1000, 10);
  return renderChartToBuffer(config);
};


// Вызов графика дозы для нотисов за 24 часа
export const generateDose24HourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за сутки', 24, '1');
export const generateDose24HourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за сутки', 24, '2');

// Вызов графика дозы для нотисов за 12 часов
export const generateDose12HourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за 12 часов', 12, '1');
export const generateDose12HourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за 12 часов', 12, '2');

// Вызов графика дозы для нотисов за 1 час
export const generateDoseOneHourChartVR1 = () =>
  generateDoseChart(NotisVR1, 'График дозы нотиса печи карбонизации №1 за последний час', 1, '1');
export const generateDoseOneHourChartVR2 = () =>
  generateDoseChart(NotisVR2, 'График дозы нотиса печи карбонизации №2 за последний час', 1, '2');
