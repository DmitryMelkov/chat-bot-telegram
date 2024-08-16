// telegramBot.js
import TelegramBot from 'node-telegram-bot-api';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { config } from './config.js';

const createTelegramBot = (app) => {
  const proxyAgent = new HttpsProxyAgent(config.PROXY_URL); // Используйте URL из конфигурации
  const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { // Используйте токен из конфигурации
    polling: true,
    request: {
      agent: proxyAgent,
    },
  });

  const sendMessageWithButtons = (chatId, text, buttons) => {
    bot.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  };

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

  const generateTable = (data, furnaceNumber, currentTime) => {
    if (!data) return 'Нет данных для отображения.';

    const parameters = [
      `Режим работы печи: ${data[`Печь ВР${furnaceNumber} Режим работы печи:`]}`,
      'Температуры:',
      ...[1, 2, 3].map(i => `Температура ${i}-СК печь ВР${furnaceNumber}: ${data[`Температура ${i}-СК печь ВР${furnaceNumber}`]} °C`),
      `В топке:  ${data[`Температура в топке печь ВР${furnaceNumber}`]} °C`,
      `Вверху камеры загрузки:  ${data[`Температура вверху камеры загрузки печь ВР${furnaceNumber}`]} °C`,
      `Внизу камеры загрузки:  ${data[`Температура внизу камеры загрузки печь ВР${furnaceNumber}`]} °C`,
      `На входе печи дожига:  ${data[`Температура на входе печи дожига печь ВР${furnaceNumber}`]} °C`,
      `На выходе печи дожига:  ${data[`Температура на выходе печи дожига печь ВР${furnaceNumber}`]} °C`,
      `Камеры выгрузки:  ${data[`Температура камеры выгрузки печь ВР${furnaceNumber}`]} °C`,
      `Дымовых газов котла:  ${data[`Температура дымовых газов котла печь ВР${furnaceNumber}`]} °C`,
      `Газов до скруббера:  ${data[`Температура газов до скруббера печь ВР${furnaceNumber}`]} °C`,
      `Газов после скруббера:  ${data[`Температура газов после скруббера печь ВР${furnaceNumber}`]} °C`,
      `Воды в ванне скруббер:  ${data[`Температура воды в ванне скруббер печь ВР${furnaceNumber}`]} °C`,
      `Гранул после холод-ка:  ${data[`Температура гранул после холод-ка печь ВР${furnaceNumber}`]} °C`,
      'Уровни:',
      `В ванне скруббера:   ${data[`Уровень в ванне скруббера печь ВР${furnaceNumber}`]} мм`,
      `В емкости ХВО:   ${data[`Уровень воды в емкости ХВО печь ВР${furnaceNumber}`]} мм`,
      `В барабане котла:   ${data[`Уровень воды в барабане котла печь ВР${furnaceNumber}`]} мм`,
      'Давления:',
      `Газов после скруббера:  ${data[`Давление газов после скруббера печь ВР${furnaceNumber}`]} кгс/см2`,
      `Пара в барабане котла:  ${data[`Давление пара в барабане котла печь ВР${furnaceNumber}`]} кгс/см2`,
      'Разрежения:',
      `В топке печи:  ${data[`Разрежение в топке печи печь ВР${furnaceNumber}`]} кгс/м2`,
      `В котле утилизаторе:   ${data[`Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber}`]} кгс/м2`,
      `Низ загрузочной камеры:   ${data[`Разрежение низ загрузочной камеры печь ВР${furnaceNumber}`]} кгс/м2`,
      `Обновлено: ${currentTime}`,
    ];

    return ['Текущие параметры', `Печь карбонизации №${furnaceNumber}`, '', ...parameters].join('\n');
  };

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    if (msg.text && !msg.reply_to_message) {
      sendMessageWithButtons(chatId, 'Выберите интересующую опцию:', [
        [{ text: 'Производство Карбон', callback_data: 'production_carbon' }],
      ]);
    }
  });

  bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const action = query.data;
    const currentTime = new Date().toLocaleString();
    const data = app.locals.data;

    const buttons = {
      furnace_1: [
        [{ text: 'Текущие параметры', callback_data: 'get_temperature_1' }],
        [{ text: 'Назад', callback_data: 'production_carbon' }],
      ],
      furnace_2: [
        [{ text: 'Текущие параметры', callback_data: 'get_temperature_2' }],
        [{ text: 'Назад', callback_data: 'production_carbon' }],
      ],
      production_carbon: [
        [{ text: 'Печь карбонизации 1', callback_data: 'furnace_1' },
         { text: 'Печь карбонизации 2', callback_data: 'furnace_2' }],
        [{ text: 'Назад', callback_data: 'back_to_production' }],
      ],
      back_to_production: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
    };

    if (action === 'get_temperature_1' || action === 'get_temperature_2') {
      const furnaceNumber = action === 'get_temperature_1' ? 1 : 2;
      const table = generateTable(data, furnaceNumber, currentTime);
      editMessageWithButtons(chatId, query.message.message_id, table, [
        [{ text: 'Назад', callback_data: `furnace_${furnaceNumber}` }],
        [{ text: 'Обновить данные', callback_data: action }],
      ]);
    } else {
      const buttonSet = buttons[action] || buttons.back_to_production;
      sendMessageWithButtons(chatId, 'Выберите интересующую опцию:', buttonSet);
    }
  });

  return bot;
};

export default createTelegramBot;
