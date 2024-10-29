// handleTextMessageSizod.js

import { generateDailyReportDotEko, generateMonthlyReportDotEko } from '../../generates/dot-eko/generateReports.js';

export const handleTextMessageSizod = async (bot, app, msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  const state = app.locals.userStates && app.locals.userStates[chatId];

  // Проверка на существование состояния с действием 'sizod_archive_report'
  if (state && state.action === 'sizod_archive_report') {
    let reportText;
    let loadingMessage;

    // Регулярные выражения для проверки форматов даты
    const dailyPattern = /^\d{2}\.\d{2}\.\d{4}$/; // Формат для суточного отчета
    const monthlyPattern = /^\d{2}\.\d{4}$/;      // Формат для месячного отчета

    try {
      // Удаляем сообщение с инструкцией о вводе даты, если оно существует
      if (state.messageId) {
        await bot.deleteMessage(chatId, state.messageId);
      }

      // Отправляем сообщение-прелоудер
      loadingMessage = await bot.sendMessage(chatId, 'Загрузка отчета, пожалуйста, подождите...');

      // Проверяем формат введенной даты и выбираем нужную функцию
      if (dailyPattern.test(userMessage)) {
        reportText = await generateDailyReportDotEko(userMessage);
      } else if (monthlyPattern.test(userMessage)) {
        reportText = await generateMonthlyReportDotEko(userMessage);
      } else {
        throw new Error('Неверный формат даты');
      }

      // Удаляем прелоудер после успешного получения отчета
      await bot.deleteMessage(chatId, loadingMessage.message_id);

      // Отправляем сгенерированный отчет
      await bot.sendMessage(chatId, reportText);

      // Отправляем сообщение с кнопкой "Назад" для возврата в главное меню
      await bot.sendMessage(chatId, 'Нажмите "Назад", чтобы вернуться в предыдущее меню:', {
        reply_markup: { inline_keyboard: [[{ text: 'Назад', callback_data: 'sizod_dot_eko' }]] }
      });

      // Очищаем состояние пользователя после успешной генерации отчета
      delete app.locals.userStates[chatId];
    } catch (error) {
      // Удаляем прелоудер, если произошла ошибка
      if (loadingMessage) {
        await bot.deleteMessage(chatId, loadingMessage.message_id);
      }

      // Сохраняем состояние для повторного ввода даты
      app.locals.userStates[chatId] = { ...state, messageId: undefined };

      // Отправляем сообщение об ошибке с возможностью повторного ввода даты или выхода
      await bot.sendMessage(chatId, `Ошибка: неверный формат даты или данные отсутствуют. Введите дату в формате dd.mm.yyyy или mm.yyyy, или нажмите "Назад" для выхода.`, {
        reply_markup: { inline_keyboard: [[{ text: 'Назад', callback_data: 'sizod_dot_eko' }]] }
      });
    }
  }
};
