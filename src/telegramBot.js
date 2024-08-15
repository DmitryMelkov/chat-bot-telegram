// telegramBot.js
import TelegramBot from 'node-telegram-bot-api';
import { HttpsProxyAgent } from 'https-proxy-agent';

const createTelegramBot = (token, proxyUrl, app) => {
  const proxyAgent = new HttpsProxyAgent(proxyUrl);
  const bot = new TelegramBot(token, {
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
    const data = app.locals.data; // Используем app.locals.data

    const buttons = {
      furnace_1: [
        [
          { text: 'Текущие параметры', callback_data: 'get_temperature_1' },
          { text: 'Назад', callback_data: 'production_carbon' },
        ],
      ],
      furnace_2: [
        [
          { text: 'Текущие параметры', callback_data: 'get_temperature_2' },
          { text: 'Назад', callback_data: 'production_carbon' },
        ],
      ],
      production_carbon: [
        [
          { text: 'Печь карбонизации 1', callback_data: 'furnace_1' },
          { text: 'Печь карбонизации 2', callback_data: 'furnace_2' },
        ],
        [{ text: 'Назад', callback_data: 'back_to_production' }],
      ],
      back_to_production: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
    };

    // Логика обработки callback_query
    if (action === 'get_temperature_1') {
      let table;
      if (data) {
        table = [
          'Текущие параметры',
          'Печь карбонизации №1',
          '',
          `Режим работы печи: ${data['Печь ВР1 Режим работы печи:']}`,
          '',
          'Температуры:',
          `1-СК:  ${data['Температура 1-СК печь ВР1']} °C`,
          `2-СК:  ${data['Температура 2-СК печь ВР1']} °C`,
          `3-СК:  ${data['Температура 3-СК печь ВР1']} °C`,
          `В топке:  ${data['Температура в топке печь ВР1']} °C`,
          `Вверху камеры загрузки:  ${data['Температура вверху камеры загрузки печь ВР1']} °C`,
          `Внизу камеры загрузки:  ${data['Температура внизу камеры загрузки печь ВР1']} °C`,
          `На входе печи дожига:  ${data['Температура на входе печи дожига печь ВР1']} °C`,
          `На выходе печи дожига:  ${data['Температура на выходе печи дожига печь ВР1']} °C`,
          `Камеры выгрузки:  ${data['Температура камеры выгрузки печь ВР1']} °C`,
          `Дымовых газов котла:  ${data['Температура дымовых газов котла печь ВР1']} °C`,
          `Газов до скруббера:  ${data['Температура газов до скруббера печь ВР1']} °C`,
          `Газов после скруббера:  ${data['Температура газов после скруббера печь ВР1']} °C`,
          `Воды в ванне скруббер:  ${data['Температура воды в ванне скруббер печь ВР1']} °C`,
          `Гранул после холод-ка:  ${data['Температура гранул после холод-ка печь ВР1']} °C`,
          '',
          'Уровни:',
          `В ванне скруббера:   ${data['Уровень в ванне скруббера печь ВР1']} мм`,
          `В емкости ХВО:   ${data['Уровень воды в емкости ХВО печь ВР1']} мм`,
          `В барабане котла:   ${data['Уровень воды в барабане котла печь ВР1']} мм`,
          '',
          'Давления:',
          `Газов после скруббера:  ${data['Давление газов после скруббера печь ВР1']} кгс/см2`,
          `Пара в барабане котла:  ${data['Давление пара в барабане котла печь ВР1']} кгс/см2`,
          '',
          'Разрежения:',
          `В топке печи:  ${data['Разрежение в топке печи печь ВР1']} кгс/м2`,
          `В котле утилизаторе:   ${data['Разрежение в пространстве котла утилизатора печь ВР1']} кгс/м2`,
          `Низ загрузочной камеры:   ${data['Разрежение низ загрузочной камеры печь ВР1']} кгс/м2`,
          '',
          'Текущие параметры',
          `Обновлено: ${currentTime}`,
        ].join('\n');
      } else {
        table = 'Нет данных для отображения.';
      }

      editMessageWithButtons(chatId, query.message.message_id, table, [
        [{ text: 'Назад', callback_data: 'furnace_1' }],
        [{ text: 'Обновить данные', callback_data: 'get_temperature_1' }],
      ]);
    } else if (action === 'get_temperature_2') {
      let table;
      if (data) {
        table = [
          'Текущие параметры',
          'Печь карбонизации №2',
          '',
          `Режим работы печи: ${data['Печь ВР2 Режим работы печи:']}`,
          '',
          'Температуры:',
          `1-СК:  ${data['Температура 1-СК печь ВР2']} °C`,
          `2-СК:  ${data['Температура 2-СК печь ВР2']} °C`,
          `3-СК:  ${data['Температура 3-СК печь ВР2']} °C`,
          `В топке:  ${data['Температура в топке печь ВР2']} °C`,
          `Вверху камеры загрузки:  ${data['Температура вверху камеры загрузки печь ВР2']} °C`,
          `Внизу камеры загрузки:  ${data['Температура внизу камеры загрузки печь ВР2']} °C`,
          `На входе печи дожига:  ${data['Температура на входе печи дожига печь ВР2']} °C`,
          `На выходе печи дожига:  ${data['Температура на выходе печи дожига печь ВР2']} °C`,
          `Камеры выгрузки:  ${data['Температура камеры выгрузки печь ВР2']} °C`,
          `Дымовых газов котла:  ${data['Температура дымовых газов котла печь ВР2']} °C`,
          `Газов до скруббера:  ${data['Температура газов до скруббера печь ВР2']} °C`,
          `Газов после скруббера:  ${data['Температура газов после скруббера печь ВР2']} °C`,
          `Воды в ванне скруббер:  ${data['Температура воды в ванне скруббер печь ВР2']} °C`,
          `Гранул после холод-ка:  ${data['Температура гранул после холод-ка печь ВР2']} °C`,
          '',
          'Уровни:',
          `В ванне скруббера:   ${data['Уровень в ванне скруббера печь ВР2']} мм`,
          `В емкости ХВО:   ${data['Уровень воды в емкости ХВО печь ВР2']} мм`,
          `В барабане котла:   ${data['Уровень воды в барабане котла печь ВР2']} мм`,
          '',
          'Давления:',
          `Газов после скруббера:  ${data['Давление газов после скруббера печь ВР2']} кгс/см2`,
          `Пара в барабане котла:  ${data['Давление пара в барабане котла печь ВР2']} кгс/см2`,
          '',
          'Разрежения:',
          `В топке печи:  ${data['Разрежение в топке печи печь ВР2']} кгс/м2`,
          `В котле утилизаторе:   ${data['Разрежение в пространстве котла утилизатора печь ВР2']} кгс/м2`,
          `Низ загрузочной камеры:   ${data['Разрежение низ загрузочной камеры печь ВР2']} кгс/м2`,
          '',
          `Обновлено: ${currentTime}`,
        ].join('\n');
      } else {
        table = 'Нет данных для отображения.';
      }

      editMessageWithButtons(chatId, query.message.message_id, table, [
        [{ text: 'Назад', callback_data: 'furnace_2' }],
        [{ text: 'Обновить данные', callback_data: 'get_temperature_2' }],
      ]);
    } else {
      const buttonSet = buttons[action] || buttons.back_to_production;
      sendMessageWithButtons(chatId, 'Выберите интересующую опцию:', buttonSet);
    }
  });

  return bot;
};

export default createTelegramBot;
