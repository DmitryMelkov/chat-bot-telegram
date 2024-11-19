import { DotEKO } from '../../../models/SizodModel.js';
import moment from 'moment';

const getDifference = (values, threshold = 15000) => {
  if (values.length === 0) return 0;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const diff = max - min;
  return diff > threshold ? 0 : diff;
};

export const generateDailyReportDotEko = async (dateString = null) => {
  try {
    const startDate = dateString ? moment(dateString, 'DD.MM.YYYY').startOf('day') : moment().startOf('day');
    const endDate = dateString ? moment(dateString, 'DD.MM.YYYY').endOf('day') : moment();

    const reportData = await DotEKO.find({
      timestamp: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).sort({ timestamp: 1 });

    if (reportData.length === 0) {
      return 'Данных за текущий день нет.';
    }

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

    const hourlyData = {};
    intervals.forEach(interval => {
      hourlyData[interval.label] = {
        rightSkiReport: [],
        leftSkiReport: [],
        defectReport: [],
        workTime: [],
      };
    });

    reportData.forEach((entry) => {
      const entryTime = moment(entry.timestamp);
      const interval = intervals.find(interval => entryTime.isSameOrAfter(interval.start) && entryTime.isBefore(interval.end));
      if (interval) {
        const data = hourlyData[interval.label];
        data.rightSkiReport.push(Number(entry.data.get('Лыжа правая рапорт ДОТ-ЭКО') || 0));
        data.leftSkiReport.push(Number(entry.data.get('Лыжа левая рапорт ДОТ-ЭКО') || 0));
        data.defectReport.push(Number(entry.data.get('Брак рапорт ДОТ-ЭКО') || 0));
        data.workTime.push(Number(entry.data.get('Время работы рапорт ДОТ-ЭКО') || 0));
      }
    });

    let reportText = '*Суточный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Вр.  | Изд-ия  | Брак  | Вр. работы` \n\n';

    let totalDailySkiDiff = 0;

    Object.entries(hourlyData).forEach(([hour, data]) => {
      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      let workTimeDiff = getDifference(data.workTime, 24);

      if (workTimeDiff !== 0) {
        workTimeDiff = workTimeDiff.toFixed(2);
      }

      const totalSkiDiff = rightSkiDiff + leftSkiDiff;

      if (totalSkiDiff) {
        totalDailySkiDiff += totalSkiDiff;
      }

      const totalSkiText = totalSkiDiff ? totalSkiDiff + ' шт.' : '0 шт.';
      const defectText = defectDiff ? defectDiff + ' шт.' : '0 шт.';
      const workTimeText = workTimeDiff ? workTimeDiff + ' ч.' : '0 ч.';

      reportText += `\`${hour.padStart(5)} | ${totalSkiText.padEnd(10)} | ${defectText.padEnd(6)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    reportText += `\nИтого за сутки: ${totalDailySkiDiff} шт. изделий\n`;

    const formattedDateString = dateString ? `Отчет сформирован за ${dateString}` : `Обновлено: ${new Date().toLocaleString()}`;
    reportText += `\n${formattedDateString}\n`;

    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации суточного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};


// Функция для генерации месячного отчета
export const generateMonthlyReportDotEko = async (dateString = null) => {
  try {
    const startDate = dateString ? moment(dateString, 'MM.YYYY').startOf('month') : moment().startOf('month');
    const endDate = dateString ? moment(dateString, 'MM.YYYY').endOf('month') : moment().endOf('month');

    const reportData = await DotEKO.find({
      timestamp: { $gte: startDate.toDate(), $lte: endDate.toDate() },
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
      dailyData[day].rightSkiReport.push(Number(entry.data.get('Лыжа правая рапорт ДОТ-ЭКО') || 0));
      dailyData[day].leftSkiReport.push(Number(entry.data.get('Лыжа левая рапорт ДОТ-ЭКО') || 0));
      dailyData[day].defectReport.push(Number(entry.data.get('Брак рапорт ДОТ-ЭКО') || 0));
      dailyData[day].workTime.push(Number(entry.data.get('Время работы рапорт ДОТ-ЭКО') || 0));
    });

    let reportText = '*Месячный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Дата    | Изд-ия  | Брак  | Вр. работы` \n\n';

    let totalMonthlySkiDiff = 0;

    Object.entries(dailyData).forEach(([day, data]) => {
      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      let workTimeDiff = getDifference(data.workTime, 100);  // Порог для времени работы

      if (workTimeDiff !== 0) {
        workTimeDiff = workTimeDiff.toFixed(2);
      }

      const totalSkiDiff = rightSkiDiff + leftSkiDiff;

      if (totalSkiDiff) {
        totalMonthlySkiDiff += totalSkiDiff;
      }

      const totalSkiText = totalSkiDiff ? totalSkiDiff + ' шт.' : '0 шт.';
      const defectText = defectDiff ? defectDiff + ' шт.' : '0 шт.';
      const workTimeText = workTimeDiff ? workTimeDiff + ' ч.' : '0 ч.';

      reportText += `\`${day} | ${totalSkiText.padEnd(10)} | ${defectText.padEnd(5)} | ${workTimeText.padEnd(10)}\`\n`;
    });

    reportText += `\nИтого за месяц:  ${totalMonthlySkiDiff} шт. изделий\n`;

    const formattedDateString = dateString ? `Отчет сформирован за ${dateString}` : `Обновлено: ${new Date().toLocaleString()}`;
    reportText += `\n${formattedDateString}\n`;

    return reportText;
  } catch (error) {
    console.error('Ошибка при генерации месячного отчета:', error);
    return 'Ошибка при генерации отчета. Попробуйте позже.';
  }
};