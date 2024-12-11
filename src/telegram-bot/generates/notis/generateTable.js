// generateTable.js

// Функция для получения последних 5 значений параметра "Кг/час" из базы данных
export async function getLastValuesNotis(furnaceModel, parameterKey) {
  try {
    // Ищем документы, сортируем по времени и ограничиваем количество
    const results = await furnaceModel
      .find({})
      .sort({ timestamp: -1 })
      .limit(5);
    // Извлекаем значения по ключу из объекта `data` (включая преобразование Map в объект)
    const values = results.map(doc => {
      let data;
      // Преобразование Map в объект
      if (doc.data instanceof Map) {
        data = Object.fromEntries(doc.data.entries());
      } else {
        data = doc.data;
      }
      // Возвращаем значение параметра или null, если ключ отсутствует
      return data?.[parameterKey] || null;
    });


    return values;
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    return [];
  }
}

// Функция для проверки статуса загрузки
export function checkLoading(values) {

  if (values.length === 0) {
    return 'Загрузки нет';
  }

  const allSame = values.every(val => val === values[0]);

  return allSame ? 'Загрузки нет' : 'Идет загрузка';
}

// Функция генерации таблицы дозатора
export const generateDoseTableNotis = (data, furnaceNumber, loadStatus, serverTimestamp) => {

  if (!data) return 'Нет данных для отображения.';

  // Функция для определения значка на основе статуса загрузки
  const getStatusIcon = (value, loadStatus) => {
    if (value === 'Нет данных') {
      return '❓ ';
    } else if (loadStatus === 'Идет загрузка') {
      return '✅ ';
    } else {
      return '❌ ';
    }
  };

  // Форматирование данных для нотис
  const formatDose = (label, key, unit) => {
    const value = data[key] !== undefined ? data[key] : 'Нет данных';
    const icon = getStatusIcon(value, loadStatus);
    return `${icon}${label}: ${value} ${unit};`;
  };

  // Параметры нотис
  const doses = [
    formatDose('Г/мин', `Нотис ВР${furnaceNumber} Г/мин`, 'г/мин'),
    formatDose('Кг/час', `Нотис ВР${furnaceNumber} Кг/час`, 'кг/час'),
  ];

  // Форматирование времени записи на сервер из timestamp
  let serverTime = 'Нет данных';
  if (serverTimestamp instanceof Date) {
    const date = serverTimestamp.toLocaleDateString('ru-RU'); // Формат даты
    const time = serverTimestamp.toLocaleTimeString('ru-RU'); // Формат времени
    serverTime = `${date} ${time}`;
  } else if (typeof serverTimestamp === 'string') {
    serverTime = serverTimestamp;
  }

  // Объединение всех параметров в один массив
  const parameters = [
    'Текущие параметры нотис',
    `Печь карбонизации №${furnaceNumber}`,
    '',
    'Время записи на сервер:',
    `${serverTime}`,
    '',
    'Параметры дозаторов:',
    '',
    ...doses,
    '',
    `Статус работы нотиса: ${loadStatus}`, // Используем переданный статус
    '',
    `Обновлено: ${new Date().toLocaleString('ru-RU')}`, // Текущее время
  ];

  // Формирование итоговой строки
  return parameters.join('\n');
};
