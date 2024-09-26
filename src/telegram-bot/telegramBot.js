import TelegramBot from 'node-telegram-bot-api';
import { config } from '../config/config.js';
import { startCommand } from './commands/start.js';
import { helpCommand } from './commands/help.js';
import { handleMessage } from './handlers/message.js';
import { handleCallback } from './handlers/callback.js';

const createTelegramBot = (app) => {
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    await startCommand(bot, chatId, userId);
  });

  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    await helpCommand(bot, chatId, userId);
  });

  bot.on('message', async (msg) => handleMessage(bot, app, msg));
  bot.on('callback_query', async (query) => handleCallback(bot, app, query));

  return bot;
};

export default createTelegramBot;