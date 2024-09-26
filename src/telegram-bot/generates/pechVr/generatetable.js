export const generateTablePechVr = (data, furnaceNumber, currentTime) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция проверки допустимого диапазона
  const checkRange = (value, min, max) => {
    const isFurnaceWorking = determineFurnaceMode() !== 'Печь не работает';

    if (!isFurnaceWorking) {
      return '❓ ';
    }

    if (min === undefined && max === undefined) {
      return '✅ ';
    }

    const transformedValue = parseFloat(value.replace(',', '.'));
    return transformedValue >= min && transformedValue <= max ? '✅ ' : '❌ ';
  };

  // Функция для определения режима печи
  const determineFurnaceMode = () => {
    const temper1SkolzVr1 = parseFloat(data[`Температура 1-СК печь ВР${furnaceNumber}`].replace(',', '.'));

    if (temper1SkolzVr1 < 550 && temper1SkolzVr1 > 50) {
      return 'Выход на режим';
    } else if (temper1SkolzVr1 >= 550) {
      return 'Установившийся режим';
    } else {
      return 'Печь не работает';
    }
  };

  // Форматирование температуры
  const formatTemp = (label, key, min, max, unit) => {
    const value = data[key];
    return `${checkRange(value, min, max)}${label}: ${value} ${unit}`;
  };

  // Параметры температур
  const temperatures = [
    formatTemp('1-СК', `Температура 1-СК печь ВР${furnaceNumber}`, 550, 800, '°C'),
    formatTemp('2-СК', `Температура 2-СК печь ВР${furnaceNumber}`, 0, 700, '°C'),
    formatTemp(
      '3-СК',
      `Температура 3-СК печь ВР${furnaceNumber}`,
      0,
      determineFurnaceMode() === 'Установившийся режим' ? 400 : 750,
      '°C'
    ),
    formatTemp('В топке', `Температура в топке печь ВР${furnaceNumber}`, 0, 1000, '°C'),
    formatTemp('Вверху камеры загрузки', `Температура вверху камеры загрузки печь ВР${furnaceNumber}`, 0, 1000, '°C'),
    formatTemp('Внизу камеры загрузки', `Температура внизу камеры загрузки печь ВР${furnaceNumber}`, 1000, 1100, '°C'),
    formatTemp('На входе печи дожига', `Температура на входе печи дожига печь ВР${furnaceNumber}`, 0, 1200, '°C'),
    formatTemp('На выходе печи дожига', `Температура на выходе печи дожига печь ВР${furnaceNumber}`, 0, 1200, '°C'),
    formatTemp('Камеры выгрузки', `Температура камеры выгрузки печь ВР${furnaceNumber}`, 0, 750, '°C'),
    formatTemp('Дымовых газов котла', `Температура дымовых газов котла печь ВР${furnaceNumber}`, 0, 1100, '°C'),
    formatTemp('Газов до скруббера', `Температура газов до скруббера печь ВР${furnaceNumber}`, 0, 400, '°C'),
    formatTemp('Газов после скруббера', `Температура газов после скруббера печь ВР${furnaceNumber}`, 0, 100, '°C'),
    formatTemp('Воды в ванне скруббер', `Температура воды в ванне скруббер печь ВР${furnaceNumber}`, 0, 90, '°C'),
    formatTemp('Гранул после холод-ка', `Температура гранул после холод-ка печь ВР${furnaceNumber}`, 0, 70, '°C'),
  ];

  // Форматирование уровня
  const formatLevel = (label, key, min, max, unit) => {
    const value = data[key];
    return `${checkRange(value, min, max)}${label}: ${value} ${unit}`;
  };

  // Параметры уровней
  const levels = [
    formatLevel('В ванне скруббера', `Уровень в ванне скруббера печь ВР${furnaceNumber}`, 250, 850, 'мм'),
    formatLevel('В емкости ХВО', `Уровень воды в емкости ХВО печь ВР${furnaceNumber}`, 1500, 4500, 'мм'),
    formatLevel('В барабане котла', `Уровень воды в барабане котла печь ВР${furnaceNumber}`, -100, 100, 'мм'),
  ];

  // Форматирование давления
  const formatPressure = (label, key, min, max, unit) => {
    const value = data[key];
    return `${checkRange(value, min, max)}${label}: ${value} ${unit}`;
  };

  // Параметры давления
  const pressures = [
    formatPressure('Газов после скруббера', `Давление газов после скруббера печь ВР${furnaceNumber}`, 0, 20, 'кгс/см2'),
    formatPressure('Пара в барабане котла', `Давление пара в барабане котла печь ВР${furnaceNumber}`, 0, 10, 'кгс/см2'),
  ];

  // Форматирование разрежения
  const formatVacuum = (label, key, min, max, unit) => {
    const value = data[key];
    return `${checkRange(value, min, max)}${label}: ${value} ${unit}`;
  };

  // Параметры разрежения
  const vacuums = [
    formatVacuum('В топке печи', `Разрежение в топке печи печь ВР${furnaceNumber}`, -4, -1, 'кгс/м2'),
    formatVacuum('В котле утилизаторе', `Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber}`, -12, -3, 'кгс/м2'),
    formatVacuum('Низ загрузочной камеры', `Разрежение низ загрузочной камеры печь ВР${furnaceNumber}`, -5, -1, 'кгс/м2'),
  ];

  // Форматирование исполнительных механизмов
  const formatIm = (label, key, unit) => {
    const isFurnaceWorking = determineFurnaceMode() !== 'Печь не работает';
    const value = data[key];
    const symbol = isFurnaceWorking ? '✅ ' : '❓ ';
    return `${symbol}${label}: ${value} ${unit}`;
  };

  // Параметры исполнительных механизмов
  const ims = [formatIm('Котла-утилизатора', `Исполнительный механизм котла ВР${furnaceNumber}`, '%')];

  // Форматирование мощности горелки
  const formatGorelka = (label, key, unit) => {
    const isFurnaceWorking = determineFurnaceMode() !== 'Печь не работает';
    const value = data[key];
    const symbol = isFurnaceWorking ? '✅ ' : '❓ ';
    return `${symbol}${label}: ${value} ${unit}`;
  };

// Параметры горелок
const gorelki = [formatGorelka('Мощность горелки', `Мощность горелки ВР${furnaceNumber}`, '%')];

  // Объединение всех параметров в один массив
  const parameters = [
    `Режим работы печи: ${determineFurnaceMode()}`,
    `Время записи на сервер: ${data[`Время записи на сервер для печь ВР${furnaceNumber}`].slice(0, 10)} ${data[`Время записи на сервер для печь ВР${furnaceNumber}`].slice(10)}`,
    '',
    'Температуры:',
    ...temperatures,
    '',
    'Уровни:',
    ...levels,
    '',
    'Давления:',
    ...pressures,
    '',
    'Разрежения:',
    ...vacuums,
    '',
    'Исполнительные механизмы:',
    ...ims,
    '',
    'Мощности горелки:',
    ...gorelki,
    '',
    `Обновлено: ${currentTime}`,
  ];

  // Формирование итоговой строки
  return ['Текущие параметры', `Печь карбонизации №${furnaceNumber}`, '', ...parameters].join('\n');
};
