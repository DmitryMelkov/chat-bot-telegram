import {
  generateLevelChartArchiveKotel1,
  generateLevelChartArchiveKotel2,
  generateLevelChartArchiveKotel3,
  generateParChartArchiveKotel1,
  generateParChartArchiveKotel2,
  generateParChartArchiveKotel3,
} from '../../generates/kotli/generateArchives.js';

// Определяем меню для архивов графиков для котлов
const utvh_archive_kotel_1 = [
  [
    { text: 'Уровень', callback_data: 'utvh_archive_level_kotel_1' },
    { text: 'Давление', callback_data: 'utvh_archive_par_kotel_1' },
  ],
  [
    { text: 'Назад', callback_data: 'utvh_kotel_1' },
  ],
];

const utvh_archive_kotel_2 = [
  [
    { text: 'Уровень', callback_data: 'utvh_archive_level_kotel_2' },
    { text: 'Давление', callback_data: 'utvh_archive_par_kotel_2' },
  ],
  [
    { text: 'Назад', callback_data: 'utvh_kotel_2' },
  ],
];

const utvh_archive_kotel_3 = [
  [
    { text: 'Уровень', callback_data: 'utvh_archive_level_kotel_3' },
    { text: 'Давление', callback_data: 'utvh_archive_par_kotel_3' },
  ],
  [
    { text: 'Назад', callback_data: 'utvh_kotel_3' },
  ],
];

export const handleTextMessageUtvh = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // Проверяем состояние пользователя
  const state = app.locals.userStates && app.locals.userStates[chatId];

  if (state) {
    let kotelNumber;
    let menu;

    // Определяем номер котла и меню на основе state.action
    if (state.action.includes('utvh_kotel_1') || state.action.includes('utvh_kotel_2') || state.action.includes('utvh_kotel_3')) {
      kotelNumber = state.action.includes('utvh_kotel_1') ? 1 : state.action.includes('utvh_kotel_2') ? 2 : 3;
      menu = kotelNumber === 1 ? utvh_archive_kotel_1 : kotelNumber === 2 ? utvh_archive_kotel_2 : utvh_archive_kotel_3;
    } else if (state.action.startsWith('utvh_archive_level_kotel_') || state.action.startsWith('utvh_archive_par_kotel_')) {
      // Извлекаем номер котла из action
      kotelNumber = state.action.split('_')[4]; // Например, utvh_archive_level_kotel_1 -> 1
      menu = kotelNumber === '1' ? utvh_archive_kotel_1 : kotelNumber === '2' ? utvh_archive_kotel_2 : utvh_archive_kotel_3;
    }

    let loadingMessage;

    try {
      // Определяем нужную функцию для генерации графика
      let generateChartForDate;

      if (state.action.startsWith('utvh_archive_level_kotel_')) {
        generateChartForDate = kotelNumber === 1
          ? () => generateLevelChartArchiveKotel1(userMessage)
          : kotelNumber === 2
          ? () => generateLevelChartArchiveKotel2(userMessage)
          : () => generateLevelChartArchiveKotel3(userMessage);
      } else if (state.action.startsWith('utvh_archive_par_kotel_')) {
        generateChartForDate = kotelNumber === 1
          ? () => generateParChartArchiveKotel1(userMessage)
          : kotelNumber === 2
          ? () => generateParChartArchiveKotel2(userMessage)
          : () => generateParChartArchiveKotel3(userMessage);
      } else {
        throw new Error('Unknown action type.');
      }

      console.log('Generating chart with:', generateChartForDate); // Отладочное сообщение

      // Отправляем сообщение "Загрузка графика"
      loadingMessage = await bot.sendMessage(chatId, 'Загрузка графика, пожалуйста подождите...');

      const buffer = await generateChartForDate();

      // Отправляем график
      await bot.sendPhoto(chatId, buffer);

      // Удаляем сообщение "Загрузка графика"
      await bot.deleteMessage(chatId, loadingMessage.message_id);

      // Определяем описание сообщения с включением введенной пользователем даты
      let description;
      if (state.action.startsWith('utvh_archive_level_kotel_')) {
        description = `Сгенерирован график уровня за ${userMessage}.`;
      } else if (state.action.startsWith('utvh_archive_par_kotel_')) {
        description = `Сгенерирован график давления за ${userMessage}.`;
      } else {
        description = 'Генерация графика завершена.';
      }

      // Отправляем текстовое сообщение с описанием
      await bot.sendMessage(chatId, description);

      // Отправляем меню с кнопками
      if (menu) {
        await bot.sendMessage(chatId, 'Выберите нужный параметр или вернитесь назад:', {
          reply_markup: {
            inline_keyboard: menu,
          },
        });
      } else {
        console.error('Menu is undefined'); // Отладочное сообщение
      }

      // Удаляем сообщение с запросом даты
      await bot.deleteMessage(chatId, state.messageId);

      // Очищаем состояние
      delete app.locals.userStates[chatId];
    } catch (error) {
      // Если ошибка произошла, удаляем сообщение "Загрузка графика", если оно было отправлено
      if (loadingMessage) {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
      }

      // Формируем корректное значение для callback_data с учетом типа котла
      await bot.sendMessage(chatId, `Ошибка: нет данных за этот период, либо вы ввели некорректную дату. Пожалуйста, попробуйте еще раз или нажмите "Назад" для выхода.`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Назад', callback_data: `utvh_kotel_${kotelNumber}` }],
          ],
        },
      });
    }
  }
};