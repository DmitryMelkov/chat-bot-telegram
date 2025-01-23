export const generateTableMill = (dataAllMills, currentTime) => {
  if (!dataAllMills || Object.keys(dataAllMills).length === 0) {
    return `Нет данных для Мельниц.`;
  }

  const getStatusIcon = (value) => {
    return value === undefined || value === null || value === '' || value === 'Нет данных' ? '❓ ' : '✅ ';
  };

  const formatVibro = (label, value) => {
    const icon = getStatusIcon(value);
    const displayValue = value !== undefined && value !== '' ? `${value} мм/с` : 'Нет данных';
    return `${icon}${label}: ${displayValue}`;
  };

  const output = [];

  const millConfig = {
    'Мельница ШБМ №3 (к.10б)': ['Вертикальная вибрация ШБМ3', 'Поперечная вибрация ШБМ3', 'Осевая вибрация ШБМ3'],
    'Мельница YGM-9517 (к.10б)': ['Фронтальная вибрация YGM-9517', 'Поперечная вибрация YGM-9517', 'Осевая вибрация YGM-9517'],
    'Мельница YCVOK-130 (к.10б)': ['Фронтальная вибрация YCVOK-130', 'Поперечная вибрация YCVOK-130', 'Осевая вибрация YCVOK-130'],
    'Мельница №1 (к.296)': ['Фронтальная вибрация Мельница №1', 'Поперечная вибрация Мельница №1', 'Осевая вибрация Мельница №1'],
    'Мельница №2 (к.296)': ['Фронтальная вибрация Мельница №2', 'Поперечная вибрация Мельница №2', 'Осевая вибрация Мельница №2'],
  };

  for (const millName in millConfig) {
    const data = dataAllMills[millName];
    if (data) {
      output.push(`${millName}\n\n`);

      const vibrationKeys = millConfig[millName];
      vibrationKeys.forEach((key) => {
        const label = key.split(' ')[0];
        output.push(formatVibro(label, data[key]), '\n');
      });

      output.push('\n');
    } else {
      output.push(`${millName}\n\nНет данных\n\n`);
    }
  }

  output.push(`Обновлено: ${currentTime}\n`);

  return output.join('');
};