import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from './config/config.js'; // Конфигурация приложения
import { updateValuesRoute } from './routes/updateValues.js'; // Маршрут для обновления значений
import createTelegramBot from './telegram-bot/telegramBot.js'; // Функция создания Telegram бота

const app = express();
const PORT = config.PORT;

// Определение __dirname и __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/furnaceData')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Настройка статического сервера для файлов в public
app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json());

// Создание и настройка Telegram бота
const bot = createTelegramBot(app); // Создаем бота и передаем Express приложение

// Подключаем маршруты
updateValuesRoute(app);

// Запуск сервера
app.listen(PORT, () => {
  const timeStamp = new Date().toLocaleString();
  console.log(`[${timeStamp}] Server is running on http://169.254.7.86:${PORT}`);
});
