export const generateTableMpa = (data, mpaNumber, currentTime) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция для отображения статуса в зависимости от наличия данных
  const getStatusIcon = (value) => {
    return value === undefined || value === null || value === '' || value === 'Нет данных' ? '❓ ' : '✅ ';
  };

  // Форматирование температур с проверкой данных
  const formatTemp = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' °C' : 'Нет данных'}`;
  };

  // Форматирование давления с проверкой данных
  const formatPressure = (label, key) => {
    const value = data[key];
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' кгс/м2' : 'Нет данных'}`;
  };

  // Температуры
  const temperatures = [
    formatTemp('Верх регенератора левый', `Температура Верх регенератора левый МПА${mpaNumber}`),
    formatTemp('Верх регенератора правый', `Температура Верх регенератора правый МПА${mpaNumber}`),
    formatTemp('Верх ближний левый', `Температура Верх ближний левый МПА${mpaNumber}`),
    formatTemp('Верх ближний правый', `Температура Верх ближний правый МПА${mpaNumber}`),
    formatTemp('Верх дальний левый', `Температура Верх дальний левый МПА${mpaNumber}`),
    formatTemp('Верх дальний правый', `Температура Верх дальний правый МПА${mpaNumber}`),
    formatTemp('Середина ближняя левая', `Температура Середина ближняя левая МПА${mpaNumber}`),
    formatTemp('Середина ближняя правая', `Температура Середина ближняя правая МПА${mpaNumber}`),
    formatTemp('Низ ближний левый', `Температура Низ ближний левый МПА${mpaNumber}`),
    formatTemp('Низ ближний правый', `Температура Низ ближний правый МПА${mpaNumber}`),
    formatTemp('Низ дальний левый', `Температура Низ дальний левый МПА${mpaNumber}`),
    formatTemp('Низ дальний правый', `Температура Низ дальний правый МПА${mpaNumber}`),
    formatTemp('Камера смешения', `Температура Камера смешения МПА${mpaNumber}`),
    formatTemp('Дымовой боров', `Температура Дымовой боров МПА${mpaNumber}`),

  ];

  // Давления
  const pressures = [
    formatPressure('Дымовой боров', `Давление Дымовой боров МПА${mpaNumber}`),
    formatPressure('Воздух левый', `Давление Воздух левый МПА${mpaNumber}`),
    formatPressure('Воздух правый', `Давление Воздух правый МПА${mpaNumber}`),
    formatPressure('Низ ближний левый', `Давление Низ ближний левый МПА${mpaNumber}`),
    formatPressure('Низ ближний правый', `Давление Низ ближний правый МПА${mpaNumber}`),
    formatPressure('Середина ближняя левая', `Давление Середина ближняя левая МПА${mpaNumber}`),
    formatPressure('Середина ближняя правая', `Давление Середина ближняя правая МПА${mpaNumber}`),
    formatPressure('Середина дальняя левая', `Давление Середина дальняя левая МПА${mpaNumber}`),
    formatPressure('Середина дальняя правая', `Давление Середина дальняя правая МПА${mpaNumber}`),
    formatPressure('Верх дальний левый', `Давление Верх дальний левый МПА${mpaNumber}`),
    formatPressure('Верх дальний правый', `Давление Верх дальний правый МПА${mpaNumber}`),
  ];

  // Получение времени записи на сервер с разделением даты и времени
  const serverTime = data[`Время записи на сервер МПА${mpaNumber}`]
    ? `${data[`Время записи на сервер МПА${mpaNumber}`].slice(0, 10)} ${data[
        `Время записи на сервер МПА${mpaNumber}`
      ].slice(10)}`
    : 'Нет данных';

  // Объединение всех параметров в один массив
  const parameters = [
    `Режим работы МПА${mpaNumber}`,
    '',
    `Время записи на сервер: ${serverTime}`,
    '',
    'Температуры:',
    ...temperatures,
    '',
    'Давления:',
    ...pressures,
    '',
    `Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`, // Аналогично разделяем текущее время
  ];

  // Формирование итоговой строки
  return parameters.join('\n');
};
