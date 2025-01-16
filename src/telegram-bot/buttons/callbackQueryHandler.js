import { getButtonsByAction } from './carbon/buttonSets.js';
import { handleCallbackQuerySizod } from './sizod/callbackQueryHandlerSizod.js';
import { handleCallbackQueryCarbon } from './carbon/callbackQueryHandlerCarbon.js';
import { handleCallbackQueryUtvh } from './utvh/callbackQueryHandlerUtvh.js';

export const handleCallbackQuery = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  // Если действие связано с Сизод
  if (action.startsWith('utvh_') || action.includes('utvh')) {
    await handleCallbackQueryUtvh(bot, app, query);
    return;
  }

  // Если действие связано с Сизод
  if (action.startsWith('sizod_') || action.includes('sizod')) {
    await handleCallbackQuerySizod(bot, app, query);
    return;
  }

  // Если действие связано с Карбоном
  if (
    action.startsWith('get_params_vr') ||
    action.startsWith('check_alarms_') ||
    action.startsWith('get_dose_notis_') ||
    action.startsWith('get_params_mpa') ||
    action.startsWith('chart_') ||
    action.startsWith('archive_') ||
    action.includes('sushilka') ||
    action.includes('mill') ||
    action.includes('reactor') ||
    action.includes('energy_resources_carbon')
  ) {
    await handleCallbackQueryCarbon(bot, app, query);
    return;
  }

  // Остальные действия
  try {
    const actionMap = {
      furnace_vr1: 'Печь карбонизации №1',
      furnace_vr2: 'Печь карбонизации №2',
      furnace_mpa2: 'Печь МПА2',
      furnace_mpa3: 'Печь МПА3',
      sushilka_1: 'Сушилка №1',
      sushilka_2: 'Сушилка №2',
      mill_k296: 'Мельницы к.296 и к.10б',
      reactor_k296: 'Смоляные реактора к.296',
      energy_resources_carbon: 'Энергоресурсы карбон',
      back_to_main: 'Выберите интересующую опцию:',
    };

    const messageText = actionMap[action] || 'Выберите интересующую опцию:';
    const buttonSet = getButtonsByAction(action);

    await bot.editMessageText(messageText, {
      chat_id: chatId,
      message_id: query.message.message_id,
      reply_markup: { inline_keyboard: buttonSet },
    });
  } catch (error) {
    console.error(`Ошибка обработки действия ${action}:`, error);
    await bot.sendMessage(chatId, 'Произошла ошибка при выполнении вашего запроса. Пожалуйста, попробуйте позже.');
  }
};
