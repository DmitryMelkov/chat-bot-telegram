import { generateDoseChartArchiveVR1, generateDoseChartArchiveVR2 } from '../../generates/notis/generateArchives.js';
import { generatePressureChartArchiveMPA2, generatePressureChartArchiveMPA3, generateTemperatureChartArchiveMPA2, generateTemperatureChartArchiveMPA3 } from '../../generates/pechiMPA/generateArchives.js';
import {
  generateTemperatureChartArchiveVR1,
  generateTemperatureChartArchiveVR2,
  generatePressureChartArchiveVR1,
  generatePressureChartArchiveVR2,
  generateWaterLevelChartArchiveVR1,
  generateWaterLevelChartArchiveVR2,
} from '../../generates/pechVr/generateArchives.js';

import {
  generateTemperatureChartArchiveSushilka1,
  generateTemperatureChartArchiveSushilka2,
  generatePressureChartArchiveSushilka1,
  generatePressureChartArchiveSushilka2,
} from '../../generates/sushilka/generateArchives.js';

import {
  generateVibrationChartArchiveMill1,
  generateVibrationChartArchiveMill2,
  generateVibrationChartArchiveSBM3,
  generateVibrationChartArchiveYGM9517,
  generateVibrationChartArchiveYCVOK130,
} from '../../generates/mill/generateArchives.js';

import { 
  generateLevelArchiveChartReactorK296, 
  generateTemperatureArchiveChartReactorK296 
} from '../../generates/reactor/generateArchives.js';

// Определяем меню для архивов графиков для Мельниц
const charts_archive_mill = [
  [
    { text: 'Вибрация Мельницы №1', callback_data: 'archive_vibration_mill1' },
    { text: 'Вибрация Мельницы №2', callback_data: 'archive_vibration_mill2' },
  ],
  [
    { text: 'Вибрация Мельниц к.10б', callback_data: 'charts_archive_mill10b' },
    { text: 'Назад', callback_data: 'mill_k296' },
  ],
];

const charts_archive_mill10b = [
  [
    { text: 'Вибрация ШБМ №3', callback_data: 'archive_vibration_sbm3' },
    { text: 'Вибрация YGM-9517', callback_data: 'archive_vibration_ygm9517' },
  ],
  [
    { text: 'Вибрация YCVOK-130', callback_data: 'archive_vibration_ycvok130' },
    { text: 'Назад', callback_data: 'charts_archive_mill' },
  ],
];

// Определяем меню для архивов графиков для Сушилок
const charts_archive_sushilka1 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_sushilka1' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_sushilka1' },
  ],
  [
    { text: 'Назад', callback_data: 'sushilka_1' },
  ],
];

const charts_archive_sushilka2 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_sushilka2' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_sushilka2' },
  ],
  [
    { text: 'Назад', callback_data: 'sushilka_2' },
  ],
];

// Определяем меню для печи 1
const charts_archive_vr1 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_vr1' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_vr1' },
  ],
  [
    { text: 'Уровень', callback_data: 'archive_level_vr1' },
    { text: 'Нотисы', callback_data: 'archive_dose_vr1' },  // Добавляем кнопку для архивов нотисов
  ],
  [
    { text: 'Назад', callback_data: 'furnace_vr1' },
  ],
];

// Определяем меню для печи 2
const charts_archive_vr2 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_vr2' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_vr2' },
  ],
  [
    { text: 'Уровень', callback_data: 'archive_level_vr2' },
    { text: 'Нотисы', callback_data: 'archive_dose_vr2' },  // Добавляем кнопку для архивов нотисов
  ],
  [
    { text: 'Назад', callback_data: 'furnace_vr2' },
  ],
];

// Определяем меню для архивов графиков для МПА2
const charts_archive_mpa2 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_mpa2' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_mpa2' },
  ],
  [
    { text: 'Назад', callback_data: 'furnace_mpa2' },
  ],
];

// Определяем меню для архивов графиков для МПА3
const charts_archive_mpa3 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_mpa3' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_mpa3' },
  ],
  [
    { text: 'Назад', callback_data: 'furnace_mpa3' },
  ],
];

const charts_archive_reactor = [
  [
    {text: 'Температура', callback_data: 'archive_temperature_reactor'},
    {text: 'Уровень', callback_data: 'archive_level_reactor'},
  ],
  [
    {text: 'Назад', callback_data: 'reactor_k296'},
  ]
];

export const handleTextMessage = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text; // Дата или число, введенное пользователем

  // Проверяем состояние пользователя
  const state = app.locals.userStates && app.locals.userStates[chatId];

  if (state) {
    let furnaceNumber;
    let furnaceType;
    let menu;

    if (state.action.includes('vr1') || state.action.includes('vr2')) {
      furnaceNumber = state.action.includes('vr1') ? 1 : 2;
      furnaceType = 'vr'; // Определяем тип печи как 'vr'
      menu = furnaceNumber === 1 ? charts_archive_vr1 : charts_archive_vr2;
    } else if (state.action.includes('mpa2') || state.action.includes('mpa3')) {
      furnaceNumber = state.action.includes('mpa2') ? 2 : 3;
      furnaceType = 'mpa'; // Определяем тип печи как 'mpa'
      menu = furnaceNumber === 2 ? charts_archive_mpa2 : charts_archive_mpa3;
    } else if (state.action.includes('sushilka1') || state.action.includes('sushilka2')) {
      furnaceNumber = state.action.includes('sushilka1') ? 1 : 2;
      furnaceType = 'sushilka'; // Определяем тип оборудования как 'sushilka'
      menu = furnaceNumber === 1 ? charts_archive_sushilka1 : charts_archive_sushilka2;
    }

    let loadingMessage;

    try {
      // Определяем нужную функцию для генерации графика
      let generateChartForDate;

      if (state.action.startsWith('archive_temperature_vr')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateTemperatureChartArchiveVR1(userMessage)
          : () => generateTemperatureChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_pressure_vr')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generatePressureChartArchiveVR1(userMessage)
          : () => generatePressureChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_level_vr')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateWaterLevelChartArchiveVR1(userMessage)
          : () => generateWaterLevelChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_dose_vr')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateDoseChartArchiveVR1(userMessage)
          : () => generateDoseChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_temperature_mpa')) {
        generateChartForDate = furnaceNumber === 2
          ? () => generateTemperatureChartArchiveMPA2(userMessage)
          : () => generateTemperatureChartArchiveMPA3(userMessage);
      } else if (state.action.startsWith('archive_pressure_mpa')) {
        generateChartForDate = furnaceNumber === 2
          ? () => generatePressureChartArchiveMPA2(userMessage)
          : () => generatePressureChartArchiveMPA3(userMessage);
      } 
      // Добавляем обработку архивных графиков для сушилок
      else if (state.action.startsWith('archive_temperature_sushilka')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateTemperatureChartArchiveSushilka1(userMessage)
          : () => generateTemperatureChartArchiveSushilka2(userMessage);
      } else if (state.action.startsWith('archive_pressure_sushilka')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generatePressureChartArchiveSushilka1(userMessage)
          : () => generatePressureChartArchiveSushilka2(userMessage);
      } else if (state.action.startsWith('archive_vibration_mill1')) {
        generateChartForDate = () => generateVibrationChartArchiveMill1(userMessage);
        menu = charts_archive_mill;
      } else if (state.action.startsWith('archive_vibration_mill2')) {
        generateChartForDate = () => generateVibrationChartArchiveMill2(userMessage);
        menu = charts_archive_mill;
      } else if (state.action.startsWith('archive_vibration_sbm3')) {
        generateChartForDate = () => generateVibrationChartArchiveSBM3(userMessage);
        menu = charts_archive_mill10b;
      } else if (state.action.startsWith('archive_vibration_ygm9517')) {
        generateChartForDate = () => generateVibrationChartArchiveYGM9517(userMessage);
        menu = charts_archive_mill10b;
      } else if (state.action.startsWith('archive_vibration_ycvok130')) {
        generateChartForDate = () => generateVibrationChartArchiveYCVOK130(userMessage);
        menu = charts_archive_mill10b;
      } else if (state.action.startsWith('archive_temperature_reactor')) {
        generateChartForDate = () => generateTemperatureArchiveChartReactorK296(userMessage);
        menu = charts_archive_reactor;
      } else if (state.action.startsWith('archive_level_reactor')) {
        generateChartForDate = () => generateLevelArchiveChartReactorK296(userMessage);
        menu = charts_archive_reactor;
      } else {
        throw new Error('Unknown action type.');
      }
      

      console.log('Generating chart with:', generateChartForDate);

      // Отправляем сообщение "Загрузка графика"
      loadingMessage = await bot.sendMessage(chatId, 'Загрузка графика, пожалуйста подождите...');

      const buffer = await generateChartForDate();

      // Отправляем график
      await bot.sendPhoto(chatId, buffer);

      // Удаляем сообщение "Загрузка графика"
      await bot.deleteMessage(chatId, loadingMessage.message_id);

      // Определяем описание сообщения с включением введенной пользователем даты
      let description;
      if (state.action.startsWith('archive_temperature')) {
        description = `Сгенерирован график температур за ${userMessage}.`;
      } else if (state.action.startsWith('archive_pressure_vr') || state.action.startsWith('archive_pressure_mpa') || state.action.startsWith('archive_pressure_sushilka')) {
        description = `Сгенерирован график давления за ${userMessage}.`;
      } else if (state.action.startsWith('archive_level_vr')) {
        description = `Сгенерирован график уровня воды за ${userMessage}.`;
      } else if (state.action.startsWith('archive_dose_vr')) {
        description = `Сгенерирован график дозы кг/ч за ${userMessage}.`;
      }  else if (state.action.startsWith('archive_vibration')) {
        description = `Сгенерирован график вибрации за ${userMessage}.`;
      } else if (state.action.startsWith ('archive_level_reactor')) {
        description = `Сгенерирован график уровня смолы за ${userMessage}`
      }  else {
        description = 'Генерация графика завершена.';
      }

      // Отправляем текстовое сообщение с описанием
      await bot.sendMessage(chatId, description);

      // Отправляем меню с кнопками
      await bot.sendMessage(chatId, 'Выберите нужный параметр или вернитесь назад:', {
        reply_markup: {
          inline_keyboard: menu
        }
      });

      // Удаляем сообщение с запросом даты
      await bot.deleteMessage(chatId, state.messageId);

      // Очищаем состояние
      delete app.locals.userStates[chatId];
    } catch (error) {
      // Если ошибка произошла, удаляем сообщение "Загрузка графика", если оно было отправлено
      if (loadingMessage) {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
      }

      // Формируем корректное значение для callback_data с учетом типа печи
      await bot.sendMessage(chatId, `Ошибка: нет данных за этот период, либо вы ввели некорректную дату. Пожалуйста, попробуйте еще раз или нажмите "Назад" для выхода.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Назад', callback_data: furnaceType === 'vr'
            ? `furnace_vr${furnaceNumber}`
            : furnaceType === 'mpa'
            ? `furnace_mpa${furnaceNumber}`
            : furnaceType === 'sushilka'
            ? `sushilka_${furnaceNumber}`
            : furnaceType === 'mill'
            ? 'charts_archive_mill'
            : furnaceType === 'reactor'
            ? 'charts_archive_reactor'
            :'default_back_action' 
          }],
          ]
        }
      });
    }
  }
};
