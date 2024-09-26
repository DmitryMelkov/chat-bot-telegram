import { getButtonsByAction } from '../buttons/buttonSets.js';
import { handleChartGeneration } from '../buttons/chartHandlers.js';
import { generateDoseTableNotis, generateTablePechVr } from '../generates/pechVr/generatetable.js';
import { checkAndNotify } from '../generates/pechVr/alarms.js';
import { chartGenerators } from '../buttons/chartGenerators.js'; // Исправленный импорт
import { handleHelp } from '../commands/help.js';

export const handleCallbackQuery = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  try {
    if (action.startsWith('get_temperature_')) {
      const furnaceNumber = action.includes('1') ? 1 : 2;
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      const table = generateTablePechVr(data, furnaceNumber, currentTime);
      const buttonSet = [
        [{ text: 'Алармы', callback_data: `check_alarms_${furnaceNumber}` }],
        [{ text: 'Обновить', callback_data: action }],
        [{ text: 'Назад', callback_data: `furnace_${furnaceNumber}` }],
      ];

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action.startsWith('check_alarms_')) {
      const furnaceNumber = action.includes('1') ? 1 : 2;
      const data = app.locals.data;
      await checkAndNotify(data, bot, chatId, furnaceNumber, query.message.message_id);
    } else if (action.startsWith('archive_')) {
      let chartType;
      let chartTitle;
      const furnaceNumber = action.includes('1') ? 1 : 2;
      if (action.startsWith('archive_temperature_')) {
        chartType = 'температуры';
        chartTitle = `График температуры печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_pressure_')) {
        chartType = 'давление/разрежение';
        chartTitle = `График давления ${furnaceNumber === 1 ? '1' : '2'} за сутки`;
      } else if (action.startsWith('archive_level_')) {
        chartType = 'уровня';
        chartTitle = `График уровня ${furnaceNumber === 1 ? '1' : '2'} за сутки`;
      }
      // Убедитесь, что userStates инициализирован
      app.locals.userStates = app.locals.userStates || {};
      // Запросите дату у пользователя
      const requestDateMessage = await bot.sendMessage(
        chatId,
        `Введите дату в формате dd.mm.yyyy для графика ${chartType}.`
      );
      // Сохраните состояние запроса для последующей обработки
      app.locals.userStates[chatId] = {
        action: `${action}`,
        messageId: requestDateMessage.message_id,
        chartType,
        furnaceNumber,
      };
    } else if (chartGenerators[action]) {
      await handleChartGeneration(bot, chatId, action);
    } else if (action === 'help') {
      await handleHelp(bot, chatId, query.message.message_id);
    } else if (action.startsWith('get_dose_notis_')) {
      const furnaceNumber = action.includes('1') ? 1 : 2;
      const data = app.locals.data;

      const doseTable = generateDoseTableNotis(data, furnaceNumber);

      const buttonSet = [
        [
          { text: 'Обновить', callback_data: action },
          { text: 'Назад', callback_data: `furnace_${furnaceNumber}` },
        ],
      ];
      await bot.editMessageText(doseTable, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else {
      const actionMap = {
        furnace_1: 'Печи карбонизации №1',
        furnace_2: 'Печи карбонизации №2',
        back_to_main: 'Выберите интересующую опцию:',
      };

      const messageText = actionMap[action] || 'Выберите интересующую опцию:';
      const buttonSet = getButtonsByAction(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    }
  } catch (error) {
    console.error(`Ошибка обработки действия ${action}:`, error);
    await bot.sendMessage(chatId, 'Произошла ошибка при выполнении вашего запроса. Пожалуйста, попробуйте позже.');
  }
};
