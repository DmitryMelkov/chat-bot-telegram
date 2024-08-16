// buttonHandlers.js
import { sendMessageWithButtons } from './sendMessage.js';
import { editMessageWithButtons } from './editMessage.js';
import { generateTablePechVr } from './generateTable.js';

export const handleMessage = (bot, chatId) => {
  sendMessageWithButtons(bot, chatId, 'Выберите интересующую опцию:', [
    [{ text: 'Производство Карбон', callback_data: 'production_carbon' }],
  ]);
};

export const handleCallbackQuery = (bot, app, query) => {
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
      [
        { text: 'Печь карбонизации 1', callback_data: 'furnace_1' },
        { text: 'Печь карбонизации 2', callback_data: 'furnace_2' },
      ],
      [{ text: 'Назад', callback_data: 'back_to_production' }],
    ],
    back_to_production: [[{ text: 'Производство Карбон', callback_data: 'production_carbon' }]],
  };

  if (action === 'get_temperature_1' || action === 'get_temperature_2') {
    const furnaceNumber = action === 'get_temperature_1' ? 1 : 2;
    const table = generateTablePechVr(data, furnaceNumber, currentTime);
    editMessageWithButtons(bot, chatId, query.message.message_id, table, [
      [{ text: 'Назад', callback_data: `furnace_${furnaceNumber}` }],
      [{ text: 'Обновить данные', callback_data: action }],
    ]);
  } else {
    const buttonSet = buttons[action] || buttons.back_to_production;
    sendMessageWithButtons(bot, chatId, 'Выберите интересующую опцию:', buttonSet);
  }
};
