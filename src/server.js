import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './data.js';
import createTelegramBot from './telegramBot.js';

const app = express();
const PORT = process.env.PORT || 92;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json());

const bot = createTelegramBot(app); // Создаем бота и передаем app

// Обработчик POST-запросов на обновление значений параметров
app.post('/update-values', (req, res) => {
  const data = req.body;
  const key = Object.keys(data)[0];
  const value = data[key];

  if (!app.locals.data) {
    app.locals.data = initialData;
  }

  console.log('Полученные данные:', data);
  app.locals.data[key] = value;

  res.send('Данные успешно получены.');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});
