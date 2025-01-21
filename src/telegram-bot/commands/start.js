import { handleAuth } from '../handlers/auth.js';
import { sendMessageWithButtons } from '../sendMessage.js';

const startMessage = (bot, chatId, command) => {
  if (command === '/start') {
    sendMessageWithButtons(bot, chatId, 'Выберите интересующую опцию:', [
      [
        { text: 'Карбон', callback_data: 'production_carbon' },
        { text: 'Сизод', callback_data: 'production_sizod' },
      ],
      [{ text: 'УТВХ', callback_data: 'production_utvh' }],
    ]);
  }
};

export const startCommand = async (bot, chatId, userId) => {
  if (!(await handleAuth(bot, chatId, userId))) {
    return;
  }

  startMessage(bot, chatId, '/start');
};
