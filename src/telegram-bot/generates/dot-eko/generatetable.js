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

export const generateTableDotEko = (document, currentTime) => {
  if (!document || !document.data) return 'Нет данных для отображения.';
  const data = document.data;

  // Функция для отображения иконки в зависимости от статуса работы
  const getStatusIcon = (isWorking, value) => {
    if (value === undefined || value === null || value === '' || value === 'Нет данных') {
      return '❓ ';
    }
    return isWorking ? '✅ ' : '❌ ';
  };

  // Определяем, работает ли линия
  const isWorking = Number(data.get('Статус работы ДОТ-ЭКО')) === 1;

  // Форматирование параметров с проверкой данных
  const formatParameter = (label, key) => {
    const value = data.get(key);
    const icon = getStatusIcon(isWorking, value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' шт.' : 'Нет данных'}`;
  };

  const formatRezhim = (label, key) => {
    const value = data.get(key);
    let status;

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

    const icon = getStatusIcon(isWorking, status);
    return `${icon}${label}: ${status}`;
  };

  const formatVremyaRaboti = (label, key) => {
    const value = data.get(key);
    const icon = getStatusIcon(isWorking, value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' ч.' : 'Нет данных'}`;
  };

  const formatBrak = (label, key) => {
    const value = data.get(key);
    const icon = getStatusIcon(isWorking, value);
    return `${icon}${label}: ${value !== undefined && value !== '' ? value + ' шт.' : 'Нет данных'}`;
  };

  const parameters = [
    formatParameter('Левая лыжа', 'Лыжа левая ДОТ-ЭКО'),
    formatParameter('Правая лыжа', 'Лыжа правая ДОТ-ЭКО'),
    formatParameter('Сумма двух лыж', 'Сумма двух лыж ДОТ-ЭКО'),
  ];

  const rezhim = formatRezhim('Статус работы', 'Статус работы ДОТ-ЭКО');
  const brak = formatBrak('Брак', 'Брак ДОТ-ЭКО');
  const vremyaRaboti = formatVremyaRaboti('Время работы', 'Время работы ДОТ-ЭКО');

  const serverTime = data.get('Время записи на сервер ДОТ-ЭКО')
    ? `${data.get('Время записи на сервер ДОТ-ЭКО').slice(0, 10)} ${data.get('Время записи на сервер ДОТ-ЭКО').slice(10)}`
    : 'Нет данных';

  const result = [
    `Линия ДОТ-ЭКО`,
    '',
    rezhim,
    '',
    `Время записи на сервер:  ${serverTime}`,
    '',
    'На данный момент доступен только просмотр режима работы',
    '',
    // 'Кол-во изделий за смену:',
    // ...parameters,
    // '',
    // 'Кол-во брака за смену:',
    // brak,
    // '',
    // 'Часов в работе за смену:',
    // vremyaRaboti,
    // '',
    `Обновлено: ${currentTime.slice(0, 10)} ${currentTime.slice(10)}`,
  ];

  return result.join('\n');
};

