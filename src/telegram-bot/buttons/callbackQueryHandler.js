import { getButtonsByAction } from '../buttons/buttonSets.js';
import { handleCallbackQuerySizod } from './sizod/callbackQueryHandlerSizod.js'; // Импорт нового обработчика
import { handleChartGeneration } from '../buttons/chartHandlers.js';
import { generateTablePechVr } from '../generates/pechVr/generatetable.js';
import { checkAndNotify } from '../generates/pechVr/alarms.js';
import { chartGenerators } from '../buttons/chartGenerators.js';
import { handleHelp } from '../commands/help.js';
import { generateDoseTableNotis } from '../generates/notis/generateTable.js';
import { NotisVR1, NotisVR2 } from '../../models/NotisModel.js';
import { checkLoading, getLastValuesNotis } from '../../routes/updateValues.js';
import { generateTableMpa } from '../generates/pechiMPA/generatetable.js';

export const handleCallbackQuery = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

// Если действие связано с Сизод
if (action.startsWith('sizod_') || action.includes('sizod')) {
  await handleCallbackQuerySizod(bot, app, query);
  return;
}


  try {
    if (action.startsWith('get_params_vr')) {
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      const table = generateTablePechVr(data, furnaceNumber, currentTime);
      const buttonSet = [
        [{ text: 'Алармы', callback_data: `check_alarms_vr${furnaceNumber}` }],
        [{ text: 'Обновить', callback_data: action }],
        [{ text: 'Назад', callback_data: `furnace_vr${furnaceNumber}` }],
      ];

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action.startsWith('check_alarms_')) {
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      const data = app.locals.data;
      await checkAndNotify(data, bot, chatId, furnaceNumber, query.message.message_id);
    } else if (action.startsWith('archive_')) {
      let chartType;
      let chartTitle;
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      if (action.startsWith('archive_temperature_')) {
        chartType = 'температуры';
        chartTitle = `График температуры печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_pressure_')) {
        chartType = 'давление/разрежение';
        chartTitle = `График давления ${furnaceNumber === 1 ? '1' : '2'} за сутки`;
      } else if (action.startsWith('archive_level_')) {
        chartType = 'уровня';
        chartTitle = `График уровня ${furnaceNumber === 1 ? '1' : '2'} за сутки`;
      } else if (action.startsWith('archive_dose_')) {
        // Добавляем обработку архивов дозы
        chartType = 'Доза (Кг/час)';
        chartTitle = `График Доза ВР${furnaceNumber} за сутки`;
      }
      app.locals.userStates = app.locals.userStates || {};
      const requestDateMessage = await bot.sendMessage(
        chatId,
        `Введите дату в формате dd.mm.yyyy для графика ${chartType}.`
      );
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
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      const data = app.locals.data;

      // Получаем последние 5 значений "Кг/час"
      const lastFiveValues = await getLastValuesNotis(
        furnaceNumber === 1 ? NotisVR1 : NotisVR2,
        `Нотис ВР${furnaceNumber} Кг/час`
      );

      // Проверяем статус загрузки нотиса
      const loadStatus = checkLoading(lastFiveValues);

      // Генерация таблицы дозатора с учетом статуса работы
      const doseTable = generateDoseTableNotis(data, furnaceNumber, loadStatus);

      const buttonSet = [
        [
          { text: 'Обновить', callback_data: action },
          { text: 'Назад', callback_data: `furnace_vr${furnaceNumber}` },
        ],
      ];
      await bot.editMessageText(doseTable, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action.startsWith('get_params_mpa2') || action.startsWith('get_params_mpa3')) {
      const mpaNumber = action.includes('mpa2') ? 2 : 3;
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      // Генерация таблицы для печей МПА2 и МПА3
      const table = generateTableMpa(data, mpaNumber, currentTime);

      // Кнопки "Обновить" и "Назад"
      const buttonSet = [
        [
          { text: 'Обновить', callback_data: `get_params_mpa${mpaNumber}` },
          { text: 'Назад', callback_data: `furnace_mpa${mpaNumber}` },
        ],
      ];

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else {
      const actionMap = {
        furnace_vr1: 'Печь карбонизации №1',
        furnace_vr2: 'Печь карбонизации №2',
        furnace_mpa2: 'Печь МПА2',
        furnace_mpa3: 'Печь МПА3',
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
