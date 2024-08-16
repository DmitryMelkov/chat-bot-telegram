// index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/config.js';
import { updateValuesRoute } from './routes/updateValues.js';
import createTelegramBot from './telegram-bot/telegramBot.js';

const app = express();
const PORT = config.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json());

const bot = createTelegramBot(app); // Создаем бота и передаем app

// Подключаем маршруты
updateValuesRoute(app);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});