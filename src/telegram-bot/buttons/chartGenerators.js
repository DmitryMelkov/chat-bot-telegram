import {
  generateTemperature24HourChartVR1,
  generateTemperature24HourChartVR2,
  generateTemperatureOneHourChartVR1,
  generateTemperatureOneHourChartVR2,
  generateTemperature12HourChartVR1,
  generateTemperature12HourChartVR2,
  generatePressure24HourChartVR1,
  generatePressure24HourChartVR2,
  generatePressureOneHourChartVR1,
  generatePressureOneHourChartVR2,
  generatePressure12HourChartVR1,
  generatePressure12HourChartVR2,
  generateLevel24HourChartVR1,
  generateLevel24HourChartVR2,
  generateLevelOneHourChartVR1,
  generateLevelOneHourChartVR2,
  generateLevel12HourChartVR1,
  generateLevel12HourChartVR2,
} from '../generates/pechVr/generateCharts.js';

export const chartGenerators = {
  chart_temperature_1_Day: (params) => generateTemperature24HourChartVR1(params),
  chart_temperature_1_Twelve: (params) => generateTemperature12HourChartVR1(params),
  chart_temperature_1_Hour: (params) => generateTemperatureOneHourChartVR1(params),

  chart_temperature_2_Day: (params) => generateTemperature24HourChartVR2(params),
  chart_temperature_2_Twelve: (params) => generateTemperature12HourChartVR2(params),
  chart_temperature_2_Hour: (params) => generateTemperatureOneHourChartVR2(params),

  chart_pressure_1_Day: (params) => generatePressure24HourChartVR1(params),
  chart_pressure_1_Twelve: (params) => generatePressure12HourChartVR1(params),
  chart_pressure_1_Hour: (params) => generatePressureOneHourChartVR1(params),

  chart_pressure_2_Day: (params) => generatePressure24HourChartVR2(params),
  chart_pressure_2_Twelve: (params) => generatePressure12HourChartVR2(params),
  chart_pressure_2_Hour: (params) => generatePressureOneHourChartVR2(params),

  chart_level_1_Day: (params) => generateLevel24HourChartVR1(params),
  chart_level_1_Twelve: (params) => generateLevel12HourChartVR1(params),
  chart_level_1_Hour: (params) => generateLevelOneHourChartVR1(params),

  chart_level_2_Day: (params) => generateLevel24HourChartVR2(params),
  chart_level_2_Twelve: (params) => generateLevel12HourChartVR2(params),
  chart_level_2_Hour: (params) => generateLevelOneHourChartVR2(params),
};
