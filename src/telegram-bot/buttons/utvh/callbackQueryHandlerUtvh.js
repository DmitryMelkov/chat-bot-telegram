import { getButtonsByActionUtvh } from './buttonSetsUtvh.js';
import { generateTableUtvhKotel } from '../../generates/kotli/generatetable.js';
import { Kotel1, Kotel2, Kotel3 } from '../../../models/KotliModel.js';
import { chartGeneratorsUtvh } from './chartGenerators.js';

export const handleCallbackQueryUtvh = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  try {
    if (action === 'utvh_kotel_1' || action === 'utvh_kotel_2' || action === 'utvh_kotel_3') {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите действие для Котла ${kotelNumber}:`;
      const buttonSet = getButtonsByActionUtvh(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (
      action === 'utvh_kotel_1_params' ||
      action === 'utvh_kotel_2_params' ||
      action === 'utvh_kotel_3_params'
    ) {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const currentTime = new Date().toLocaleString();

      // Получаем последний документ из базы данных для соответствующего котла
      const model = kotelNumber === '1' ? Kotel1 : kotelNumber === '2' ? Kotel2 : Kotel3;
      const latestDocument = await model.findOne().sort({ timestamp: -1 });

      const buttonSet = [
        [{ text: 'Обновить', callback_data: action }],
        [{ text: 'Назад', callback_data: `utvh_kotel_${kotelNumber}` }],
      ];

      if (!latestDocument) {
        await bot.editMessageText(`Данные для Котла ${kotelNumber} отсутствуют.`, {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: buttonSet },
        });
        return;
      }

      // Генерируем таблицу с использованием новой функции
      const table = generateTableUtvhKotel(latestDocument, kotelNumber, currentTime);

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (
      action === 'utvh_kotel_1_charts' ||
      action === 'utvh_kotel_2_charts' ||
      action === 'utvh_kotel_3_charts'
    ) {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите тип графика для Котла ${kotelNumber}:`;
      const buttonSet = getButtonsByActionUtvh(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'utvh_kotel_1_level' || action === 'utvh_kotel_2_level' || action === 'utvh_kotel_3_level') {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите временной диапазон для графика уровня Котла ${kotelNumber}:`;
      const buttonSet = getButtonsByActionUtvh(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (
      action === 'utvh_kotel_1_pressure' ||
      action === 'utvh_kotel_2_pressure' ||
      action === 'utvh_kotel_3_pressure'
    ) {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите временной диапазон для графика давления Котла ${kotelNumber}:`;
      const buttonSet = getButtonsByActionUtvh(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (
      action.startsWith('utvh_kotel_') &&
      (action.endsWith('_1h') || action.endsWith('_12h') || action.endsWith('_24h'))
    ) {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const timeRange = action.split('_').pop(); // Извлекаем диапазон (1h, 12h, 24h)
      const isLevel = action.includes('level'); // Определяем, это график уровня или давления

      // Определяем ключ для chartGeneratorsUtvh
      const chartKey = isLevel
        ? `chart_level_kotel${kotelNumber}_${timeRange === '1h' ? 'Hour' : timeRange === '12h' ? 'Twelve' : 'Day'}`
        : `chart_pressure_kotel${kotelNumber}_${timeRange === '1h' ? 'Hour' : timeRange === '12h' ? 'Twelve' : 'Day'}`;

      // Получаем функцию генерации графика из chartGeneratorsUtvh
      const chartFunction = chartGeneratorsUtvh[chartKey];

      if (!chartFunction) {
        await bot.sendMessage(chatId, 'Ошибка: не удалось найти генератор графика.');
        return;
      }

      // Генерируем график
      const chartBuffer = await chartFunction();
      await bot.sendPhoto(chatId, chartBuffer);
    } else if (action === 'production_utvh') {
      const buttonSet = getButtonsByActionUtvh(action);
      await bot.editMessageText('Выберите котел:', {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else {
      const messageText = 'Выберите интересующую опцию:';
      const buttonSet = getButtonsByActionUtvh(action);

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