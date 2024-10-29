import { DotEKO } from '../../../models/SizodModel.js';
import moment from 'moment';

// Функция для генерации суточного отчета
export const generateDailyReportDotEko = async (dateString = null) => {
  try {
    const startDate = dateString ? moment(dateString, 'DD.MM.YYYY').startOf('day') : moment().startOf('day');
    const endDate = dateString ? moment(dateString, 'DD.MM.YYYY').endOf('day') : moment();

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
        if (entry.key === 'Лыжа правая рапорт ДОТ-ЭКО') data.rightSkiReport.push(Number(entry.value));
        if (entry.key === 'Лыжа левая рапорт ДОТ-ЭКО') data.leftSkiReport.push(Number(entry.value));
        if (entry.key === 'Брак рапорт ДОТ-ЭКО') data.defectReport.push(Number(entry.value));
        if (entry.key === 'Время работы рапорт ДОТ-ЭКО') data.workTime.push(Number(entry.value));
      }
    });

    let reportText = '*Суточный отчет ДОТ-ЭКО:*\n\n';
    reportText += '`Вр.  | Изд-ия  | Брак  | Вр. работы` \n\n';

    let totalDailySkiDiff = 0;

    Object.entries(hourlyData).forEach(([hour, data]) => {
      const getDifference = (values) => {
        if (values.length === 0) return 0;
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      };

      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      let workTimeDiff = getDifference(data.workTime);

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
        if (values.length === 0) return 0;
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      };

      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      let workTimeDiff = getDifference(data.workTime);

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