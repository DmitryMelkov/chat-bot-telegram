import { handleAuth } from './auth.js';
import { handleTextMessage } from '../buttons/carbon/handleTextMessage.js';
import { handleTextMessageSizod } from '../buttons/sizod/handleTextMessageSizod.js'; // Подключаем обработчик для Sizod

export const handleMessage = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Игнорируем команды, чтобы избежать двойной обработки
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  // Проверка авторизации пользователя
  if (!await handleAuth(bot, chatId, userId)) {
    return;
  }

  // Вызов обработки сообщений для архива отчетов Sizod
  const state = app.locals.userStates && app.locals.userStates[chatId];
  if (state && state.action === 'sizod_archive_report') {
    // Если ожидается ввод даты для архива отчетов в Sizod
    await handleTextMessageSizod(bot, app, msg);
  } else {
    // Если это другое сообщение, обрабатываем его стандартной функцией
    await handleTextMessage(bot, app, msg);
  }
};
