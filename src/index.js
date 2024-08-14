import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { HttpsProxyAgent } from 'https-proxy-agent';

dotenv.config(); // Загружаем переменные из .env

const app = express();
const PORT = process.env.PORT || 92;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public/')));
app.use(express.json()); // Парсинг JSON из POST-запросов

// Ваш Telegram токен теперь загружается из .env
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

// Функция для отправки сообщения с кнопками
const sendMessageWithButtons = (chatId, text, buttons) => {
  bot.sendMessage(chatId, text, {
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
};

// Функция для редактирования сообщения с кнопками
const editMessageWithButtons = (chatId, messageId, text, buttons) => {
  bot.editMessageText(text, {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
};

// Обработчик новых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Отправка кнопки "Производство Карбон" при любом новом сообщении
  if (msg.text && !msg.reply_to_message) {
    sendMessageWithButtons(chatId, 'Выберите опцию:', [
      [{ text: 'Производство Карбон', callback_data: 'production_carbon' }],
    ]);
  }
});

// Обработчик POST-запросов на обновление значений параметров
app.post('/update-values', (req, res) => {
  const data = req.body;
  const key = Object.keys(data)[0];
  const value = data[key];

  if (!app.locals.data) {
    app.locals.data = {
      'Режим работы печи:': null,
      'Температура 1-СК': null,
      'Температура 2-СК': null,
      'Температура 3-СК': null,
      'Давление в топке печи': null,
      'Давление газов после скруббера': null,
      'Разрежение в пространстве котла утилизатора': null,
      'Разрежение низ загрузочной камеры': null,
      'Уровень в ванне скруббера': null,
      'Уровень воды в емкости ХВО': null,
      'Уровень воды в барабане котла': null,
    };
  }

  console.log('Полученные данные:', data);
  app.locals.data[key] = value;

  res.send('Данные успешно получены.');
});

// Обработчик callback-запросов на получение параметров
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;
  const currentTime = new Date().toLocaleString();
  const data = app.locals.data;

  const buttons = {
    furnace_1: [
      [{ text: 'Текущие параметры', callback_data: 'get_temperature' }],
      [{ text: 'Назад', callback_data: 'production_carbon' }],
    ],
    production_carbon: [
      [{ text: 'Печь карбонизации 1', callback_data: 'furnace_1' }],
      [{ text: 'Печь карбонизации 2', callback_data: 'furnace_2' }],
      [{ text: 'Назад', callback_data: 'back_to_production' }],
    ],
    back_to_production: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
  };

  if (action === 'get_temperature') {
    const table = data
      ? `
Текущие параметры Печь карбонизации №1
\n
Режим работы печи: ${data['Режим работы печи:']}
\n
Температуры:
1-СК:  ${data['Температура 1-СК']} °C
2-СК:  ${data['Температура 2-СК']} °C
3-СК:  ${data['Температура 3-СК']} °C
\n
Давления:
В топке печи:  ${data['Давление в топке печи']} кгс/м2
Газов после скруббера:  ${data['Давление газов после скруббера']} кгс/м2
\n
Разрежения:
В котле утилизаторе:   ${data['Разрежение в пространстве котла утилизатора']} кгс/см2
Низ загрузочной камеры:   ${data['Разрежение низ загрузочной камеры']} кгс/см2
\n
Уровни:
В ванне скруббера:   ${data['Уровень в ванне скруббера']} мм
В емкости ХВО:   ${data['Уровень воды в емкости ХВО']} мм
В барабане котла:   ${data['Уровень воды в барабане котла']} мм
\n
Обновлено: ${currentTime}
      `
      : 'Нет данных для отображения.';

    editMessageWithButtons(chatId, query.message.message_id, table, [
      [{ text: 'Назад', callback_data: 'furnace_1' }],
      [{ text: 'Обновить данные', callback_data: 'get_temperature' }],
    ]);
  } else {
    const buttonSet = buttons[action] || buttons.back_to_production;
    sendMessageWithButtons(chatId, 'Выберите опцию:', buttonSet);
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});
