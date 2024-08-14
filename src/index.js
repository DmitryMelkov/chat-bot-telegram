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

// Функция отправки кнопки "Производство Карбон"
const sendProductionButton = (chatId) => {
  bot.sendMessage(chatId, 'Выберите опцию:', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
    },
  });
};

// Функция отправки кнопок "Печь карбонизации 1" и "Печь карбонизации 2"
const sendFurnaceButtons = (chatId) => {
  bot.sendMessage(chatId, 'Выберите печь карбонизации:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Печь карбонизации 1', callback_data: 'furnace_1' }],
        [{ text: 'Печь карбонизации 2', callback_data: 'furnace_2' }],
        [{ text: 'Назад', callback_data: 'back_to_production' }],
      ],
    },
  });
};

// Функция отправки кнопок "Текущие параметры" и "Назад"
const sendFurnace1Menu = (chatId) => {
  bot.sendMessage(chatId, 'Меню Печь карбонизации 1:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Текущие параметры', callback_data: 'get_temperature' }],
        [{ text: 'Назад', callback_data: 'production_carbon' }],
      ],
    },
  });
};

// Обработчик новых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Отправка кнопки "Производство Карбон" при любом новом сообщении
  if (msg.text && !msg.reply_to_message) {
    sendProductionButton(chatId);
  }
});

// Обработчик POST-запросов на обновление значений параметров
app.post('/update-values', (req, res) => {
  const data = req.body;
  const key = Object.keys(data)[0];
  const value = data[key];

  if (!app.locals.data) {
    app.locals.data = {
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

  if (action === 'get_temperature') {
    const data = app.locals.data;

    if (data) {
      const table = `
Текущие параметры Печь карбонизации №1
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
      `;
      console.log('Отправка данных в Telegram:', data);
      bot.sendMessage(chatId, table, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'furnace_1' }]],
        },
      });
    } else {
      bot.sendMessage(chatId, 'Нет данных для отображения.', {
        reply_markup: {
          inline_keyboard: [[{ text: 'Назад', callback_data: 'furnace_1' }]],
        },
      });
    }
  } else if (action === 'production_carbon') {
    sendFurnaceButtons(chatId);
  } else if (action === 'furnace_1') {
    sendFurnace1Menu(chatId);
  } else if (action === 'back_to_production') {
    sendProductionButton(chatId);
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://169.254.7.86:${PORT}`);
});
