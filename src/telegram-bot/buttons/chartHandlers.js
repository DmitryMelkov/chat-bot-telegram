import { chartGenerators } from './chartGenerators.js';
import { sendMessageWithButtons } from '../sendMessage.js';
import { getButtonsByAction } from '../buttons/buttonSets.js';

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

    const furnaceNumber = action.includes('1') ? 1 : 2;
    const chartType = action.includes('temperature') ? 'температуры' :
                      action.includes('pressure') ? 'давления/разрежения' :
                      action.includes('level') ? 'уровня' :
                      action.includes('dose') ? 'Доза (Кг/час)' : 'неизвестного параметра';

    await bot.sendPhoto(chatId, chartBuffer, {
      caption: `График ${chartType} для печи карбонизации №${furnaceNumber}`,
    });

    await bot.deleteMessage(chatId, loadingMessage.message_id);
    const buttonSet = getButtonsByAction(`charts_${furnaceNumber}`);
    await sendMessageWithButtons(bot, chatId, 'Выберите следующий график или вернитесь назад:', buttonSet);
  } catch (error) {
    console.error(`Ошибка при генерации или отправке графика ${action}:`, error);
    if (loadingMessage) {
      await bot.deleteMessage(chatId, loadingMessage.message_id); // Удаление сообщения о загрузке в случае ошибки
    }
    await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
  }
};
