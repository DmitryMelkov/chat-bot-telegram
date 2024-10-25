import { chartGenerators } from './chartGenerators.js';
import { sendMessageWithButtons } from '../../sendMessage.js';
import { getButtonsByAction } from './buttonSets.js';

export const handleChartGeneration = async (bot, chatId, action) => {
  const generateChart = chartGenerators[action];
  if (!generateChart) {
    await bot.sendMessage(chatId, 'Неизвестный тип графика. Пожалуйста, выберите другой график.');
    return;
  }
  let loadingMessage;
  try {
    loadingMessage = await bot.sendMessage(chatId, 'Загрузка графика, пожалуйста подождите...');
    const chartBuffer = await generateChart();
    if (!chartBuffer || chartBuffer.length === 0) {
      throw new Error(`График не был создан для ${action}`);
    }

    // Определение печи и параметра
    let furnaceNumber, furnaceType;
    if (action.includes('vr1') || action.includes('vr2')) {
      furnaceNumber = action.includes('vr1') ? 1 : 2;
      furnaceType = 'печи карбонизации';
    } else if (action.includes('mpa2') || action.includes('mpa3')) {
      furnaceNumber = action.includes('mpa2') ? 2 : 3;
      furnaceType = 'МПА';
    } else {
      furnaceNumber = 'неизвестной';
      furnaceType = 'неизвестного типа';
    }

    const chartType = action.includes('temperature')
      ? 'температуры'
      : action.includes('pressure')
      ? 'давления/разрежения'
      : action.includes('level')
      ? 'уровня'
      : action.includes('dose')
      ? 'Доза (Кг/час)'
      : 'неизвестного параметра';

    // Отправка графика с правильной подписью
    await bot.sendPhoto(chatId, chartBuffer, {
      caption: `График ${chartType} для ${furnaceType} №${furnaceNumber}`,
    });

    await bot.deleteMessage(chatId, loadingMessage.message_id);

    // Определение правильного набора кнопок для карбонизации и МПА
    let buttonSet;
    if (furnaceType === 'печи карбонизации') {
      buttonSet = getButtonsByAction(`charts_vr${furnaceNumber}`);
    } else if (furnaceType === 'МПА') {
      buttonSet = getButtonsByAction(`charts_mpa${furnaceNumber}`);
    }

    await sendMessageWithButtons(bot, chatId, 'Выберите следующий график или вернитесь назад:', buttonSet);
  } catch (error) {
    console.error(`Ошибка при генерации или отправке графика ${action}:`, error);
    if (loadingMessage) {
      await bot.deleteMessage(chatId, loadingMessage.message_id); // Удаление сообщения о загрузке в случае ошибки
    }
    await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
  }
};
