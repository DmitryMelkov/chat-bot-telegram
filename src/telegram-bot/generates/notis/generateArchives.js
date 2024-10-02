import { NotisVR1, NotisVR2 } from "../../../models/NotisModel.js";
import { createChartConfig, renderChartToBuffer } from "../../chartConfig.js";

const generateDoseChartArchive = async (FurnaceModel, chartTitle, userDate, suffix) => {
  try {
    // Разделяем дату на день, месяц и год
    const [day, month, year] = userDate.split('.').map(Number);

    // Проверка корректности даты
    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) {
      throw new Error('Некорректная дата. Пожалуйста, введите дату в формате ДД.ММ.ГГГГ.');
    }

    // Определяем начало и конец дня
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    // Получаем данные по указанным ключам за этот день
    const Keys = [`Нотис ВР${suffix} Кг/час`];
    const datasetsPromises = Keys.map((key) => {
      return FurnaceModel.find({ key, timestamp: { $gte: startOfDay, $lte: endOfDay } }).sort({ timestamp: 1 });
    });

    const datasets = await Promise.all(datasetsPromises);

    datasets.forEach((dataset, index) => {
      if (dataset.length === 0) {
        throw new Error(`Нет данных для ${Keys[index]} за выбранный период времени для ${chartTitle}.`);
      }
    });

    // Обрабатываем и подготавливаем данные для графика
    const timestamps = datasets[0].map((d) => new Date(d.timestamp).toLocaleString());
    const values = datasets.map((dataset) =>
      dataset.map((d) => {
        if (typeof d.value === 'string') {
          return parseFloat(d.value.replace(',', '.'));
        } else if (typeof d.value === 'number') {
          return d.value;
        } else {
          throw new Error(`Некорректный тип данных для значения: ${d.value}`);
        }
      })
    );

    const labels = ['Доза Кг/час'];

    // Добавляем дату в заголовок графика
    const titleWithDate = `${chartTitle} за ${userDate}`;

    // Генерация конфигурации графика
    const config = createChartConfig(timestamps, values, labels, 'Доза (Кг/час)', titleWithDate, 200, 1000, 10);
    return renderChartToBuffer(config);
  } catch (error) {
    // Логируем и возвращаем ошибку с сообщением
    console.error(error.message);
    return `Ошибка: ${error.message}. Пожалуйста, попробуйте еще раз или нажмите "Назад" для выхода.`;
  }
};


// Вызов архива дозы для нотисов
export const generateDoseChartArchiveVR1 = (userDate) =>
  generateDoseChartArchive(NotisVR1, 'График дозы нотиса печи карбонизации №1', userDate, '1');
export const generateDoseChartArchiveVR2 = (userDate) =>
  generateDoseChartArchive(NotisVR2, 'График дозы нотиса печи карбонизации №2', userDate, '2');
