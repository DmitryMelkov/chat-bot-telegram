import { getButtonsByActionSizod } from './buttonSetsSizod.js';
import { handleChartGeneration } from '../chartHandlers.js';
import { generateTableDotEko, dotEkoKeys } from '../../generates/dot-eko/generatetable.js';

export const handleCallbackQuerySizod = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  try {
    if (action === 'sizod_dot_eko' || action === 'sizod_dot_pro') {
      const furnaceType = action === 'sizod_dot_eko' ? 'Дот-Эко' : 'Дот-Про';
      const messageText = `Выберите действие для ${furnaceType}:`;
      const buttonSet = getButtonsByActionSizod(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_get_params_eko') {
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      // Формируем кнопки для ответа
      const buttonSet = [
        [{ text: 'Обновить', callback_data: 'sizod_get_params_eko' }],
        [{ text: 'Назад', callback_data: 'sizod_dot_eko' }],
      ];

      // Проверяем, что все ключи присутствуют в данных
      const hasDotEkoData = dotEkoKeys.every(key => data.hasOwnProperty(key));

      if (!hasDotEkoData) {
        // Если данных нет, отправляем сообщение об отсутствии данных с кнопками
        await bot.editMessageText('Данные для ДОТ-ЭКО отсутствуют.', {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: buttonSet },
        });
        return;
      }

      // Генерируем таблицу с параметрами для ДОТ-ЭКО
      const table = generateTableDotEko(data, currentTime);

      // Отправляем или обновляем сообщение с параметрами и кнопками
      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_report_eko') {
      await bot.sendMessage(chatId, 'Отчет для Дот-Эко');
    } else if (action.startsWith('sizod_charts_eko')) {
      await handleChartGeneration(bot, chatId, action);
    } else if (action.startsWith('sizod_archive_')) {
      // Логика для архивов (если нужно)
      await bot.sendMessage(chatId, 'Архив графиков еще не реализован для "Сизод".');
    } else {
      const actionMap = {
        sizod_dot_eko: 'Дот-Эко',
        sizod_dot_pro: 'Дот-Про',
        back_to_sizod: 'Выберите интересующую опцию:',
      };

      const messageText = actionMap[action] || 'Выберите интересующую опцию:';
      const buttonSet = getButtonsByActionSizod(action);

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
