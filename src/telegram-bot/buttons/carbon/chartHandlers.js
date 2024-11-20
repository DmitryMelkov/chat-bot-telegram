import { chartGenerators } from './chartGenerators.js';
import { sendMessageWithButtons } from '../../sendMessage.js';
import { getButtonsByAction } from './buttonSets.js';
import { FurnaceVR1, FurnaceVR2 } from '../../../models/FurnanceModel.js'; // Только для VR
import { Sushilka1, Sushilka2 } from '../../../models/SushilkaModel.js'; // Для сушилок

export const handleChartGeneration = async (bot, chatId, action) => {
  const generateChart = chartGenerators[action];
  if (!generateChart) {
    await bot.sendMessage(chatId, 'Неизвестный тип графика. Пожалуйста, выберите другой график.');
    return;
  }

  let loadingMessage;
  try {
    loadingMessage = await bot.sendMessage(chatId, 'Загрузка графика, пожалуйста подождите...');

    // Определение модели и параметров
    let model, equipmentNumber, equipmentType, data;
    if (action.includes('vr1') || action.includes('vr2')) {
      // Логика для VR
      model = action.includes('vr1') ? FurnaceVR1 : FurnaceVR2;
      equipmentNumber = action.includes('vr1') ? 1 : 2;
      equipmentType = 'печи карбонизации';

      const document = await model.findOne().sort({ timestamp: -1 });
      if (!document || !document.data) {
        throw new Error(`Данные для ${equipmentType} №${equipmentNumber} отсутствуют.`);
      }

      data = Object.fromEntries(document.data);
    } else if (action.includes('mpa2') || action.includes('mpa3')) {
      // Логика для MPA
      equipmentNumber = action.includes('mpa2') ? 2 : 3;
      equipmentType = 'МПА';

      data = null; // MPA используют прямую генерацию графика без данных
    } else if (action.includes('sushilka1') || action.includes('sushilka2')) {
      // Логика для сушилок
      equipmentNumber = action.includes('sushilka1') ? 1 : 2;
      model = equipmentNumber === 1 ? Sushilka1 : Sushilka2;
      equipmentType = 'Сушилки';

      const document = await model.findOne().sort({ timestamp: -1 });
      if (!document || !document.data) {
        throw new Error(`Данные для Сушилки №${equipmentNumber} отсутствуют.`);
      }

      data = Object.fromEntries(document.data);
    } else {
      throw new Error('Неверный тип оборудования.');
    }

    const chartTypeMap = {
      temperature: 'температуры',
      pressure: 'давления/разрежения',
      level: 'уровня',
      dose: 'Дозы (Кг/час)',
    };
    
    const chartType = Object.keys(chartTypeMap).find((key) => action.includes(key))
      ? chartTypeMap[Object.keys(chartTypeMap).find((key) => action.includes(key))]
      : 'неизвестного параметра';

    // Генерация графика
    const chartBuffer = await generateChart(data);
    if (!chartBuffer || chartBuffer.length === 0) {
      throw new Error(`График не был создан для ${action}`);
    }

    // Отправка графика
    await bot.sendPhoto(chatId, chartBuffer, {
      caption: `График ${chartType} для ${equipmentType} №${equipmentNumber}`,
    });

    await bot.deleteMessage(chatId, loadingMessage.message_id);

    // Определение набора кнопок
    const buttonSet = getButtonsByAction(
      equipmentType === 'печи карбонизации'
        ? `charts_vr${equipmentNumber}`
        : equipmentType === 'МПА'
        ? `charts_mpa${equipmentNumber}`
        : `charts_sushilka${equipmentNumber}`
    );
    await sendMessageWithButtons(bot, chatId, 'Выберите следующий график или вернитесь назад:', buttonSet);
  } catch (error) {
    console.error(`Ошибка при генерации или отправке графика ${action}:`, error);
    if (loadingMessage) {
      await bot.deleteMessage(chatId, loadingMessage.message_id); // Удаление сообщения о загрузке
    }
    await bot.sendMessage(chatId, 'Произошла ошибка при создании графика. Пожалуйста, попробуйте позже.');
  }
};
