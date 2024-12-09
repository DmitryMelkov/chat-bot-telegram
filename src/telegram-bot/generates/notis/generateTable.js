// generateTable.js

// Функция для получения последних 5 значений параметра "Кг/час" из базы данных
export async function getLastValuesNotis(furnaceModel, parameterKey) {
  try {
    const results = await furnaceModel
      .find({ key: parameterKey }) // Фильтруем по ключу (Кг/час)
      .sort({ timestamp: -1 }) // Сортируем по времени от новых к старым
      .limit(5); // Ограничиваем количество записей до 5

    return results.map(doc => doc.value);
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
    return [];
  }
}

// Функция для проверки статуса загрузки
export function checkLoading(values) {
  // Проверяем, есть ли значения
  if (values.length === 0) {
    return 'Загрузки нет';
  }

  // Проверяем, одинаковы ли все значения
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
