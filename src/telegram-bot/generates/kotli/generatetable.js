export const generateTableUtvhKotel = (data, kotelNumber, currentTime) => {
  if (!data) {
    console.log('Данные отсутствуют (data is null или undefined).');
    return 'Нет данных для отображения.';
  }

  // Проверяем, есть ли вложенный объект data
  const actualData = data.data ? data.data : data;

  // Преобразуем объект Mongoose в обычный JavaScript-объект, включая Map
  const cleanData = actualData.toObject
    ? actualData.toObject({ flattenMaps: true }) // Преобразуем Map в объекты
    : actualData;

  // Функция для отображения статуса в зависимости от наличия данных
  const getStatusIcon = (value, isAlarm = false) => {
    if (value === undefined || value === null || value === '' || value === 'Нет данных') {
      return '❓ '; // Нет данных
    }
    if (isAlarm) {
      return value ? '❌ ' : '✅ '; // Для аварийных сигналов: ❌ если true, иначе ✅
    }
    return '✅ '; // Для остальных параметров: всегда ✅
  };

  // Общая функция для форматирования параметров
  const formatData = (label, key, unit = '', isBoolean = false, section = 'parameters', isAlarm = false) => {
    const sectionData = cleanData[section]; // Получаем раздел
    const value = sectionData ? sectionData[key] : undefined; // Получаем значение, если раздел существует
    const icon = getStatusIcon(value, isAlarm);
    if (isBoolean) {
      return `${icon}${label}: ${value !== undefined && value !== '' ? (value ? 'Котел в работе' : 'Котел не работает') : 'Нет данных'}`;
    }
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' ' + unit : 'Нет данных'}`;
  };

  // Параметры
  const parameters = [
    formatData('Уровень в барабане', `Уровень в барабане котел №${kotelNumber}`, 'мм', false, 'parameters'),
    // formatData('Расход питательной воды', `Расход питательной воды котел №${kotelNumber}`, 'м³/ч', false, 'parameters'),
    formatData('Разрежение в топке', `Разрежение в топке котел №${kotelNumber}`, 'кгс/м²', false, 'parameters'),
    formatData('Давление воздуха', `Давление воздуха котел №${kotelNumber}`, 'кгс/м²', false, 'parameters'),
    formatData('Давление газа', `Давление газа котел №${kotelNumber}`, 'кгс/м²', false, 'parameters'),
    formatData('Давление пара', `Давление пара котел №${kotelNumber}`, 'кгс/м²', false, 'parameters'),
    // formatData('Расход пара', `Расход пара котел №${kotelNumber}`, 'м³/ч', false, 'parameters'),
  ];

  // Информация
  const info = [
    formatData('Режим', `Рабочий режим котел №${kotelNumber}`, '', true, 'info'),
  ];


  // ИМ (исполнительные механизмы)
  const im = [
    formatData('ИМ уровня', `ИМ уровня котел №${kotelNumber}`, '%', false, 'im'),
    formatData('ИМ разрежения', `ИМ разрежения котел №${kotelNumber}`, '%', false, 'im'),
    formatData('ИМ воздуха', `ИМ воздуха котел №${kotelNumber}`, '%', false, 'im'),
    formatData('ИМ газа', `ИМ газа котел №${kotelNumber}`, '%', false, 'im'),
  ];

  // Другие параметры
  const others = [
    formatData('Задание на уровень', `Задание на уровень котел №${kotelNumber}`, 'мм', false, 'others'),
  ];

  // Получение времени записи на сервер
  const serverTime = cleanData.lastUpdated || 'Нет данных';

  // Объединение всех параметров в один массив
  const allParameters = [
    `Текущие параметры Котла №${kotelNumber}`,
    '',
    ...info,
    '',
    `Время записи на сервер: ${serverTime}`,
    '',
    'Параметры:',
    ...parameters,
    '',
    'ИМ (исполнительные механизмы):',
    ...im,
    '',
    'Другие параметры:',
    ...others,
    '',
    `Обновлено: ${currentTime}`,
  ];

  // Формирование итоговой строки
  return allParameters.join('\n');
};