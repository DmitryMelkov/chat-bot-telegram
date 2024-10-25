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

// Формируем отчет по часам, вычисляя разницу (максимум - минимум)
let reportText = '*Суточный отчет ДОТ-ЭКО:*\n\n';
reportText += '`Вр.  | Изд-ия  | Брак  | Вр. работы` \n\n';


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
      ? (rightSkiDiff + leftSkiDiff).toString().padStart(4) + ' шт.' 
      : 'Нет данных'.padStart(8);
  const defectText = defectDiff !== 'Нет данных' 
      ? defectDiff.toString().padStart(3) + ' шт.' 
      : 'Нет данных'.padStart(5);
  const workTimeText = workTimeDiff !== 'Нет данных' 
      ? workTimeDiff.toString().padStart(5) + ' ч.' 
      : 'Нет данных'.padStart(10);

  // Формируем строку с выровненными столбцами
  reportText += `\`${hour.padStart(5)} | ${totalSkiDiff.padEnd(10)} | ${defectText.padEnd(6)} | ${workTimeText.padEnd(10)}\`\n`;
});

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
      const day = moment(entry.timestamp).format('MM.DD'); // Форматируем по дням
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
    reportText += '`Дата    | Изд-ия  | Брак  | Вр. работы` \n\n';

    Object.entries(dailyData).forEach(([day, data]) => {
      const getDifference = (values) => {
        if (values.length === 0) return '-';
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
      };

      const rightSkiDiff = getDifference(data.rightSkiReport);
      const leftSkiDiff = getDifference(data.leftSkiReport);
      const defectDiff = getDifference(data.defectReport);
      let workTimeDiff = getDifference(data.workTime);

      // Округляем время работы до сотых
      if (workTimeDiff !== '-') {
        workTimeDiff = workTimeDiff.toFixed(2);
      }

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

