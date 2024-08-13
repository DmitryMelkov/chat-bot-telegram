import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';

const app = express();
const PORT = process.env.PORT || 92;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json()); // Парсинг JSON из POST-запросов

// Ваш Telegram токен и ID чата
const TELEGRAM_BOT_TOKEN = '7484310340:AAF14G-DsRVf0zBYeY66n_S3DlhLprYYLJE';
const CHAT_ID = '238274847';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.post('/update-values', (req, res) => {
  const temperatureData = req.body;

  console.log('Полученные данные:', temperatureData);

  // Сохранение данных на сервере, вместо отправки их сразу в Telegram
  app.locals.temperatureData = temperatureData;

  res.send('Данные успешно получены.');
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет! Нажмите на кнопку, чтобы получить температуру.", {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Получить температуру', callback_data: 'get_temperature' }]
      ]
    }
  });
});

// Обработка нажатия на кнопку
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  if (query.data === 'get_temperature') {
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
