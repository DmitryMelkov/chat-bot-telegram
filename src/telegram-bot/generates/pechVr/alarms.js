import { editMessageWithButtons } from '../../editMessage.js';

export const checkAndNotify = (data, bot, chatId, furnaceNumber, messageId) => {
  // Получаем числовые значения напрямую без .replace
  const temper1Skolz = data[`Температура 1-СК печь ВР${furnaceNumber}`];
  const temper2kolz = data[`Температура 2-СК печь ВР${furnaceNumber}`];
  const temper3Skolz = data[`Температура 3-СК печь ВР${furnaceNumber}`];
  const temperTopka = data[`Температура в топке печь ВР${furnaceNumber}`];
  const temperVnizKamerZagruz = data[`Температура внизу камеры загрузки печь ВР${furnaceNumber}`];
  const temperVverhKamerZagruz = data[`Температура вверху камеры загрузки печь ВР${furnaceNumber}`];
  const temperVhodDojiga = data[`Температура на входе печи дожига печь ВР${furnaceNumber}`];
  const temperVykhodDojiga = data[`Температура на выходе печи дожига печь ВР${furnaceNumber}`];
  const temperKamVygruzki = data[`Температура камеры выгрузки печь ВР${furnaceNumber}`];
  const temperDymGaza = data[`Температура дымовых газов котла печь ВР${furnaceNumber}`];
  const temperGazDoSkrubbera = data[`Температура газов до скруббера печь ВР${furnaceNumber}`];
  const temperGazPosleSkrubbera = data[`Температура газов после скруббера печь ВР${furnaceNumber}`];
  const temperVodaSkrubber = data[`Температура воды в ванне скруббер печь ВР${furnaceNumber}`];
  const temperGranul = data[`Температура гранул после холод-ка печь ВР${furnaceNumber}`];
  const urovVannaSkrubber = data[`Уровень в ванне скруббера печь ВР${furnaceNumber}`];
  const urovVodaHVO = data[`Уровень воды в емкости ХВО печь ВР${furnaceNumber}`];
  const urovVodaBara = data[`Уровень воды в барабане котла печь ВР${furnaceNumber}`];
  const davlenieGazPosleSkrubbera = data[`Давление газов после скруббера печь ВР${furnaceNumber}`];
  const razrezenieTopka = data[`Разрежение в топке печи печь ВР${furnaceNumber}`];
  const razrezenieKotla = data[`Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber}`];
  const razrezenieNizZagruz = data[`Разрежение низ загрузочной камеры печь ВР${furnaceNumber}`];
  const timeRecorded = data[`Время записи на сервер для печь ВР${furnaceNumber}`]; // Время записи на сервер

  // Форматирование времени записи
  const formattedTimeRecorded = `${timeRecorded.slice(0, 10)} ${timeRecorded.slice(10)}`;

  // Определение режима работы печи
  const determineFurnaceMode = () => {
    if (temper1Skolz < 550 && temper1Skolz > 50) {
      return 'Выход на режим';
    } else if (temper1Skolz >= 550) {
      return 'Установившийся режим';
    } else {
      return 'Печь не работает';
    }
  };

  const mode = determineFurnaceMode();
  let alerts = [];

  if (mode === 'Печь не работает') {
    alerts.push('✅ Алармов нету, т.к. печь не работает.');
  } else {
    // Проверки для температурных параметров
    if (temper1Skolz < 550 || temper1Skolz > 800) {
      alerts.push(
        `❓ Температура 1-СК печь ВР${furnaceNumber} = ${temper1Skolz} °C, допустимый диапазон от 550 до 800`
      );
    }

    if (temper2kolz < 0 || temper2kolz > 700) {
      alerts.push(`❓ Температура 2-СК печь ВР${furnaceNumber} = ${temper2kolz} °C, допустимый диапазон от 0 до 700`);
    }

    if (mode === 'Выход на режим' && (temper3Skolz < 0 || temper3Skolz > 750)) {
      alerts.push(`❓ Температура 3-СК печь ВР${furnaceNumber} = ${temper3Skolz} °C, допустимый диапазон от 0 до 750`);
    } else if (mode === 'Установившийся режим' && (temper3Skolz < 0 || temper3Skolz > 400)) {
      alerts.push(`❓ Температура 3-СК печь ВР${furnaceNumber} = ${temper3Skolz} °C, допустимый диапазон от 0 до 400`);
    }

    if (temperTopka < 0 || temperTopka > 1000) {
      alerts.push(
        `❓ Температура в топке печь ВР${furnaceNumber} = ${temperTopka} °C, допустимый диапазон от 0 до 1000`
      );
    }

    if (temperVnizKamerZagruz < 1000 || temperVnizKamerZagruz > 1100) {
      alerts.push(
        `❓ Температура внизу камеры загрузки печь ВР${furnaceNumber} = ${temperVnizKamerZagruz} °C, допустимый диапазон от 1000 до 1100`
      );
    }

    if (temperKamVygruzki < 0 || temperKamVygruzki > 750) {
      alerts.push(
        `❓ Температура камеры выгрузки печь ВР${furnaceNumber} = ${temperKamVygruzki} °C, допустимый диапазон от 0 до 750`
      );
    }
    
    if (temperVverhKamerZagruz < 0 || temperVverhKamerZagruz > 1000) {
      alerts.push(
        `❓ Температура вверху камеры загрузки печь ВР${furnaceNumber} = ${temperVverhKamerZagruz} °C, допустимый диапазон от 0 до 1000`
      );
    }

    if (temperGranul < 0 || temperGranul > 70) {
      alerts.push(
        `❓ Температура гранул после холод-ка печь ВР${furnaceNumber} = ${temperGranul} °C, допустимый диапазон от 0 до 70`
      );
    }

    if (temperVhodDojiga < 0 || temperVhodDojiga > 1200) {
      alerts.push(
        `❓ Температура на входе печи дожига печь ВР${furnaceNumber} = ${temperVhodDojiga} °C, допустимый диапазон от 0 до 1200`
      );
    }

    if (temperVykhodDojiga < 0 || temperVykhodDojiga > 1200) {
      alerts.push(
        `❓ Температура на выходе печи дожига печь ВР${furnaceNumber} = ${temperVykhodDojiga} °C, допустимый диапазон от 0 до 1200`
      );
    }

    // Проверки для разрежения (строковые поля)
    const razrezenieTopkaTransform = parseFloat(razrezenieTopka.replace(',', '.'));
    if (razrezenieTopkaTransform < -4 || razrezenieTopkaTransform > -1) {
      alerts.push(
        `❓ Разрежение в топке печи печь ВР${furnaceNumber} = ${razrezenieTopkaTransform} кгс/м², допустимый диапазон от -4 до -1`
      );
    }

    const razrezenieNizZagruzTransform = parseFloat(razrezenieNizZagruz.replace(',', '.'));
    if (razrezenieNizZagruzTransform < -5 || razrezenieNizZagruzTransform > -1) {
      alerts.push(
        `❓ Разрежение низ загрузочной камеры печь ВР${furnaceNumber} = ${razrezenieNizZagruzTransform} кгс/м², допустимый диапазон от -5 до -1`
      );
    }

    const razrezenieKotlaTransform = parseFloat(razrezenieKotla.replace(',', '.'));
    if (razrezenieKotlaTransform < -12 || razrezenieKotlaTransform > -3) {
      alerts.push(
        `❓ Разрежение в пространстве котла утилизатора печь ВР${furnaceNumber} = ${razrezenieKotlaTransform} кгс/м², допустимый диапазон от -12 до -3`
      );
    }

    // Проверки для давления (строковые поля)
    const davlenieGazPosleSkrubberaTransform = parseFloat(davlenieGazPosleSkrubbera.replace(',', '.'));
    if (davlenieGazPosleSkrubberaTransform < 0 || davlenieGazPosleSkrubberaTransform > 20) {
      alerts.push(
        `❓ Давление газов после скруббера печь ВР${furnaceNumber} = ${davlenieGazPosleSkrubberaTransform} кгс/см², допустимый диапазон от 0 до 20`
      );
    }

    // Проверки для других температурных и уровневых параметров
    if (temperGazDoSkrubbera < 0 || temperGazDoSkrubbera > 400) {
      alerts.push(
        `❓ Температура газов до скруббера печь ВР${furnaceNumber} = ${temperGazDoSkrubbera} °C, допустимый диапазон от 0 до 400`
      );
    }

    if (temperGazPosleSkrubbera < 0 || temperGazPosleSkrubbera > 100) {
      alerts.push(
        `❓ Температура газов после скруббера печь ВР${furnaceNumber} = ${temperGazPosleSkrubbera} °C, допустимый диапазон от 0 до 100`
      );
    }

    if (temperVodaSkrubber < 0 || temperVodaSkrubber > 90) {
      alerts.push(
        `❓ Температура воды в ванне скруббер печь ВР${furnaceNumber} = ${temperVodaSkrubber} °C, допустимый диапазон от 0 до 90`
      );
    }

    if (temperDymGaza < 0 || temperDymGaza > 1100) {
      alerts.push(
        `❓ Температура дымовых газов котла печь ВР${furnaceNumber} = ${temperDymGaza} °C, допустимый диапазон от 0 до 1100`
      );
    }

    // Проверки для уровней воды (числовые поля)
    if (urovVodaHVO < 1500 || urovVodaHVO > 4500) {
      alerts.push(
        `❓ Уровень воды в емкости ХВО печь ВР${furnaceNumber} = ${urovVodaHVO} мм, допустимый диапазон от 1500 до 4500`
      );
    }

    if (urovVannaSkrubber < 250 || urovVannaSkrubber > 850) {
      alerts.push(
        `❓ Уровень в ванне скруббера печь ВР${furnaceNumber} = ${urovVannaSkrubber} мм, допустимый диапазон от 250 до 850`
      );
    }

    if (urovVodaBara < -100 || urovVodaBara > 100) {
      alerts.push(
        `❓ Уровень воды в барабане котла печь ВР${furnaceNumber} = ${urovVodaBara} мм, допустимый диапазон от -100 до 100`
      );
    }
  }

  const alertMessage =
    alerts.length > 0 ? alerts.map((alert) => `${alert}`).join('\n') : '✅ Все параметры в пределах нормы.\n';
  const lastUpdated = new Date().toLocaleString(); // Получаем текущее время

  // Добавляем кнопки "Назад", "Обновить данные" и "Текущие параметры"
  const buttons = [
    [
      { text: 'Текущие параметры', callback_data: `get_params_vr${furnaceNumber}` }, // Кнопка Текущие параметры
      { text: 'Обновить', callback_data: `check_alarms_vr${furnaceNumber}` },
    ],
    [{ text: 'Назад', callback_data: `furnace_vr${furnaceNumber}` }],
  ];

  // Обновляем текущее сообщение
  editMessageWithButtons(
    bot,
    chatId,
    messageId,
    `Режим работы печи: ${mode}\nВремя записи на сервер: ${formattedTimeRecorded}\n\nАлармы:\n${alertMessage}\n\nПоследнее обновление: ${lastUpdated}`,
    buttons
  );
};
