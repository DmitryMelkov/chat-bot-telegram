import { chartGenerators } from './chartGenerators.js';
import { sendMessageWithButtons } from '../../sendMessage.js';
import { getButtonsByAction } from './buttonSets.js';
import { FurnaceVR1, FurnaceVR2 } from '../../../models/FurnanceModel.js'; // Только для VR
import { Sushilka1, Sushilka2 } from '../../../models/SushilkaModel.js'; // Для сушилок
import { Mill1, Mill2, Mill10b } from '../../../models/MillModel.js'; // Модели мельниц

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
      // Логика для МПА
      equipmentNumber = action.includes('mpa2') ? 2 : 3;
      equipmentType = 'МПА';

      data = null; // МПА используют прямую генерацию графика без данных
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
    } else if (
      action.includes('mill1') ||
      action.includes('mill2') ||
      action.includes('mill10b') ||
      action.includes('sbm3') ||
      action.includes('ygm9517') ||
      action.includes('ycvok130')
    ) {
      // Логика для мельниц
      if (action === 'chart_vibration_mill1') {
        model = Mill1;
        equipmentNumber = 1;
        equipmentType = 'Мельница';

        const document = await model.findOne().sort({ timestamp: -1 });
        if (!document || !document.data) {
          throw new Error(`Данные для ${equipmentType} №${equipmentNumber} отсутствуют.`);
        }

        data = Object.fromEntries(document.data);
      } else if (action === 'chart_vibration_mill2') {
        model = Mill2;
        equipmentNumber = 2;
        equipmentType = 'Мельница';

        const document = await model.findOne().sort({ timestamp: -1 });
        if (!document || !document.data) {
          throw new Error(`Данные для ${equipmentType} №${equipmentNumber} отсутствуют.`);
        }

        data = Object.fromEntries(document.data);
      } else if (action === 'chart_vibration_sbm3') {
        model = Mill10b;
        equipmentType = 'ШБМ';
        equipmentNumber = 3; // Устанавливаем номер

        const document = await model.findOne().sort({ timestamp: -1 });
        if (!document || !document.data) {
          throw new Error(`Данные для ${equipmentType} №${equipmentNumber} отсутствуют.`);
        }

        const allData = Object.fromEntries(document.data);
        data = {
          'Вертикальная вибрация ШБМ3': allData['Вертикальная вибрация ШБМ3'],
          'Поперечная вибрация ШБМ3': allData['Поперечная вибрация ШБМ3'],
          'Осевая вибрация ШБМ3': allData['Осевая вибрация ШБМ3'],
        };
      } else if (action === 'chart_vibration_ygm9517') {
        model = Mill10b;
        equipmentType = 'YGM-9517';
        equipmentNumber = undefined; // Для YGM номер не нужен

        const document = await model.findOne().sort({ timestamp: -1 });
        if (!document || !document.data) {
          throw new Error(`Данные для ${equipmentType} отсутствуют.`);
        }

        const allData = Object.fromEntries(document.data);
        data = {
          'Фронтальная вибрация YGM-9517': allData['Фронтальная вибрация YGM-9517'],
          'Поперечная вибрация YGM-9517': allData['Поперечная вибрация YGM-9517'],
          'Осевая вибрация YGM-9517': allData['Осевая вибрация YGM-9517'],
        };
      } else if (action === 'chart_vibration_ycvok130') {
        model = Mill10b;
        equipmentType = 'YCVOK-130';
        equipmentNumber = undefined; // Для YCVOK номер не нужен

        const document = await model.findOne().sort({ timestamp: -1 });
        if (!document || !document.data) {
          throw new Error(`Данные для ${equipmentType} отсутствуют.`);
        }

        const allData = Object.fromEntries(document.data);
        data = {
          'Фронтальная вибрация YCVOK-130': allData['Фронтальная вибрация YCVOK-130'],
          'Поперечная вибрация YCVOK-130': allData['Поперечная вибрация YCVOK-130'],
          'Осевая вибрация YCVOK-130': allData['Осевая вибрация YCVOK-130'],
        };
      } else {
        throw new Error('Неверный тип оборудования.');
      }
    }

    const chartTypeMap = {
      temperature: 'температуры',
      pressure: 'давления/разрежения',
      level: 'уровня',
      vibration: 'вибрации',
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
      caption: `График ${chartType} для ${equipmentType}${equipmentNumber ? ` №${equipmentNumber}` : ''}`,
    });
    await bot.deleteMessage(chatId, loadingMessage.message_id);

    // Определение набора кнопок
    const buttonSet = getButtonsByAction(
      equipmentType === 'печи карбонизации'
        ? `charts_vr${equipmentNumber}`
        : equipmentType === 'МПА'
        ? `charts_mpa${equipmentNumber}`
        : equipmentType === 'Сушилки'
        ? `charts_sushilka${equipmentNumber}`
        : 'charts_mill'
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
