export const generateDoseTableNotis = (data, furnaceNumber, loadStatus, currentTime = new Date().toLocaleString()) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция для проверки допустимого диапазона и возвращения соответствующего символа
  const checkRange = (value, loadStatus) => {
    if (value === 'Нет данных') {
      return '❓ ';
    } else if (loadStatus === 'Загрузки нет') {
      return '❌ ';
    } else {
      return '✅ ';
    }
  };

  // Форматирование данных для нотис
  const formatDose = (label, key, unit) => {
    const value = data[key] || 'нет данных';
    return `${checkRange(value, loadStatus)}${label}: ${value} ${unit}`;
  };

  // Параметры нотис
  const doses = [
    formatDose('Г/мин', `Нотис ВР${furnaceNumber} Г/мин`, 'г/мин'),
    formatDose('Кг/час', `Нотис ВР${furnaceNumber} Кг/час`, 'кг/час'),
    formatDose('Общий вес в граммах', `Нотис ВР${furnaceNumber} Общий вес в граммах`, 'г'),
    formatDose('Количество штук', `Нотис ВР${furnaceNumber} Количество штук`, 'шт.'),
    formatDose('Общий вес в тоннах', `Нотис ВР${furnaceNumber} Общий вес в тоннах`, 'тонн'),
  ];

  // Проверка времени записи на сервер
  const serverTime = data[`Время записи на сервер Нотис ВР${furnaceNumber}`] || 'нет данных';

  // Объединение всех параметров в один массив
  const parameters = [
    `Текущие параметры нотисы`,
    `Печь карбонизации №${furnaceNumber}`,
    '',
    `Время записи на сервер:`,
    `${serverTime}`,
    '',
    'Параметры дозаторов:',
    '',
    ...doses,
    '',
    `Статус работы нотиса: ${loadStatus}`,
    '',
    `Обновлено: ${currentTime}`,
  ];

  // Формирование итоговой строки
  return parameters.join('\n');
};
