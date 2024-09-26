import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import { updateValuesRoute } from './routes/updateValues.js';
import { fetchData } from './routes/dataFetcher.js';
import createTelegramBot from './telegram-bot/telegramBot.js';
import fs from 'fs';

const app = express();
const PORT = config.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, 'logs');

// Проверяем и создаем папку logs
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function logErrorWithTime(error) {
  const currentTime = new Date().toLocaleString();
  const errorMessage = `[${currentTime}] ${error.stack || error.message}\n`;

  console.error(errorMessage); // Выводим ошибку в консоль с временем

  fs.appendFile(path.join(logsDir, 'errors.log'), errorMessage, (err) => {
    if (err) {
      console.error(`Не удалось записать ошибку в файл: ${err.message}`);
    } else {
      console.log('Ошибка успешно записана в файл');
    }
  });
}

// Подключение к MongoDB с обработкой ошибок
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    logErrorWithTime(err);
  });

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json());

// Создаем и инициализируем бота
const bot = createTelegramBot(app);

// Обработка polling_error
bot.on('polling_error', (error) => {
  logErrorWithTime(error);
});

// Обработка всех необработанных ошибок
process.on('uncaughtException', (err) => {
  logErrorWithTime(err);
});

// Обработка ошибок промисов, которые не были обработаны
process.on('unhandledRejection', (reason, promise) => {
  logErrorWithTime(reason);
});

// Регистрация маршрутов после инициализации бота
updateValuesRoute(app);

fetchData();

// Обработка ошибок маршрутов и других middleware
app.use((err, req, res, next) => {
  logErrorWithTime(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  const timeStamp = new Date().toLocaleString();
  console.log(`[${timeStamp}] Server is running on http://169.254.7.86:${PORT}`);
  // console.log(`[${timeStamp}] Server is running on http://169.254.0.167:${PORT}`);
});
