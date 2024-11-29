import { generateDoseChartArchiveVR1, generateDoseChartArchiveVR2 } from '../../generates/notis/generateArchives.js';
import {
  generateDose12HourChartVR1,
  generateDose12HourChartVR2,
  generateDose24HourChartVR1,
  generateDose24HourChartVR2,
  generateDoseOneHourChartVR1,
  generateDoseOneHourChartVR2,
} from '../../generates/notis/generateCharts.js';
import {
  generatePressure12HourChartMPA2,
  generatePressure12HourChartMPA3,
  generatePressure24HourChartMPA2,
  generatePressure24HourChartMPA3,
  generatePressureOneHourChartMPA2,
  generatePressureOneHourChartMPA3,
  generateTemperature12HourChartMPA2,
  generateTemperature12HourChartMPA3,
  generateTemperature24HourChartMPA2,
  generateTemperature24HourChartMPA3,
  generateTemperatureOneHourChartMPA2,
  generateTemperatureOneHourChartMPA3,
} from '../../generates/pechiMPA/generateCharts.js';
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
} from '../../generates/pechVr/generateCharts.js';
import {
  generateTemperature24HourChartSushilka1,
  generateTemperature24HourChartSushilka2,
  generateTemperature12HourChartSushilka1,
  generateTemperature12HourChartSushilka2,
  generateTemperatureOneHourChartSushilka1,
  generateTemperatureOneHourChartSushilka2,
  generateVacuum24HourChartSushilka1,
  generateVacuum24HourChartSushilka2,
  generateVacuum12HourChartSushilka1,
  generateVacuum12HourChartSushilka2,
  generateVacuumOneHourChartSushilka1,
  generateVacuumOneHourChartSushilka2,
} from '../../generates/sushilka/generateCharts.js';

import {
  generateVibrationChartMill1,
  generateVibrationChartMill2,
  generateVibrationChartYGM9517,
  generateVibrationChartSBM3,
  generateVibrationChartYCVOK130,
} from '../../generates/mill/generateCharts.js';

import { generateLevelChartReactorK296, generateTemperatureChartReactorK296 } from '../../generates/reactor/generateCharts.js';

export const chartGenerators = {
  // Для ВР1
  chart_temperature_vr1_Day: (params) => generateTemperature24HourChartVR1(params),
  chart_temperature_vr1_Twelve: (params) => generateTemperature12HourChartVR1(params),
  chart_temperature_vr1_Hour: (params) => generateTemperatureOneHourChartVR1(params),

  chart_pressure_vr1_Day: (params) => generatePressure24HourChartVR1(params),
  chart_pressure_vr1_Twelve: (params) => generatePressure12HourChartVR1(params),
  chart_pressure_vr1_Hour: (params) => generatePressureOneHourChartVR1(params),

  chart_level_vr1_Day: (params) => generateLevel24HourChartVR1(params),
  chart_level_vr1_Twelve: (params) => generateLevel12HourChartVR1(params),
  chart_level_vr1_Hour: (params) => generateLevelOneHourChartVR1(params),

  // Для ВР2
  chart_temperature_vr2_Day: (params) => generateTemperature24HourChartVR2(params),
  chart_temperature_vr2_Twelve: (params) => generateTemperature12HourChartVR2(params),
  chart_temperature_vr2_Hour: (params) => generateTemperatureOneHourChartVR2(params),

  chart_pressure_vr2_Day: (params) => generatePressure24HourChartVR2(params),
  chart_pressure_vr2_Twelve: (params) => generatePressure12HourChartVR2(params),
  chart_pressure_vr2_Hour: (params) => generatePressureOneHourChartVR2(params),

  chart_level_vr2_Day: (params) => generateLevel24HourChartVR2(params),
  chart_level_vr2_Twelve: (params) => generateLevel12HourChartVR2(params),
  chart_level_vr2_Hour: (params) => generateLevelOneHourChartVR2(params),

  // Для МПА2
  chart_temperature_mpa2_Day: (params) => generateTemperature24HourChartMPA2(params),
  chart_temperature_mpa2_Twelve: (params) => generateTemperature12HourChartMPA2(params),
  chart_temperature_mpa2_Hour: (params) => generateTemperatureOneHourChartMPA2(params),

  chart_pressure_mpa2_Day: (params) => generatePressure24HourChartMPA2(params),
  chart_pressure_mpa2_Twelve: (params) => generatePressure12HourChartMPA2(params),
  chart_pressure_mpa2_Hour: (params) => generatePressureOneHourChartMPA2(params),

  // Для МПА3
  chart_temperature_mpa3_Day: (params) => generateTemperature24HourChartMPA3(params),
  chart_temperature_mpa3_Twelve: (params) => generateTemperature12HourChartMPA3(params),
  chart_temperature_mpa3_Hour: (params) => generateTemperatureOneHourChartMPA3(params),

  chart_pressure_mpa3_Day: (params) => generatePressure24HourChartMPA3(params),
  chart_pressure_mpa3_Twelve: (params) => generatePressure12HourChartMPA3(params),
  chart_pressure_mpa3_Hour: (params) => generatePressureOneHourChartMPA3(params),

  // Температура Сушилка 1
  chart_temperature_sushilka1_Hour: (params) => generateTemperatureOneHourChartSushilka1(params),
  chart_temperature_sushilka1_Twelve: (params) => generateTemperature12HourChartSushilka1(params),
  chart_temperature_sushilka1_Day: (params) => generateTemperature24HourChartSushilka1(params),

  // Давление/разрежение Сушилка 1
  chart_pressure_sushilka1_Hour: (params) => generateVacuumOneHourChartSushilka1(params),
  chart_pressure_sushilka1_Twelve: (params) => generateVacuum12HourChartSushilka1(params),
  chart_pressure_sushilka1_Day: (params) => generateVacuum24HourChartSushilka1(params),

  // Температура Сушилка 2
  chart_temperature_sushilka2_Hour: (params) => generateTemperatureOneHourChartSushilka2(params),
  chart_temperature_sushilka2_Twelve: (params) => generateTemperature12HourChartSushilka2(params),
  chart_temperature_sushilka2_Day: (params) => generateTemperature24HourChartSushilka2(params),

  // Давление/разрежение Сушилка 2
  chart_pressure_sushilka2_Hour: (params) => generateVacuumOneHourChartSushilka2(params),
  chart_pressure_sushilka2_Twelve: (params) => generateVacuum12HourChartSushilka2(params),
  chart_pressure_sushilka2_Day: (params) => generateVacuum24HourChartSushilka2(params),
};

chartGenerators['chart_dose_vr1_Day'] = (params) => generateDose24HourChartVR1(params);
chartGenerators['chart_dose_vr1_Twelve'] = (params) => generateDose12HourChartVR1(params);
chartGenerators['chart_dose_vr1_Hour'] = (params) => generateDoseOneHourChartVR1(params);

chartGenerators['chart_dose_vr2_Day'] = (params) => generateDose24HourChartVR2(params);
chartGenerators['chart_dose_vr2_Twelve'] = (params) => generateDose12HourChartVR2(params);
chartGenerators['chart_dose_vr2_Hour'] = (params) => generateDoseOneHourChartVR2(params);

chartGenerators['archive_dose_vr1'] = (params) => generateDoseChartArchiveVR1(params);
chartGenerators['archive_dose_vr2'] = (params) => generateDoseChartArchiveVR2(params);

chartGenerators['chart_vibration_mill1'] = (params) => generateVibrationChartMill1(params);
chartGenerators['chart_vibration_mill2'] = (params) => generateVibrationChartMill2(params);

chartGenerators['chart_vibration_ygm9517'] = (params) => generateVibrationChartYGM9517(params);
chartGenerators['chart_vibration_sbm3'] = (params) => generateVibrationChartSBM3(params);
chartGenerators['chart_vibration_ycvok130'] = (params) => generateVibrationChartYCVOK130(params);

chartGenerators['chart_temperature_reactor'] = (params) => generateTemperatureChartReactorK296(params);
chartGenerators['chart_level_reactor'] = (params) => generateLevelChartReactorK296 (params);