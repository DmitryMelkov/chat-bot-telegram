import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import { updateValuesRoute } from './routes/updateValues.js';
import createTelegramBot from './telegram-bot/telegramBot.js';
import { logErrorAndRestart } from './controllers/serverControl.js'; // Импортируем функцию

const app = express();
const PORT = config.PORT;

// Определение __filename и __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/furnaceData')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    logErrorAndRestart('Error connecting to MongoDB', err);
  });

// Настройка статического сервера для файлов в public
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json());

// Создание и настройка Telegram бота
const bot = createTelegramBot(app);

// Подключаем маршруты
updateValuesRoute(app);

// Обработка ошибок polling_error
bot.on('polling_error', (error) => {
  logErrorAndRestart('Polling error detected', error);
});

// Автоматический перезапуск сервера раз в час
setInterval(() => {
  const timeStamp = new Date().toLocaleString();
  console.log(`[${timeStamp}] Scheduled server restart`);

  logErrorAndRestart('Scheduled restart');
}, 60 * 60 * 1000);

// Запуск сервера
app.listen(PORT, () => {
  const timeStamp = new Date().toLocaleString();
  console.log(`[${timeStamp}] Server is running on http://169.254.7.86:${PORT}`);
});
