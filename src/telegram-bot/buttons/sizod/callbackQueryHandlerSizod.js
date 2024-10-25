import { getButtonsByActionSizod } from './buttonSetsSizod.js';
import { generateTableDotEko, dotEkoKeys } from '../../generates/dot-eko/generatetable.js';
import { generateDailyReportDotEko, generateMonthlyReportDotEko } from '../../generates/dot-eko/generateReports.js';
import { generateHistogram } from '../../generates/dot-eko/generateCharts.js';
import { DotEKO } from '../../../models/SizodModel.js';

export const handleCallbackQuerySizod = async (bot, app, query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  try {
    if (action === 'sizod_dot_eko' || action === 'sizod_dot_pro') {
      const furnaceType = action === 'sizod_dot_eko' ? 'Дот-Эко' : 'Дот-Про';
      const messageText = `Выберите действие для ${furnaceType}:`;
      const buttonSet = getButtonsByActionSizod(action);

      await bot.editMessageText(messageText, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_get_params_eko') {
      const currentTime = new Date().toLocaleString();
      const data = app.locals.data;

      const buttonSet = [
        [{ text: 'Обновить', callback_data: 'sizod_get_params_eko' }],
        [{ text: 'Назад', callback_data: 'sizod_dot_eko' }],
      ];

      const hasDotEkoData = dotEkoKeys.every(key => data.hasOwnProperty(key));

      if (!hasDotEkoData) {
        await bot.editMessageText('Данные для ДОТ-ЭКО отсутствуют.', {
          chat_id: chatId,
          message_id: query.message.message_id,
          reply_markup: { inline_keyboard: buttonSet },
        });
        return;
      }

      const table = generateTableDotEko(data, currentTime);

      await bot.editMessageText(table, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_report_eko') {
      const buttonSet = getButtonsByActionSizod('sizod_report_eko');
      await bot.editMessageText('Выберите тип отчета для Дот-Эко:', {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_daily_report_eko') {
      const report = await generateDailyReportDotEko();

      const buttonSet = [
        [{ text: 'Обновить', callback_data: 'sizod_daily_report_eko' }],
        [{ text: 'Назад', callback_data: 'sizod_report_eko' }],
      ];

      await bot.editMessageText(report, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_monthly_report_eko') {
      const report = await generateMonthlyReportDotEko();

      const buttonSet = [
        [{ text: 'Обновить', callback_data: 'sizod_monthly_report_eko' }],
        [{ text: 'Назад', callback_data: 'sizod_report_eko' }],
      ];

      await bot.editMessageText(report, {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_charts_eko') {
      const buttonSet = getButtonsByActionSizod('sizod_charts_eko');
      await bot.editMessageText('Выберите тип графика:', {
        chat_id: chatId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: buttonSet },
      });
    } else if (action === 'sizod_daily_chart_eko' || action === 'sizod_monthly_chart_eko') {
      const isDaily = action === 'sizod_daily_chart_eko';
      const period = isDaily ? 'daily' : 'monthly';
      const title = isDaily ? 'Суточный график ДОТ-ЭКО' : 'Месячный график ДОТ-ЭКО';
      const model = action.includes('eko') ? DotEKO : DotPro; // Замените DotPro на нужную модель, если требуется
      const key = 'Сумма двух лыж рапорт ДОТ-ЭКО'; // Измените ключ, если для разных периодов он различается

      // Прелоудер
      const preloadMessage = await bot.sendMessage(chatId, 'Генерация графика, пожалуйста, подождите...');

      try {
        const chartImage = await generateHistogram({
          model: model,
          key: key,
          period: period,
          title: title,
        });

        if (chartImage) {
          await bot.sendPhoto(chatId, chartImage, {
            caption: title,
          });
        } else {
          await bot.sendMessage(chatId, 'Не удалось сгенерировать график. Попробуйте позже.');
        }
      } finally {
        await bot.deleteMessage(chatId, preloadMessage.message_id); // Удаляем сообщение прелоудера
      }

      const returnButtonSet = getButtonsByActionSizod('sizod_charts_eko');
      await bot.sendMessage(chatId, 'Выберите другой график:', {
        reply_markup: { inline_keyboard: returnButtonSet },
      });
    } else if (action.startsWith('sizod_archive_')) {
      await bot.sendMessage(chatId, 'Архив графиков еще не реализован для "Сизод".');
    } else {
      const actionMap = {
        sizod_dot_eko: 'Дот-Эко',
        sizod_dot_pro: 'Дот-Про',
        back_to_sizod: 'Выберите интересующую опцию:',
      };

      const messageText = actionMap[action] || 'Выберите интересующую опцию:';
      const buttonSet = getButtonsByActionSizod(action);

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
