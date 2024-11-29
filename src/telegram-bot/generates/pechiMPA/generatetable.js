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
    formatTemp('Верх регенератора левый', `Температура верх регенератора левый МПА${mpaNumber}`),
    formatTemp('Верх регенератора правый', `Температура верх регенератора правый МПА${mpaNumber}`),
    formatTemp('Верх ближний левый', `Температура верх ближний левый МПА${mpaNumber}`),
    formatTemp('Верх ближний правый', `Температура верх ближний правый МПА${mpaNumber}`),
    formatTemp('Верх дальний левый', `Температура верх дальний левый МПА${mpaNumber}`),
    formatTemp('Верх дальний правый', `Температура верх дальний правый МПА${mpaNumber}`),
    formatTemp('Середина ближняя левая', `Температура середина ближняя левый МПА${mpaNumber}`),
    formatTemp('Середина ближняя правая', `Температура середина ближняя правый МПА${mpaNumber}`),
    formatTemp('Низ ближний левый', `Температура низ ближний левый МПА${mpaNumber}`),
    formatTemp('Низ ближний правый', `Температура низ ближний правый МПА${mpaNumber}`),
    formatTemp('Низ дальний левый', `Температура низ дальний левый МПА${mpaNumber}`),
    formatTemp('Низ дальний правый', `Температура низ дальний правый МПА${mpaNumber}`),
    formatTemp('Камера сгорания', `Температура камера сгорания МПА${mpaNumber}`),
    formatTemp('Дымовой боров', `Температура дымовой боров МПА${mpaNumber}`),

  ];

  // Давления
  const pressures = [
    formatPressure('Дымовой боров', `Разрежение дымовой боров МПА${mpaNumber}`),
    formatPressure('Воздух левый', `Давление воздух левый МПА${mpaNumber}`),
    formatPressure('Воздух правый', `Давление воздух правый МПА${mpaNumber}`),
    formatPressure('Низ ближний левый', `Давление низ ближний левый МПА${mpaNumber}`),
    formatPressure('Низ ближний правый', `Давление низ ближний правый МПА${mpaNumber}`),
    formatPressure('Середина ближняя левая', `Давление середина ближняя левый МПА${mpaNumber}`),
    formatPressure('Середина ближняя правая', `Давление середина ближняя правый МПА${mpaNumber}`),
    formatPressure('Середина дальняя левая', `Давление середина дальняя левый МПА${mpaNumber}`),
    formatPressure('Середина дальняя правая', `Давление середина дальняя правый МПА${mpaNumber}`),
    formatPressure('Верх дальний левый', `Давление верх дальний левый МПА${mpaNumber}`),
    formatPressure('Верх дальний правый', `Давление верх дальний правый МПА${mpaNumber}`),
  ];

  // Получение времени записи на сервер с разделением даты и времени
  const serverTime = data[`Время записи на сервер для печь МПА${mpaNumber}`]
    ? `${data[`Время записи на сервер для печь МПА${mpaNumber}`].slice(0, 10)} ${data[
        `Время записи на сервер для печь МПА${mpaNumber}`
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
