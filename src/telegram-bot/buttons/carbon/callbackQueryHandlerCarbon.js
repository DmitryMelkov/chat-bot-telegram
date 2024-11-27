import { generateTablePechVr } from '../../generates/pechVr/generatetable.js';
import { checkAndNotify } from '../../generates/pechVr/alarms.js';
import { generateDoseTableNotis } from '../../generates/notis/generateTable.js';
import { NotisVR1, NotisVR2 } from '../../../models/NotisModel.js';
import { checkLoading, getLastValuesNotis } from '../../../routes/updateValues.js';
import { generateTableMpa } from '../../generates/pechiMPA/generatetable.js';
import { handleChartGeneration } from './chartHandlers.js';
import { chartGenerators } from './chartGenerators.js';
import { getButtonsByAction } from './buttonSets.js';
import { FurnaceVR1, FurnaceVR2 } from '../../../models/FurnanceModel.js';
import { generateTableSushilka } from '../../generates/sushilka/generatetable.js';
import { Sushilka1, Sushilka2 } from '../../../models/SushilkaModel.js';
import { generateTableMill } from '../../generates/mill/generatetable.js';
import { Mill1, Mill2, Mill10b } from '../../../models/MillModel.js';

export const handleCallbackQueryCarbon = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  try {
    if (action.startsWith('get_params_vr')) {
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      const currentTime = new Date().toLocaleString();

      // Получаем данные из MongoDB
      const furnaceDataModel = furnaceNumber === 1 ? FurnaceVR1 : FurnaceVR2;
      const furnaceDocument = await furnaceDataModel.findOne().sort({ timestamp: -1 }); // Последняя запись

      if (!furnaceDocument || !furnaceDocument.data) {
        await bot.sendMessage(chatId, 'Данные для печи не найдены. Попробуйте позже.');
        return;
      }

      const data = Object.fromEntries(furnaceDocument.data); // Преобразуем Map в обычный объект

      // Генерируем таблицу
      const table = generateTablePechVr(data, furnaceNumber, currentTime);
      const buttonSet = [
        [{ text: 'Алармы', callback_data: `check_alarms_vr${furnaceNumber}` }],
        [{ text: 'Обновить', callback_data: action }],
        [{ text: 'Назад', callback_data: `furnace_vr${furnaceNumber}` }],
      ];

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action.startsWith('check_alarms_')) {
      const furnaceNumber = action.includes('vr1') ? 1 : 2;

      // Получаем данные из MongoDB
      const furnaceDataModel = furnaceNumber === 1 ? FurnaceVR1 : FurnaceVR2;
      const furnaceDocument = await furnaceDataModel.findOne().sort({ timestamp: -1 }); // Последняя запись

      if (!furnaceDocument || !furnaceDocument.data) {
        await bot.sendMessage(chatId, 'Алармы для печи не найдены. Попробуйте позже.');
        return;
      }

      const data = Object.fromEntries(furnaceDocument.data); // Преобразуем Map в обычный объект

      // Передаем данные в функцию checkAndNotify
      await checkAndNotify(data, bot, chatId, furnaceNumber, query.message.message_id);
    } else if (action.startsWith('archive_')) {
      let chartType;
      let chartTitle;
      const furnaceNumber = action.includes('vr1') ? 1 : 2;

      if (action.startsWith('archive_temperature_')) {
        chartType = 'температуры';
        chartTitle = `График температуры печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_pressure_')) {
        chartType = 'давление/разрежение';
        chartTitle = `График давления печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_level_')) {
        chartType = 'уровня';
        chartTitle = `График уровня печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_dose_')) {
        chartType = 'Доза (Кг/час)';
        chartTitle = `График дозы печи карбонизации №${furnaceNumber} за сутки`;
      } else if (action.startsWith('archive_vibration_')) {
        chartType = 'вибрации';
        chartTitle = `График дозы печи карбонизации №${furnaceNumber} за сутки`;
      }

      app.locals.userStates = app.locals.userStates || {};
      const requestDateMessage = await bot.sendMessage(
        chatId,
        `Введите дату в формате dd.mm.yyyy для графика ${chartType}.`
      );

      app.locals.userStates[chatId] = {
        action: `${action}`,
        messageId: requestDateMessage.message_id,
        chartType,
        furnaceNumber,
      };
    } else if (chartGenerators[action]) {
      await handleChartGeneration(bot, chatId, action);
    } else if (action.startsWith('get_dose_notis_')) {
      const furnaceNumber = action.includes('vr1') ? 1 : 2;
      const data = app.locals.data;

      // Получаем последние 5 значений "Кг/час"
      const lastFiveValues = await getLastValuesNotis(
        furnaceNumber === 1 ? NotisVR1 : NotisVR2,
        `Нотис ВР${furnaceNumber} Кг/час`
      );

      // Проверяем статус загрузки нотиса
      const loadStatus = checkLoading(lastFiveValues);

      // Генерация таблицы дозатора с учетом статуса работы
      const doseTable = generateDoseTableNotis(data, furnaceNumber, loadStatus);

      const buttonSet = [
        [
          { text: 'Обновить', callback_data: action },
          { text: 'Назад', callback_data: `furnace_vr${furnaceNumber}` },
        ],
      ];
      await bot.editMessageText(doseTable, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action.startsWith('get_params_mpa2') || action.startsWith('get_params_mpa3')) {
      const mpaNumber = action.includes('mpa2') ? 2 : 3;
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      // Генерация таблицы для печей МПА2 и МПА3
      const table = generateTableMpa(data, mpaNumber, currentTime);

      // Кнопки "Обновить" и "Назад"
      const buttonSet = [
        [
          { text: 'Обновить', callback_data: `get_params_mpa${mpaNumber}` },
          { text: 'Назад', callback_data: `furnace_mpa${mpaNumber}` },
        ],
      ];

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } 
    else if (action.startsWith('get_params_sushilka')) {
      const sushilkaNumber = action.includes('sushilka1') ? 1 : 2; // Определяем номер сушилки
      const currentTime = new Date().toLocaleString();

      // Получаем модель данных сушилки из базы данных
      const sushilkaModel = sushilkaNumber === 1 ? Sushilka1 : Sushilka2;
      const sushilkaDocument = await sushilkaModel.findOne().sort({ timestamp: -1 }); // Последняя запись

      if (!sushilkaDocument || !sushilkaDocument.data) {
        await bot.sendMessage(chatId, `Данные для Сушилки ${sushilkaNumber} не найдены. Попробуйте позже.`);
        return;
      }

      const data = Object.fromEntries(sushilkaDocument.data); // Преобразуем данные из базы в объект

      // Генерация таблицы
      const table = generateTableSushilka(data, sushilkaNumber, currentTime);
      const buttonSet = [
        [
          { text: 'Обновить', callback_data: action },
          { text: 'Назад', callback_data: `sushilka_${sushilkaNumber}` },
        ],
      ];

      // Отправляем обновлённое сообщение
      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } 
    else if (action.startsWith('get_params_mill')) {
      const currentTime = new Date().toLocaleString();
    
      // Получаем данные из всех моделей
      const [mill1Documents, mill2Documents, mill10bDocuments] = await Promise.all([
        Mill1.find().sort({ timestamp: -1 }),
        Mill2.find().sort({ timestamp: -1 }),
        Mill10b.find().sort({ timestamp: -1 }),
      ]);
    
      // Проверяем, есть ли данные
      if (
        (!mill1Documents || mill1Documents.length === 0) &&
        (!mill2Documents || mill2Documents.length === 0) &&
        (!mill10bDocuments || mill10bDocuments.length === 0)
      ) {
        await bot.sendMessage(chatId, `Данные для мельниц не найдены. Попробуйте позже.`);
        return;
      }
    
      // Объединяем данные в общий объект dataAllMills
      const dataAllMills = {};
    
      // Обработка Mill1
      mill1Documents.forEach((doc) => {
        dataAllMills['Мельница №1 (к.296)'] = Object.fromEntries(doc.data);
      });
    
      // Обработка Mill2
      mill2Documents.forEach((doc) => {
        dataAllMills['Мельница №2 (к.296)'] = Object.fromEntries(doc.data);
      });
    
      // Обработка Mill10b (все параметры в одном документе)
      const mill10bConfig = {
        'Мельница YGM-9517 (к.10б)': [
          'Фронтальная вибрация YGM-9517',
          'Поперечная вибрация YGM-9517',
          'Осевая вибрация YGM-9517',
        ],
        'Мельница ШБМ №3 (к.10б)': [
          'Вертикальная вибрация ШБМ3',
          'Поперечная вибрация ШБМ3',
          'Осевая вибрация ШБМ3',
        ],
        'Мельница YCVOK-130 (к.10б)': [
          'Фронтальная вибрация YCVOK-130',
          'Поперечная вибрация YCVOK-130',
          'Осевая вибрация YCVOK-130',
        ],
      };
    
      // Обрабатываем первый (или последний) документ из Mill10b
      const mill10bData = Object.fromEntries(mill10bDocuments[0]?.data || []); // Преобразуем Map в объект

      Object.keys(mill10bConfig).forEach((millName) => {
        const parameters = mill10bConfig[millName];
        dataAllMills[millName] = {};
        parameters.forEach((param) => {
          // Извлекаем значение или указываем "Нет данных" по умолчанию
          dataAllMills[millName][param] = mill10bData[param] !== undefined ? mill10bData[param] : 'Нет данных';
        });
      });
      
    
      // Генерация таблицы
      const table = generateTableMill(dataAllMills, currentTime);
      const buttonSet = [
        [
          { text: 'Обновить', callback_data: action },
          { text: 'Назад', callback_data: 'mill_k296' },
        ],
      ];
    
      // Отправляем обновлённое сообщение
      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    }
    else {
      const actionMap = {
        furnace_vr1: 'Печь карбонизации №1',
        furnace_vr2: 'Печь карбонизации №2',
        furnace_mpa2: 'Печь МПА2',
        furnace_mpa3: 'Печь МПА3',
        sushilka_1: 'Сушилка №1',
        sushilka_2: 'Сушилка №2',
        mill_k296: 'Мельницы к.296 и к.10б',
        reactor_k296: 'Смоляные реактора к.296',
        back_to_main: 'Выберите интересующую опцию:',
      };

      const messageText = actionMap[action] || 'Выберите интересующую опцию:';
      const buttonSet = getButtonsByAction(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    }
  } catch (error) {
    console.error(`Ошибка обработки действия ${action}:`, error);
    await bot.sendMessage(chatId, 'Произошла ошибка при выполнении вашего запроса. Пожалуйста, попробуйте позже.');
  }
};