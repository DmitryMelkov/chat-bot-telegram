import { DotEKO } from '../../../models/SizodModel.js';
import moment from 'moment';

// Функция для генерации суточного отчета
export const generateDailyReportDotEko = async () => {
  try {
    const startDate = moment().startOf('day'); // Начало текущего дня (00:00)
    const endDate = moment(); // Текущая дата и время

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
      timestamp: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).sort({ timestamp: 1 });

    if (reportData.length === 0) {
      return 'Данных за текущий день нет.';
    }

    // Создаем интервалы по часам
    const intervals = [];
    let currentHour = startDate.clone();

    while (currentHour.isBefore(endDate)) {
      const nextHour = currentHour.clone().add(1, 'hours');
      const endOfInterval = nextHour.isAfter(endDate) ? endDate : nextHour;
      const hourLabel = `${endOfInterval.format('HH:mm')}`;
      intervals.push({
        start: currentHour,
        end: endOfInterval,
        label: hourLabel,
      });
      currentHour = nextHour;
    }

    // Инициализируем данные по интервалам
    const hourlyData = {};
    intervals.forEach(interval => {
      hourlyData[interval.label] = {
        rightSkiReport: [],
        leftSkiReport: [],
        defectReport: [],
        workTime: [],
      };
    });

    // Группируем данные по интервалам
    reportData.forEach((entry) => {
      const entryTime = moment(entry.timestamp);
      const interval = intervals.find(interval => entryTime.isSameOrAfter(interval.start) && entryTime.isBefore(interval.end));
      if (interval) {
        const data = hourlyData[interval.label];
        if (entry.key === 'Лыжа правая рапорт ДОТ-ЭКО') data.rightSkiReport.push(Number(entry.value));
        if (entry.key === 'Лыжа левая рапорт ДОТ-ЭКО') data.leftSkiReport.push(Number(entry.value));
        if (entry.key === 'Брак рапорт ДОТ-ЭКО') data.defectReport.push(Number(entry.value));
        if (entry.key === 'Время работы рапорт ДОТ-ЭКО') data.workTime.push(Number(entry.value));
      }
    });

    // Формируем отчет по часам и суммируем изделия
    let reportText = '*Суточный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Вр.  | Изд-ия  | Брак  | Вр. работы` \n\n';

    let totalDailySkiDiff = 0; // Инициализация суммы изделий за день

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
      let workTimeDiff = getDifference(data.workTime);

      // Округляем время работы до сотых
      if (workTimeDiff !== 'Нет данных') {
        workTimeDiff = workTimeDiff.toFixed(2);
      }

      // Фиксированная ширина для каждого столбца
      const totalSkiDiff = rightSkiDiff !== 'Нет данных' && leftSkiDiff !== 'Нет данных' 
          ? (rightSkiDiff + leftSkiDiff) 
          : 0;

      // Если есть данные, добавляем к итогу
      if (totalSkiDiff) {
        totalDailySkiDiff += totalSkiDiff;
      }

      const totalSkiText = totalSkiDiff ? totalSkiDiff.toString().padStart(4) + ' шт.' : 'Нет данных'.padStart(8);
      const defectText = defectDiff !== 'Нет данных' 
          ? defectDiff.toString().padStart(3) + ' шт.' 
          : 'Нет данных'.padStart(5);
      const workTimeText = workTimeDiff !== 'Нет данных' 
          ? workTimeDiff.toString().padStart(5) + ' ч.' 
          : 'Нет данных'.padStart(10);

      reportText += `\`${hour.padStart(5)} | ${totalSkiText.padEnd(10)} | ${defectText.padEnd(6)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    reportText += `\nИтого за сутки: ${totalDailySkiDiff} шт. изделий\n`;

    // Добавляем текущее время обновления отчета
    const currentTime = new Date().toLocaleString();
    reportText += `\nОбновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`;

    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации суточного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};

// Функция для генерации месячного отчета
export const generateMonthlyReportDotEko = async () => {
  try {
    const startDate = moment().startOf('month').toDate(); // Начало месяца
    const endDate = moment().endOf('month').toDate(); // Конец месяца

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

    const dailyData = {};
    reportData.forEach((entry) => {
      const day = moment(entry.timestamp).format('DD.MM');
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

    let reportText = '*Месячный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Дата    | Изд-ия  | Брак  | Вр. работы` \n\n';

    let totalMonthlySkiDiff = 0;

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

      let workTimeDiff = getDifference(data.workTime);

      if (workTimeDiff !== '-') {
        workTimeDiff = workTimeDiff.toFixed(2);
      }

      const totalSkiDiff = rightSkiDiff && leftSkiDiff ? rightSkiDiff + leftSkiDiff : 0;

      if (totalSkiDiff) {
        totalMonthlySkiDiff += totalSkiDiff;
      }

      const totalSkiText = totalSkiDiff ? totalSkiDiff + ' шт.' : 'Нет данных';
      const defectText = defectDiff !== 0 ? defectDiff + ' шт.' : '0 шт.';
      const workTimeText = workTimeDiff ? workTimeDiff + ' ч.' : 'Нет данных';

      reportText += `\`${day} | ${totalSkiText.padEnd(10)} | ${defectText.padEnd(5)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    reportText += `\nИтого за месяц: ${totalMonthlySkiDiff} шт. изделий\n`;

    const currentTime = new Date().toLocaleString();
    reportText += `\nОбновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`;

    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации месячного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};