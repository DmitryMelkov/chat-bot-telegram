import { generateDoseChartArchiveVR1, generateDoseChartArchiveVR2 } from '../generates/notis/generateArchives.js';
import {
  generateTemperatureChartArchiveVR1,
  generateTemperatureChartArchiveVR2,
  generatePressureChartArchiveVR1,
  generatePressureChartArchiveVR2,
  generateWaterLevelChartArchiveVR1,
  generateWaterLevelChartArchiveVR2,
} from '../generates/pechVr/generateArchives.js';

// Определяем меню для печи 1
const charts_archive_1 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_1' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_1' },
  ],
  [
    { text: 'Уровень', callback_data: 'archive_level_1' },
    { text: 'Нотисы', callback_data: 'archive_dose_1' },  // Добавляем кнопку для архивов нотисов
  ],
  [
    { text: 'Назад', callback_data: 'furnace_1' },
  ],
];

// Определяем меню для печи 2
const charts_archive_2 = [
  [
    { text: 'Температура', callback_data: 'archive_temperature_2' },
    { text: 'Давление/разрежение', callback_data: 'archive_pressure_2' },
  ],
  [
    { text: 'Уровень', callback_data: 'archive_level_2' },
    { text: 'Нотисы', callback_data: 'archive_dose_2' },  // Добавляем кнопку для архивов нотисов
  ],
  [
    { text: 'Назад', callback_data: 'furnace_2' },
  ],
];

export const handleTextMessage = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text; // Дата или число, введенное пользователем

  // Проверяем состояние пользователя
  const state = app.locals.userStates && app.locals.userStates[chatId];

  if (state) {
    const furnaceNumber = state.action.includes('1') ? 1 : 2;

    // Определяем нужное меню
    const menu = furnaceNumber === 1 ? charts_archive_1 : charts_archive_2;

    let loadingMessage; // Переменная для хранения сообщения "Загрузка графика"

    try {
      // Определяем нужную функцию для генерации графика
      let generateChartForDate;

      if (state.action.startsWith('archive_temperature_')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateTemperatureChartArchiveVR1(userMessage)
          : () => generateTemperatureChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_pressure_')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generatePressureChartArchiveVR1(userMessage)
          : () => generatePressureChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_level_')) {
        generateChartForDate = furnaceNumber === 1
          ? () => generateWaterLevelChartArchiveVR1(userMessage)
          : () => generateWaterLevelChartArchiveVR2(userMessage);
      } else if (state.action.startsWith('archive_dose_')) {  // Добавляем обработку архивов нотисов
        generateChartForDate = furnaceNumber === 1
          ? () => generateDoseChartArchiveVR1(userMessage)
          : () => generateDoseChartArchiveVR2(userMessage);
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
      if (state.action.startsWith('archive_temperature_')) {
        description = `Сгенерирован график температур за ${userMessage}.`;
      } else if (state.action.startsWith('archive_pressure_')) {
        description = `Сгенерирован график давления за ${userMessage}.`;
      } else if (state.action.startsWith('archive_level_')) {
        description = `Сгенерирован график уровня воды за ${userMessage}.`;
      } else if (state.action.startsWith('archive_dose_')) {
        description = `Сгенерирован график дозы кг/ч за ${userMessage}.`;
      } else {
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

      await bot.sendMessage(chatId, `Ошибка: нет данных за этот период, либо вы ввели некорректную дату. Пожалуйста, попробуйте еще раз или нажмите "Назад" для выхода.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Назад', callback_data: `furnace_${furnaceNumber}` }]
          ]
        }
      });
    }
  }
};
