import {
  generateLevel12HourChartKotel1,
  generateLevel12HourChartKotel2,
  generateLevel12HourChartKotel3,
  generateLevel1HourChartKotel1,
  generateLevel1HourChartKotel2,
  generateLevel1HourChartKotel3,
  generateLevel24HourChartKotel1,
  generateLevel24HourChartKotel2,
  generateLevel24HourChartKotel3,
  generatePressure12HourChartKotel1,
  generatePressure12HourChartKotel2,
  generatePressure12HourChartKotel3,
  generatePressure1HourChartKotel1,
  generatePressure1HourChartKotel2,
  generatePressure1HourChartKotel3,
  generatePressure24HourChartKotel1,
  generatePressure24HourChartKotel2,
  generatePressure24HourChartKotel3,
} from '../../generates/kotli/generateCharts.js';

// Экспорт объекта chartGeneratorsUtvh
export const chartGeneratorsUtvh = {
  // Для Котла 1
  chart_level_kotel1_Day: () => generateLevel24HourChartKotel1(),
  chart_level_kotel1_Twelve: () => generateLevel12HourChartKotel1(),
  chart_level_kotel1_Hour: () => generateLevel1HourChartKotel1(),

  chart_pressure_kotel1_Day: () => generatePressure24HourChartKotel1(),
  chart_pressure_kotel1_Twelve: () => generatePressure12HourChartKotel1(),
  chart_pressure_kotel1_Hour: () => generatePressure1HourChartKotel1(),

  // Для Котла 2
  chart_level_kotel2_Day: () => generateLevel24HourChartKotel2(),
  chart_level_kotel2_Twelve: () => generateLevel12HourChartKotel2(),
  chart_level_kotel2_Hour: () => generateLevel1HourChartKotel2(),

  chart_pressure_kotel2_Day: () => generatePressure24HourChartKotel2(),
  chart_pressure_kotel2_Twelve: () => generatePressure12HourChartKotel2(),
  chart_pressure_kotel2_Hour: () => generatePressure1HourChartKotel2(),

  // Для Котла 3
  chart_level_kotel3_Day: () => generateLevel24HourChartKotel3(),
  chart_level_kotel3_Twelve: () => generateLevel12HourChartKotel3(),
  chart_level_kotel3_Hour: () => generateLevel1HourChartKotel3(),

  chart_pressure_kotel3_Day: () => generatePressure24HourChartKotel3(),
  chart_pressure_kotel3_Twelve: () => generatePressure12HourChartKotel3(),
  chart_pressure_kotel3_Hour: () => generatePressure1HourChartKotel3(),
};
