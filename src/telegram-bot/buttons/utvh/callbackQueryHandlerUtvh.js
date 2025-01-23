import { getButtonsByActionUtvh } from './buttonSetsUtvh.js';
import { generateTableUtvhKotel } from '../../generates/kotli/generatetable.js';
import { Kotel1, Kotel2, Kotel3 } from '../../../models/KotliModel.js';
import { chartGeneratorsUtvh } from './chartGenerators.js';
import { checkAlarms } from '../../generates/kotli/alarms.js';

export const handleCallbackQueryUtvh = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  try {
    if (action === 'utvh_kotel_1' || action === 'utvh_kotel_2' || action === 'utvh_kotel_3') {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите действие для Котла №${kotelNumber}:`;
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
        await bot.editMessageText(`Данные для Котла №${kotelNumber} отсутствуют.`, {
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
      action === 'utvh_kotel_1_alarms' ||
      action === 'utvh_kotel_2_alarms' ||
      action === 'utvh_kotel_3_alarms'
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

      // Проверяем аварийные сигналы
      const alarmsResult = checkAlarms(latestDocument, kotelNumber, currentTime);

      await bot.editMessageText(alarmsResult, {
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
      const messageText = `Выберите тип графика для Котла №${kotelNumber}:`;
      const buttonSet = getButtonsByActionUtvh(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'utvh_kotel_1_level' || action === 'utvh_kotel_2_level' || action === 'utvh_kotel_3_level') {
      const kotelNumber = action.split('_')[2]; // Извлекаем номер котла (1, 2 или 3)
      const messageText = `Выберите временной диапазон для графика уровня Котла №${kotelNumber}:`;
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

      // Отправляем сообщение о генерации графика
      const preloadMessage = await bot.sendMessage(chatId, 'Генерация графика, пожалуйста, подождите...');

      try {
        // Генерируем график
        const chartBuffer = await chartFunction();

        if (chartBuffer) {
          // Отправляем график
          await bot.sendPhoto(chatId, chartBuffer, {
            caption: `График для Котла №${kotelNumber} (${timeRange})`,
          });
        } else {
          // Если график не удалось сгенерировать
          await bot.sendMessage(chatId, 'Не удалось сгенерировать график. Попробуйте позже.');
        }
      } catch (error) {
        console.error(`Ошибка генерации графика:`, error);
        await bot.sendMessage(chatId, 'Произошла ошибка при генерации графика. Пожалуйста, попробуйте позже.');
      } finally {
        // Удаляем сообщение о генерации
        await bot.deleteMessage(chatId, preloadMessage.message_id);
      }

      // Добавляем кнопки возврата
      const returnButtonSet = getButtonsByActionUtvh(`utvh_kotel_${kotelNumber}_${isLevel ? 'level' : 'pressure'}`);
      await bot.sendMessage(chatId, 'Выберите другой график:', {
        reply_markup: { inline_keyboard: returnButtonSet },
      });
    } else if (action.startsWith('utvh_archive_')) {
      const parts = action.split('_'); // Разделяем action на части
      let kotelNumber, archiveType;

      if (parts.length === 4) {
        // Формат: utvh_archive_kotel_1
        archiveType = undefined; // Тип архива не указан
        kotelNumber = parts[3]; // Номер котла
      } else if (parts.length === 5) {
        // Формат: utvh_archive_level_kotel_1
        archiveType = parts[2]; // Тип архива (level или par)
        kotelNumber = parts[4]; // Номер котла
      }

      if (archiveType === 'level' || archiveType === 'par') {
        // Если тип архива указан, запрашиваем дату
        const messageText =
          archiveType === 'level'
            ? `Введите дату в формате dd.mm.yyyy для графика уровня Котла №${kotelNumber}:`
            : `Введите дату в формате dd.mm.yyyy для графика давления Котла №${kotelNumber}:`;

        const requestDateMessage = await bot.sendMessage(chatId, messageText);

        app.locals.userStates = app.locals.userStates || {};
        app.locals.userStates[chatId] = {
          action: `utvh_archive_${archiveType}_kotel_${kotelNumber}`, // Например, utvh_archive_level_kotel_1
          messageId: requestDateMessage.message_id,
          kotelNumber,
          archiveType,
        };
      } else {
        // Если тип архива не указан, показываем меню выбора
        const buttonSet = getButtonsByActionUtvh(`utvh_archive_kotel_${kotelNumber}`);
        await bot.editMessageText(`Выберите тип графика для архива Котла №${kotelNumber}:`, {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: buttonSet },
        });
      }
    } else if (action === 'production_utvh') {
      const buttonSet = getButtonsByActionUtvh(action);
      await bot.editMessageText('Выберите объект:', {
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