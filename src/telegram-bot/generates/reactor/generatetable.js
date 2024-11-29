export const generateTableReactor = (data, currentTime) => {
  if (!data) return `Нет данных для Смоляных реакторов (к.296).`;

  // Функция для отображения статуса данных
  const getStatusIcon = (value) => {
    return value === undefined || value === null || value === '' || value === 'Нет данных' ? '❓ ' : '✅ ';
  };

  // Форматирование температур с проверкой данных
  const formatTemp = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' °C' : 'Нет данных'}`;
  };

  // Форматирование разрежения с проверкой данных
  const formatLevel = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' мм' : 'Нет данных'}`;
  };

  // Список параметров для таблицы
  const parameters = [
    `Смоляные реактора (к.296)`,
    '',
    'Температуры:',
    formatTemp('Смоляного реактора №1', `Температура реактора 45/1`),
    formatTemp('Смоляного реактора №2', `Температура реактора 45/2`),
    formatTemp('Смоляного реактора №3', `Температура реактора 45/3`),
    formatTemp('Смоляного реактора №4', `Температура реактора 45/4`),

    '',
    'Уровни:',
    formatLevel('Смоляного реактора №1', `Уровень реактора 45/1`),
    formatLevel('Смоляного реактора №2', `Уровень реактора 45/2`),
    formatLevel('Смоляного реактора №3', `Уровень реактора 45/3`),
    formatLevel('Смоляного реактора №4', `Уровень реактора 45/4`),

    '',
    `Время записи на сервер: ${
      data[`Время записи на сервер для Смоляных реакторов`] || 'Нет данных'
    }`,
    '',
    `Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`, // Форматируем текущее время
  ];

  // Возвращаем итоговую строку
  return parameters.join('\n');
};
