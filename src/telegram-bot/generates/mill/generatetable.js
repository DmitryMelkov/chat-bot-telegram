export const generateTableMill = (dataAllMills, currentTime) => {
  if (!dataAllMills || Object.keys(dataAllMills).length === 0) {
    return `Нет данных для Мельниц.`;
  }

  // Функция для отображения статуса данных
  const getStatusIcon = (value) => {
    return value === undefined || value === null || value === '' || value === 'Нет данных' ? '❓ ' : '✅ ';
  };

  // Форматирование вибрации с проверкой данных
  const formatVibro = (label, value) => {
    const icon = getStatusIcon(value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' мм/с' : 'Нет данных'}`;
  };

  // Список для хранения всех строк таблицы
  const parameters = [];

  const millConfig = {
    'Мельница ШБМ №3 (к.10б)': ['Вертикальная вибрация ШБМ3', 'Поперечная вибрация ШБМ3', 'Осевая вибрация ШБМ3'],
    'Мельница YGM-9517 (к.10б)': ['Фронтальная вибрация YGM-9517', 'Поперечная вибрация YGM-9517', 'Осевая вибрация YGM-9517'],
    'Мельница YCVOK-130 (к.10б)': ['Фронтальная вибрация YCVOK-130', 'Поперечная вибрация YCVOK-130', 'Осевая вибрация YCVOK-130'],
    'Мельница №1 (к.296)': ['Фронтальная вибрация Мельница №1', 'Поперечная вибрация Мельница №1', 'Осевая вибрация Мельница №1'],
    'Мельница №2 (к.296)': ['Фронтальная вибрация Мельница №2', 'Поперечная вибрация Мельница №2', 'Осевая вибрация Мельница №2'],
  };

  // Извлекаем время записи на сервер из данных для Мельницы №1
  const serverTime = dataAllMills['Мельница №1 (к.296)']?.['Время записи на сервер для Мельницы №1'];

  // Генерация таблицы для каждой мельницы
  for (const [millName, data] of Object.entries(dataAllMills)) {
    if (millName !== 'Время записи на сервер') { // Пропускаем лишний ключ
      parameters.push(`${millName}`);
      parameters.push('');
    
      // Получаем список параметров для текущей мельницы
      const vibrationKeys = millConfig[millName];
    
      // Добавляем параметры вибрации в таблицу
      vibrationKeys.forEach((key) => {
        parameters.push(formatVibro(key.split(' ')[0], data[key]));
      });
    
      parameters.push('');
    }
  }
  
  // Добавляем общую информацию
  parameters.push(`Время записи на сервер: ${serverTime || 'Нет данных'}`);
  parameters.push('');
  parameters.push(`Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`); // Форматируем текущее время

  // Возвращаем итоговую строку
  return parameters.join('\n');
}; 