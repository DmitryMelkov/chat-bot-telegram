export const sendMessageWithButtons = (bot, chatId, text, buttons) => {
  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
};
