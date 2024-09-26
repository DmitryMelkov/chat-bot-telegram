import { handleAuth } from './auth.js';
import { handleTextMessage } from '../buttons/handleTextMessage.js';

export const handleMessage = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Игнорируем команды, чтобы избежать двойной обработки
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  if (!await handleAuth(bot, chatId, userId)) {
    return;
  }

  await handleTextMessage(bot, app, msg);
};