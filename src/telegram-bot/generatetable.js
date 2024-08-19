export const generateTablePechVr = (data, furnaceNumber, currentTime) => {
  if (!data) return 'Нет данных для отображения.';

  // Функция проверки допустимого диапазона
  const checkRange = (value, min, max) => {
    // Проверяем, работает ли печь
    const isFurnaceWorking = data[`Печь ВР${furnaceNumber} Режим работы печи:`] !== 'Печь не работает';

    if (!isFurnaceWorking) {
      // Если печь не работает, возвращаем специальный символ, например знак вопроса
      return '❓ ';
    }

    // Если печь работает, проверяем диапазон
    const transformedValue = parseFloat(value.replace(',', '.'));
    return transformedValue >= min && transformedValue <= max ? '✅ ' : '❌ ';
  };

  const parameters = [
    `Режим работы печи: ${data[`Печь ВР${furnaceNumber} Режим работы печи:`]}`,
    `Время записи на сервер: ${data[`Время записи на сервер для печь ВР${furnaceNumber}`]}`,
    '',
    'Температуры:',
    ...[1, 2, 3].map((i) => {
      const value = data[`Температура ${i}-СК печь ВР${furnaceNumber}`];
      const min = i === 1 ? 550 : 0; // Минимальные значения
      const max = i === 1 ? 800 : (i === 2 ? 700 : (data[`Печь ВР${furnaceNumber} Режим работы печи:`] === 'Установившийся режим' ? 400 : 750));
      return `${checkRange(value, min, max)}Температура ${i}-СК печь ВР${furnaceNumber}: ${value} °C`;
    }),
    `${checkRange(data[`Температура в топке печь ВР${furnaceNumber}`], 0, 1000)}В топке:  ${data[`Температура в топке печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура вверху камеры загрузки печь ВР${furnaceNumber}`], 0, 1000)}Вверху камеры загрузки:  ${data[`Температура вверху камеры загрузки печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура внизу камеры загрузки печь ВР${furnaceNumber}`], 1000, 1100)}Внизу камеры загрузки:  ${data[`Температура внизу камеры загрузки печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура на входе печи дожига печь ВР${furnaceNumber}`], 0, 1200)}На входе печи дожига:  ${data[`Температура на входе печи дожига печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура на выходе печи дожига печь ВР${furnaceNumber}`], 0, 1200)}На выходе печи дожига:  ${data[`Температура на выходе печи дожига печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура камеры выгрузки печь ВР${furnaceNumber}`], 0, 750)}Камеры выгрузки:  ${data[`Температура камеры выгрузки печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура дымовых газов котла печь ВР${furnaceNumber}`], 0, 1100)}Дымовых газов котла:  ${data[`Температура дымовых газов котла печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура газов до скруббера печь ВР${furnaceNumber}`], 0, 400)}Газов до скруббера:  ${data[`Температура газов до скруббера печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура газов после скруббера печь ВР${furnaceNumber}`], 0, 100)}Газов после скруббера:  ${data[`Температура газов после скруббера печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура воды в ванне скруббер печь ВР${furnaceNumber}`], 0, 90)}Воды в ванне скруббер:  ${data[`Температура воды в ванне скруббер печь ВР${furnaceNumber}`]} °C`,
    `${checkRange(data[`Температура гранул после холод-ка печь ВР${furnaceNumber}`], 0, 70)}Гранул после холод-ка:  ${data[`Температура гранул после холод-ка печь ВР${furnaceNumber}`]} °C`,
    '',
    'Уровни:',
    `${checkRange(data[`Уровень в ванне скруббера печь ВР${furnaceNumber}`], 250, 850)}В ванне скруббера:   ${data[`Уровень в ванне скруббера печь ВР${furnaceNumber}`]} мм`,
    `${checkRange(data[`Уровень воды в емкости ХВО печь ВР${furnaceNumber}`], 1500, 4500)}В емкости ХВО:   ${data[`Уровень воды в емкости ХВО печь ВР${furnaceNumber}`]} мм`,
    `${checkRange(data[`Уровень воды в барабане котла печь ВР${furnaceNumber}`], -100, 100)}В барабане котла:   ${data[`Уровень воды в барабане котла печь ВР${furnaceNumber}`]} мм`,
    '',
    'Давления:',
    `${checkRange(data[`Давление газов после скруббера печь ВР${furnaceNumber}`], 0, 20)}Газов после скруббера:  ${data[`Давление газов после скруббера печь ВР${furnaceNumber}`]} кгс/см2`,
    `${checkRange(data[`Давление пара в барабане котла печь ВР${furnaceNumber}`], 0, 10)}Пара в барабане котла:  ${data[`Давление пара в барабане котла печь ВР${furnaceNumber}`]} кгс/см2`,
    '',
    'Разрежения:',
    `${checkRange(data[`Разрежение в топке печи печь ВР${furnaceNumber}`], -4, -1)}В топке печи:  ${data[`Разрежение в топке печи печь ВР${furnaceNumber}`]} кгс/м2`,
    `${checkRange(data[`Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber}`], -12, -3)}В котле утилизаторе:   ${data[`Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber}`]} кгс/м2`,
    `${checkRange(data[`Разрежение низ загрузочной камеры печь ВР${furnaceNumber}`], -5, -1)}Низ загрузочной камеры:   ${data[`Разрежение низ загрузочной камеры печь ВР${furnaceNumber}`]} кгс/м2`,
    '',
    `Обновлено: ${currentTime}`,
  ];

  return ['Текущие параметры', `Печь карбонизации №${furnaceNumber}`, '', ...parameters].join('\n');
};
