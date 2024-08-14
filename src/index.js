import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { log } from 'console';

dotenv.config(); // Загружаем переменные из.env

const app = express();
const PORT = process.env.PORT || 92;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json()); // Парсинг JSON из POST-запросов

// Ваш Telegram токен теперь загружается из.env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Настройки прокси
const proxyUrl = 'http://169.254.0.51:3274';
const proxyAgent = new HttpsProxyAgent(proxyUrl);

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, {
  polling: true,
  request: {
    agent: proxyAgent,
  },
});

// Функция отправки кнопки "Получить температуру"
const sendTemperatureButton = (chatId) => {
  bot.sendMessage(chatId, 'Нажмите кнопку, чтобы получить температуру:', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Получить температуру', callback_data: 'get_temperature' }]],
    },
  });
};

// Обработчик новых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Отправка кнопки "Получить температуру" при любом новом сообщении
  if (msg.text &&!msg.reply_to_message) {
    sendTemperatureButton(chatId);
  }
});

// Обработчик POST-запросов на обновление значений температуры
app.post('/update-values', (req, res) => {
  const temperatureData = req.body;
  const key = Object.keys(temperatureData)[0];
  const value = temperatureData[key];

  if (!app.locals.temperatureData) {
    app.locals.temperatureData = {
      'Температура 1-СК': null,
      'Температура 2-СК': null,
      'Температура 3-СК': null,
    };
  }

  console.log('Полученные данные:', temperatureData);
  app.locals.temperatureData[key] = value;

  res.send('Данные успешно получены.');
});



// Обработчик callback-запросов на получение температуры
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  if (action === 'get_temperature') {
    const temperatureData = app.locals.temperatureData;

    if (temperatureData) {
      const table = `
      Текущие параметры температуры
      1-СК     |     ${'\u2705'} ${temperatureData['Температура 1-СК']}°C
      2-СК     |     ${'\u2705'} ${temperatureData['Температура 2-СК']}°C
      3-СК     |     ${'\u2705'} ${temperatureData['Температура 3-СК']}°C
      `;
      console.log('Отправка данных в Telegram:', temperatureData);
      bot.sendMessage(chatId, table, { parse_mode: 'HTML' });
    } else {
      bot.sendMessage(chatId, 'Нет данных для отображения.');
    }
  }
});



// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});