import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config(); // Загружаем переменные из .env

const app = express();
const PORT = process.env.PORT || 92;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json()); // Парсинг JSON из POST-запросов

// Ваш Telegram токен теперь загружается из .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Функция отправки кнопки "Получить температуру"
const sendTemperatureButton = (chatId) => {
  bot.sendMessage(chatId, "Нажмите кнопку, чтобы получить температуру:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Получить температуру', callback_data: 'get_temperature' }]
      ]
    }
  });
};

// Обработчик новых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Отправка кнопки "Получить температуру" при любом новом сообщении
  if (msg.text && !msg.reply_to_message) {
    sendTemperatureButton(chatId);
  }
});

app.post('/update-values', (req, res) => {
  const temperatureData = req.body;

  console.log('Полученные данные:', temperatureData);

  // Сохранение данных на сервере, вместо отправки их сразу в Telegram
  app.locals.temperatureData = temperatureData;

  res.send('Данные успешно получены.');
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  if (action === 'get_temperature') {
    const temperatureData = app.locals.temperatureData;

    if (temperatureData) {
      bot.sendMessage(chatId, `Температура 1: ${temperatureData.temperatureValue1}\nТемпература 2: ${temperatureData.temperatureValue2}\nТемпература 3: ${temperatureData.temperatureValue3}`);
    } else {
      bot.sendMessage(chatId, 'Нет данных для отображения.');
    }
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});
