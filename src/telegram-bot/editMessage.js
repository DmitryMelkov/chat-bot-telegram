export const editMessageWithButtons = (bot, chatId, messageId, text, buttons) => {
  bot.editMessageText(text, {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
};
