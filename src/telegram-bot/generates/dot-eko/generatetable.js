// Список ключей, необходимых для ДОТ-ЭКО
export const dotEkoKeys = [
  'Лыжа левая ДОТ-ЭКО',
  'Лыжа правая ДОТ-ЭКО',
  'Брак ДОТ-ЭКО',
  'Сумма двух лыж ДОТ-ЭКО',
  'Статус работы ДОТ-ЭКО',
  'Время работы ДОТ-ЭКО',
  'Время записи на сервер ДОТ-ЭКО',
];

export const generateTableDotEko = (data, currentTime) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция для отображения иконки в зависимости от статуса работы
  const getStatusIcon = (isWorking, value) => {
    if (value === undefined || value === null || value === '' || value === 'Нет данных') {
      return '❓ ';
    }
    // Если режим "Работает", возвращаем галочку, иначе крестик
    return isWorking ? '✅ ' : '❌ ';
  };

  // Определяем, работает ли линия
  const isWorking = Number(data['Статус работы ДОТ-ЭКО']) === 1;

  // Форматирование параметров с проверкой данных
  const formatParameter = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(isWorking, value); // Используем статус линии для всех параметров
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' шт.' : 'Нет данных'}`;
  };

  // Форматирование для режима работы
  const formatRezhim = (label, key) => {
    const value = data[key];
    let status;

    // Преобразуем значение в число, если это строка
    const numericValue = Number(value);

    if (numericValue === 1) {
      status = 'Работает';
    } else if (numericValue === 0) {
      status = 'Стоит';
    } else if (value !== undefined && value !== '') {
      status = value;
    } else {
      status = 'Нет данных';
    }

    const icon = getStatusIcon(isWorking, status); // Используем статус для иконки
    return `${icon}${label}: ${status}`;
  };

  const formatVremyaRaboti = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(isWorking, value); // Иконка зависит от статуса линии
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' ч.' : 'Нет данных'}`;
  };

  const formatBrak = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(isWorking, value); // Иконка зависит от статуса линии
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' шт.' : 'Нет данных'}`;
  };

  // Формируем параметры для отображения
  const parameters = [
    formatParameter('Левая лыжа', 'Лыжа левая ДОТ-ЭКО'),
    formatParameter('Правая лыжа', 'Лыжа правая ДОТ-ЭКО'),
    formatParameter('Сумма двух лыж', 'Сумма двух лыж ДОТ-ЭКО'),
  ];

  const rezhim = formatRezhim('Режим работы', 'Статус работы ДОТ-ЭКО');

  const brak = formatBrak('Брак', 'Брак ДОТ-ЭКО');

  const vremyaRaboti = formatVremyaRaboti('Время работы', 'Время работы ДОТ-ЭКО');

  // Получение времени записи на сервер с разделением даты и времени
  const serverTime = data['Время записи на сервер ДОТ-ЭКО']
    ? `${data['Время записи на сервер ДОТ-ЭКО'].slice(0, 10)} ${data['Время записи на сервер ДОТ-ЭКО'].slice(10)}`
    : 'Нет данных';

  // Объединение всех параметров в один массив
  const result = [
    `Линия ДОТ-ЭКО`,
    '',
    rezhim,
    '',
    `Время записи на сервер:  ${serverTime}`,
    '',
    'Кол-во изделий за смену:',
    ...parameters,
    '',
    'Кол-во брака за смену:',
    brak,
    '',
    'Часов в работе за смену:',
    vremyaRaboti,
    '',
    `Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`,
  ];

  // Возвращаем итоговый текст
  return result.join('\n');
};
