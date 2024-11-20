export const generateTableSushilka = (data, sushilkaNumber, currentTime) => {
  if (!data) return `Нет данных для Сушилки ${sushilkaNumber}.`;

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
  const formatVacuum = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' кгс/м2' : 'Нет данных'}`;
  };

  // Форматирование мощности горелки
  const formatBurnerPower = (key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}Мощность горелки: ${value !== undefined && value !== '' ? value + ' %' : 'Нет данных'}`;
  };

  // Список параметров для таблицы
  const parameters = [
    `Сушилка №${sushilkaNumber}`,
    '',
    'Температуры:',
    formatTemp('Температура в топке', `Температура в топке Сушилка${sushilkaNumber}`),
    formatTemp('Температура в камере смешения', `Температура в камере смешения Сушилка${sushilkaNumber}`),
    formatTemp('Температура уходящих газов', `Температура уходящих газов Сушилка${sushilkaNumber}`),
    '',
    'Разрежения:',
    formatVacuum('Разрежение в топке', `Разрежение в топке Сушилка${sushilkaNumber}`),
    formatVacuum('Разрежение в камере выгрузки', `Разрежение в камере выгрузки Сушилка${sushilkaNumber}`),
    formatVacuum('Разрежение воздуха на разбавление', `Разрежение воздуха на разбавление Сушилка${sushilkaNumber}`),
    '',
    formatBurnerPower(`Мощность горелки №${sushilkaNumber} Сушилка${sushilkaNumber}`),
    '',
    `Время записи на сервер: ${
      data[`Время записи на сервер для Сушилка${sushilkaNumber}`] || 'Нет данных'
    }`,
    '',
    `Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`, // Форматируем текущее время
  ];

  // Возвращаем итоговую строку
  return parameters.join('\n');
};
