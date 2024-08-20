import { sendMessageWithButtons } from './sendMessage.js';
import { editMessageWithButtons } from './editMessage.js';
import { generateTablePechVr } from './generateTable.js';
import { checkAndNotify } from './alarms.js';
import {
  generateTemperatureChartVR1,
  generateTemperatureChartVR2,
  generatePressureChartVR1,
  generatePressureChartVR2,
  generateWaterLevelChartVR1,
  generateWaterLevelChartVR2,
} from './generateCharts.js';

export const handleMessage = (bot, chatId) => {
  sendMessageWithButtons(bot, chatId, 'Выберите интересующую опцию:', [
    [{ text: 'Производство Карбон', callback_data: 'production_carbon' }],
  ]);
};

export const handleCallbackQuery = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;
  const currentTime = new Date().toLocaleString();
  const data = app.locals.data;

  const buttons = {
    furnace_1: [
      [
        { text: 'Текущие параметры', callback_data: 'get_temperature_1' },
        { text: 'Графики', callback_data: 'charts_1' },
        { text: 'Алармы', callback_data: 'check_alarms_1' },
      ],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],
    furnace_2: [
      [
        { text: 'Текущие параметры', callback_data: 'get_temperature_2' },
        { text: 'Графики', callback_data: 'charts_2' },
        { text: 'Алармы', callback_data: 'check_alarms_2' },
      ],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],
    production_carbon: [
      [
        { text: 'Печь карбонизации 1', callback_data: 'furnace_1' },
        { text: 'Печь карбонизации 2', callback_data: 'furnace_2' },
      ],
      [{ text: 'Назад', callback_data: 'back_to_production' }],
    ],
    charts_1: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_1' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_1' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_1' },
        { text: 'Назад', callback_data: 'furnace_1' },
      ],
    ],
    charts_2: [
      [
        { text: 'Температура', callback_data: 'chart_temperature_2' },
        { text: 'Давление/разрежение', callback_data: 'chart_pressure_2' },
      ],
      [
        { text: 'Уровень', callback_data: 'chart_level_2' },
        { text: 'Назад', callback_data: 'furnace_2' },
      ],
    ],
    back_to_production: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
  };

  if (action === 'get_temperature_1' || action === 'get_temperature_2') {
    const furnaceNumber = action === 'get_temperature_1' ? 1 : 2;
    const table = generateTablePechVr(data, furnaceNumber, currentTime);
    editMessageWithButtons(bot, chatId, query.message.message_id, table, [
      [
        { text: 'Алармы', callback_data: `check_alarms_${furnaceNumber}` },
        { text: 'Обновить', callback_data: action },
      ],
      [{ text: 'Назад', callback_data: `furnace_${furnaceNumber}` }],
    ]);
  } else if (action.startsWith('check_alarms_')) {
    const furnaceNumber = action === 'check_alarms_1' ? 1 : 2;
    checkAndNotify(data, bot, chatId, furnaceNumber, query.message.message_id);
  } else if (action === 'chart_temperature_1') {
    try {
      const chartBuffer = await generateTemperatureChartVR1(); // Генерируем график для ВР1
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График для ВР1 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График температуры для печи ВР1 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_1'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика ВР1:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else if (action === 'chart_temperature_2') {
    try {
      const chartBuffer = await generateTemperatureChartVR2(); // Генерируем график для ВР2
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График для ВР2 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График температуры для печи ВР2 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_2'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика ВР2:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else if (action === 'chart_pressure_1') {
    try {
      const chartBuffer = await generatePressureChartVR1(); // Генерируем график давления/разрежения для ВР1
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График давления/разрежения для ВР1 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График давления/разрежения для печи ВР1 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_1'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика ВР1:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else if (action === 'chart_pressure_2') {
    try {
      const chartBuffer = await generatePressureChartVR2(); // Генерируем график давления/разрежения для ВР2
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График давления/разрежения для ВР2 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График давления/разрежения для печи ВР2 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_2'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика ВР2:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else if (action === 'chart_level_1') {
    try {
      const chartBuffer = await generateWaterLevelChartVR1(); // Генерация графика уровня воды для ВР1
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График уровня воды для ВР1 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График уровня воды для печи ВР1 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_1'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика уровня воды ВР1:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else if (action === 'chart_level_2') {
    try {
      const chartBuffer = await generateWaterLevelChartVR2(); // Генерация графика уровня воды для ВР2
      if (!chartBuffer || chartBuffer.length === 0) {
        throw new Error('График уровня воды для ВР2 не был создан.');
      }
      await bot.sendPhoto(chatId, chartBuffer, {
        caption: `График уровня воды для печи ВР2 за последний час`,
        reply_markup: {
          inline_keyboard: buttons['charts_2'],
        },
      });
    } catch (error) {
      console.error('Ошибка при генерации или отправке графика уровня воды ВР2:', error);
      await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
    }
  } else {
    const buttonSet = buttons[action] || buttons.back_to_production;
    sendMessageWithButtons(bot, chatId, 'Выберите интересующую опцию:', buttonSet);
  }
};
