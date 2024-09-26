import { handleAuth } from './auth.js';
import { handleCallbackQuery } from '../buttons/callbackQueryHandler.js';

export const handleCallback = async (bot, app, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  if (!await handleAuth(bot, chatId, userId)) {
    await bot.answerCallbackQuery(query.id, {
      text: `У вас нет доступа к этому боту. Пользователь: ${getUserSurname(userId)}`,
      show_alert: true,
    });
    return;
  }

  handleCallbackQuery(bot, app, query);
};