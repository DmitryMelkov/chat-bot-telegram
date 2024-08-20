import TelegramBot from 'node-telegram-bot-api';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { config } from '../config/config.js';
import { handleMessage, handleCallbackQuery } from './buttonHandlers.js';

const createTelegramBot = (app) => {
  const proxyAgent = new HttpsProxyAgent(config.PROXY_URL);
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, {
    polling: true,
    request: {
      agent: proxyAgent,
    },
  });

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text && !msg.reply_to_message) {
      handleMessage(bot, chatId);
    }
  });

  bot.on('callback_query', (query) => {
    handleCallbackQuery(bot, app, query);
  });

  return bot;
};

export default createTelegramBot;