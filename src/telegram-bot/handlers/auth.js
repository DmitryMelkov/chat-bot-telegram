import { checkAuthorization, getUserSurname } from '../utils.js';

export const handleAuth = async (bot, chatId, userId) => {
  if (!checkAuthorization(userId)) {
    await bot.sendMessage(chatId, `У вас нет доступа к этому боту. Обратитесь к администратору. Вы - ${getUserSurname(userId)} пользователь`);
    return false;
  }
  return true;
};