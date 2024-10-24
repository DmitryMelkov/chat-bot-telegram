import { DotEKO } from '../../../models/SizodModel.js';
import moment from 'moment';

// Функция для генерации суточного отчета
export const generateDailyReportDotEko = async () => {
  try {
    // Получаем текущую дату
    const startDate = moment().startOf('day').toDate(); // Начало текущего дня (00:00)
    const endDate = moment().toDate(); // Текущая дата и время

    // Извлекаем данные за текущий день
    const reportData = await DotEKO.find({
      key: { 
        $in: [
          'Лыжа левая рапорт ДОТ-ЭКО', 
          'Лыжа правая рапорт ДОТ-ЭКО', 
          'Брак рапорт ДОТ-ЭКО', 
          'Сумма двух лыж рапорт ДОТ-ЭКО',
          'Время работы рапорт ДОТ-ЭКО',
          'Время записи на сервер ДОТ-ЭКО'
        ]
      },
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    if (reportData.length === 0) {
      return 'Данных за текущий день нет.';
    }

    // Группируем данные по часам
    const hourlyData = {};
    reportData.forEach((entry) => {
      const hour = moment(entry.timestamp).format('HH:00');
      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          rightSkiReport: [],
          leftSkiReport: [],
          defectReport: [],
          workTime: [],
        };
      }
      if (entry.key === 'Лыжа правая рапорт ДОТ-ЭКО') hourlyData[hour].rightSkiReport.push(Number(entry.value));
      if (entry.key === 'Лыжа левая рапорт ДОТ-ЭКО') hourlyData[hour].leftSkiReport.push(Number(entry.value));
      if (entry.key === 'Брак рапорт ДОТ-ЭКО') hourlyData[hour].defectReport.push(Number(entry.value));
      if (entry.key === 'Время работы рапорт ДОТ-ЭКО') hourlyData[hour].workTime.push(Number(entry.value));
    });

    // Формируем отчет по часам, вычисляя разницу (максимум - минимум)
    let reportText = '*Суточный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Час    | Продукция  | Брак  | Время работы \n';
    reportText += '----------|--------------------|----------|---------------`\n';

    Object.entries(hourlyData).forEach(([hour, data]) => {
      const getDifference = (values) => {
        if (values.length === 0) return 'Нет данных';
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      };

      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      const workTimeDiff = getDifference(data.workTime);

      const totalSkiDiff = rightSkiDiff !== 'Нет данных' && leftSkiDiff !== 'Нет данных' ? rightSkiDiff + leftSkiDiff + ' шт.' : 'Нет данных';
      const defectText = defectDiff !== 'Нет данных' ? defectDiff + ' шт.' : 'Нет данных';
      const workTimeText = workTimeDiff !== 'Нет данных' ? workTimeDiff + ' ч.' : 'Нет данных';

      reportText += `\`${hour} | ${totalSkiDiff.padEnd(10)} | ${defectText.padEnd(5)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    // Добавляем текущее время обновления отчета
    const currentTime = new Date().toLocaleString();
    reportText += `\nОбновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`;

    // Оборачиваем весь текст в моноширинный блок с использованием Markdown
    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации суточного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};

// Функция для генерации месячного отчета
export const generateMonthlyReportDotEko = async () => {
  try {
    // Получаем начало и конец текущего месяца
    const startDate = moment().startOf('month').toDate(); // Начало месяца (00:00 первого числа)
    const endDate = moment().endOf('month').toDate(); // Конец месяца (23:59 последнего дня)

    // Извлекаем данные за текущий месяц
    const reportData = await DotEKO.find({
      key: { 
        $in: [
          'Лыжа левая рапорт ДОТ-ЭКО', 
          'Лыжа правая рапорт ДОТ-ЭКО', 
          'Брак рапорт ДОТ-ЭКО', 
          'Сумма двух лыж рапорт ДОТ-ЭКО',
          'Время работы рапорт ДОТ-ЭКО',
          'Время записи на сервер ДОТ-ЭКО'
        ]
      },
      timestamp: { $gte: startDate, $lte: endDate },
    }).sort({ timestamp: 1 });

    if (reportData.length === 0) {
      return 'Данных за текущий месяц нет.';
    }

    // Группируем данные по дням
    const dailyData = {};
    reportData.forEach((entry) => {
      const day = moment(entry.timestamp).format('YYYY-MM-DD'); // Форматируем по дням
      if (!dailyData[day]) {
        dailyData[day] = {
          rightSkiReport: [],
          leftSkiReport: [],
          defectReport: [],
          workTime: [],
        };
      }
      if (entry.key === 'Лыжа правая рапорт ДОТ-ЭКО') dailyData[day].rightSkiReport.push(Number(entry.value));
      if (entry.key === 'Лыжа левая рапорт ДОТ-ЭКО') dailyData[day].leftSkiReport.push(Number(entry.value));
      if (entry.key === 'Брак рапорт ДОТ-ЭКО') dailyData[day].defectReport.push(Number(entry.value));
      if (entry.key === 'Время работы рапорт ДОТ-ЭКО') dailyData[day].workTime.push(Number(entry.value));
    });

    // Формируем отчет по дням, вычисляя разницу (максимум - минимум)
    let reportText = '*Месячный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Дата    | Продукция  | Брак  | Время работы \n';
    reportText += '----------|--------------------|----------|---------------`\n';

    Object.entries(dailyData).forEach(([day, data]) => {
      const getDifference = (values) => {
        if (values.length === 0) return 'Нет данных';
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      };

      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      const workTimeDiff = getDifference(data.workTime);

      const totalSkiDiff = rightSkiDiff !== 'Нет данных' && leftSkiDiff !== 'Нет данных' ? rightSkiDiff + leftSkiDiff + ' шт.' : 'Нет данных';
      const defectText = defectDiff !== 'Нет данных' ? defectDiff + ' шт.' : 'Нет данных';
      const workTimeText = workTimeDiff !== 'Нет данных' ? workTimeDiff + ' ч.' : 'Нет данных';

      reportText += `\`${day} | ${totalSkiDiff.padEnd(10)} | ${defectText.padEnd(5)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    // Добавляем текущее время обновления отчета
    const currentTime = new Date().toLocaleString();
    reportText += `\nОбновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`;

    // Оборачиваем весь текст в моноширинный блок с использованием Markdown
    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации месячного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};

