// Функция для получения понятного названия устройства
const getDeviceName = (key) => {
  switch (
    key.toLowerCase() // Приводим ключ к нижнему регистру для соответствия
  ) {
    case 'dd569':
      return 'УТВХ от к.265 магистраль';
    case 'dd576':
      return 'Carbon к. 10в1 общий коллектор';
    case 'dd923':
      return 'Котел утилизатор №1';
    case 'dd924':
      return 'Котел утилизатор №2';
    case 'de093':
      return 'МПА №2';
    case 'dd972':
      return 'МПА №3';
    case 'dd973':
      return 'МПА №4';
    default:
      return key; // Возвращаем оригинальный ключ, если нет замены
  }
};

export const generateEnergyResourcesTable = (data, currentTime) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция для отображения статуса в зависимости от наличия данных
  const getStatusIcon = (value) => {
    return value === undefined || value === null || value === '' || value === 'Нет данных' ? '❓ ' : '✅ ';
  };

  // Форматирование данных с проверкой
  const formatValue = (label, value, unit = '') => {
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + (unit ? ` ${unit}` : '') : 'Нет данных'}`;
  };

  // Инициализация массива для сбора строк таблицы
  const output = [];

  // Перебираем каждое устройство в данных
  for (const [key, item] of Object.entries(data)) {
    const { device, data: deviceData, lastUpdated } = item;

    // Получаем понятное название устройства
    const readableDeviceName = getDeviceName(device); // Используем device для получения названия

    // Добавляем информацию об устройстве
    output.push(`${readableDeviceName}`);
    output.push(`Время записи на сервер: ${lastUpdated}`);

    // Добавляем данные устройства
    output.push(formatValue('Гкал/ч', deviceData[`Гкал/ч ${device}`]));
    output.push(formatValue('Температура', deviceData[`Температура ${device}`], '°C'));
    output.push(formatValue('Давление', deviceData[`Давление ${device}`], 'кгс/м²'));
    output.push(formatValue('Куб/ч', deviceData[`Куб/ч ${device}`]));
    output.push(formatValue('Тонн/ч', deviceData[`Тонн/ч ${device}`]));
    output.push(formatValue('Накопленно тонн', deviceData[`Накопленно тонн ${device}`]));

    output.push(''); // Пустая строка для разделения устройств
  }

  // Добавляем текущее время обновления
  output.push(`Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`);

  // Формирование итоговой строки
  return output.join('\n');
};
