import { handleAuth } from './auth.js';
import { handleTextMessage } from '../buttons/carbon/handleTextMessage.js';
import { handleTextMessageSizod } from '../buttons/sizod/handleTextMessageSizod.js'; // Подключаем обработчик для Sizod
import { handleTextMessageUtvh } from '../buttons/utvh/handleTextMessageUtvh.js'; // Подключаем обработчик для Utvh

export const handleMessage = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Игнорируем команды, чтобы избежать двойной обработки
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  // Проверка авторизации пользователя
  if (!(await handleAuth(bot, chatId, userId))) {
    return;
  }

  // Получаем состояние пользователя
  const state = app.locals.userStates && app.locals.userStates[chatId];

  // Обработка сообщений для архива отчетов Sizod
  if (state && state.action === 'sizod_archive_report') {
    // Если ожидается ввод даты для архива отчетов в Sizod
    await handleTextMessageSizod(bot, app, msg);
  }
  // Обработка сообщений для архивов Utvh
  else   if (state && state.action.startsWith('utvh_archive_')) {
    // Если ожидается ввод даты для архивов графиков Utvh
    await handleTextMessageUtvh(bot, app, msg);
  }
  // Обработка всех остальных сообщений
  else {
    // Если это другое сообщение, обрабатываем его стандартной функцией
    await handleTextMessage(bot, app, msg);
  }
};
