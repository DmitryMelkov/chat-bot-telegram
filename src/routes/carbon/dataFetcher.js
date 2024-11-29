import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite'; // Подключаем библиотеку для преобразования кодировок
import { FurnaceVR1, FurnaceVR2 } from '../../models/FurnanceModel.js';
import { Sushilka1, Sushilka2 } from '../../models/SushilkaModel.js';

export async function fetchData() {
  try {
    const responseNotis = await axios.get(
      'http://169.254.0.164/kaskad/Web_Clnt.dll/ShowPage?production/carbon/notisi/pechiVrNotisTelegram.htm',
      { responseType: 'arraybuffer' } // Указываем тип ответа
    );

    // Преобразуем данные в нужную кодировку (Windows-1251)
    const decodedDataNotis = iconv.decode(Buffer.from(responseNotis.data), 'windows-1251');

    // Парсинг данных с помощью cheerio
    const $Notis = cheerio.load(decodedDataNotis);


    const extractData = (selectors, $) => selectors.map((selector) => $(selector).text().trim());

    const categoriesNotis = {
      doseVr1: [
        '.bot-vr1-dose-g-min',
        '.bot-vr1-dose-kg-h',
        '.bot-vr1-dose-g',
        '.bot-vr1-dose-number-pieces',
        '.bot-vr1-total-weight-tons',
        '.bot-vr1-test',
      ],
      doseVr2: [
        '.bot-vr2-dose-g-min',
        '.bot-vr2-dose-kg-h',
        '.bot-vr2-dose-g',
        '.bot-vr2-dose-number-pieces',
        '.bot-vr2-total-weight-tons',
        '.bot-vr2-test',
      ],
      timeNotis: ['.bot-vr-notis-time'],
    };

    const data = {};

    for (const [key, selectors] of Object.entries(categoriesNotis)) {
      data[key] = extractData(selectors, $Notis);
    }

    const namedData = {

      // Дозаторы Нотис ВР1
      'Нотис ВР1 Г/мин': data.doseVr1[0],
      'Нотис ВР1 Кг/час': data.doseVr1[1],
      'Нотис ВР1 Общий вес в граммах': data.doseVr1[2],
      'Нотис ВР1 Количество штук': data.doseVr1[3],
      'Нотис ВР1 Общий вес в тоннах': data.doseVr1[4],
      'Время записи на сервер Нотис ВР1': data.timeNotis[0],

      // Дозаторы Нотис ВР2
      'Нотис ВР2 Г/мин': data.doseVr2[0],
      'Нотис ВР2 Кг/час': data.doseVr2[1],
      'Нотис ВР2 Общий вес в граммах': data.doseVr2[2],
      'Нотис ВР2 Количество штук': data.doseVr2[3],
      'Нотис ВР2 Общий вес в тоннах': data.doseVr2[4],
      'Время записи на сервер Нотис ВР2': data.timeNotis[0],
    };

    for (const [key, value] of Object.entries(namedData)) {
      try {
        const response = await axios.post('http://169.254.6.19:3001/update-values', JSON.stringify({ [key]: value }), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(
          `Ошибка при отправке данных для ключа: ${key}`,
          error.response ? error.response.data : error.message
        );
      }
    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error.message);
  }
}

setInterval(fetchData, 10000);

// Функция для получения и отправки данных VR1 и VR2 в формате с конкретными названиями
export async function fetchDataVR() {
  try {
    // Запрашиваем данные для VR1 и VR2
    const responseVr1 = await axios.get('http://169.254.0.156:3002/api/vr1-data');
    const responseVr2 = await axios.get('http://169.254.0.156:3002/api/vr2-data');

    // Проверяем, что данные получены
    if (!responseVr1.data || !responseVr2.data) {
      console.error('Ошибка: данные VR1 или VR2 не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные для VR1
    const vr1Data = responseVr1.data;
    const vr2Data = responseVr2.data;

    // Формируем объекты с конкретными названиями полей, как в старом примере
    const namedVr1Data = {
      'Температура 1-СК печь ВР1': vr1Data.temperatures['1-СК'],
      'Температура 2-СК печь ВР1': vr1Data.temperatures['2-СК'],
      'Температура 3-СК печь ВР1': vr1Data.temperatures['3-СК'],
      'Температура в топке печь ВР1': vr1Data.temperatures['В топке'],
      'Температура вверху камеры загрузки печь ВР1': vr1Data.temperatures['Вверху камеры загрузки'],
      'Температура внизу камеры загрузки печь ВР1': vr1Data.temperatures['Внизу камеры загрузки'],
      'Температура на входе печи дожига печь ВР1': vr1Data.temperatures['На входе печи дожига'],
      'Температура на выходе печи дожига печь ВР1': vr1Data.temperatures['На выходе печи дожига'],
      'Температура камеры выгрузки печь ВР1': vr1Data.temperatures['Камеры выгрузки'],
      'Температура дымовых газов котла печь ВР1': vr1Data.temperatures['Дымовых газов котла'],
      'Температура газов до скруббера печь ВР1': vr1Data.temperatures['Газов до скруббера'],
      'Температура газов после скруббера печь ВР1': vr1Data.temperatures['Газов после скруббера'],
      'Температура воды в ванне скруббер печь ВР1': vr1Data.temperatures['Воды в ванне скруббера'],
      'Температура гранул после холод-ка печь ВР1': vr1Data.temperatures['Гранул после холод-ка'],
      'Уровень в ванне скруббера печь ВР1': vr1Data.levels['В ванне скруббера'].value,
      'Уровень воды в емкости ХВО печь ВР1': vr1Data.levels['В емкости ХВО'].value,
      'Уровень воды в барабане котла печь ВР1': vr1Data.levels['В барабане котла'].value,
      'Давление газов после скруббера печь ВР1': vr1Data.pressures['Давление газов после скруббера'],
      'Давление пара в барабане котла печь ВР1': vr1Data.pressures['Пара в барабане котла'],
      'Разрежение в топке печи печь ВР1': vr1Data.vacuums['В топке печи'],
      'Разрежение в пространстве котла утилизатора печь ВР1': vr1Data.vacuums['В котле утилизаторе'],
      'Разрежение низ загрузочной камеры печь ВР1': vr1Data.vacuums['Низ загрузочной камеры'],
      'Исполнительный механизм котла печь ВР1': vr1Data.im['ИМ5 котел-утилизатор'],
      'Мощность горелки печь ВР1': vr1Data.gorelka['Мощность горелки №1'],
      'Время записи на сервер для печь ВР1': vr1Data.lastUpdated,
    };

    const namedVr2Data = {
      'Температура 1-СК печь ВР2': vr2Data.temperatures['1-СК'],
      'Температура 2-СК печь ВР2': vr2Data.temperatures['2-СК'],
      'Температура 3-СК печь ВР2': vr2Data.temperatures['3-СК'],
      'Температура в топке печь ВР2': vr2Data.temperatures['В топке'],
      'Температура вверху камеры загрузки печь ВР2': vr2Data.temperatures['Вверху камеры загрузки'],
      'Температура внизу камеры загрузки печь ВР2': vr2Data.temperatures['Внизу камеры загрузки'],
      'Температура на входе печи дожига печь ВР2': vr2Data.temperatures['На входе печи дожига'],
      'Температура на выходе печи дожига печь ВР2': vr2Data.temperatures['На выходе печи дожига'],
      'Температура камеры выгрузки печь ВР2': vr2Data.temperatures['Камеры выгрузки'],
      'Температура дымовых газов котла печь ВР2': vr2Data.temperatures['Дымовых газов котла'],
      'Температура газов до скруббера печь ВР2': vr2Data.temperatures['Газов до скруббера'],
      'Температура газов после скруббера печь ВР2': vr2Data.temperatures['Газов после скруббера'],
      'Температура воды в ванне скруббер печь ВР2': vr2Data.temperatures['Воды в ванне скруббера'],
      'Температура гранул после холод-ка печь ВР2': vr2Data.temperatures['Гранул после холод-ка'],
      'Уровень в ванне скруббера печь ВР2': vr2Data.levels['В ванне скруббера'].value,
      'Уровень воды в емкости ХВО печь ВР2': vr2Data.levels['В емкости ХВО'].value,
      'Уровень воды в барабане котла печь ВР2': vr2Data.levels['В барабане котла'].value,
      'Давление газов после скруббера печь ВР2': vr2Data.pressures['Давление газов после скруббера'],
      'Давление пара в барабане котла печь ВР2': vr2Data.pressures['Пара в барабане котла'],
      'Разрежение в топке печи печь ВР2': vr2Data.vacuums['В топке печи'],
      'Разрежение в пространстве котла утилизатора печь ВР2': vr2Data.vacuums['В котле утилизаторе'],
      'Разрежение низ загрузочной камеры печь ВР2': vr2Data.vacuums['Низ загрузочной камеры'],
      'Исполнительный механизм котла печь ВР2': vr2Data.im['ИМ5 котел-утилизатор'],
      'Мощность горелки печь ВР2': vr2Data.gorelka['Мощность горелки №2'],
      'Время записи на сервер для печь ВР2': vr2Data.lastUpdated,
    };

    // Сохраняем данные для VR1
    await FurnaceVR1.create({
      data: namedVr1Data,
      timestamp: new Date(),
    });

    // Сохраняем данные для VR2
    await FurnaceVR2.create({
      data: namedVr2Data,
      timestamp: new Date(),
    });

    // console.log('Данные VR1 и VR2 успешно сохранены.');
  } catch (error) {
    console.error('Ошибка при получении данных для VR1 и VR2:', error.message);
  }
}

// Устанавливаем интервал обновления данных каждые 10 секунд
setInterval(fetchDataVR, 10000);

// Функция для получения и отправки данных Сушилок в формате с конкретными названиями
export async function fetchDataSushka() {
  try {
    // Запрашиваем данные для Сушилок
    const responseSushka1 = await axios.get('http://169.254.0.156:3002/api/sushilka1-data');
    const responseSushka2 = await axios.get('http://169.254.0.156:3002/api/sushilka2-data');

    // Проверяем, что данные получены
    if (!responseSushka1.data || !responseSushka2.data) {
      console.error('Ошибка: данные для одной из Сушилок не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные для Сушилок
    const sushka1Data = responseSushka1.data;
    const sushka2Data = responseSushka2.data;

    // Формируем объекты с конкретными названиями полей, как в старом примере
    const namedSushka1Data = {
      'Температура в топке Сушилка1': sushka1Data.temperatures['Температура в топке'],
      'Температура в камере смешения Сушилка1': sushka1Data.temperatures['Температура в камере смешения'],
      'Температура уходящих газов Сушилка1': sushka1Data.temperatures['Температура уходящих газов'],
      'Разрежение в топке Сушилка1': sushka1Data.vacuums['Разрежение в топке'],
      'Разрежение в камере выгрузки Сушилка1': sushka1Data.vacuums['Разрежение в камере выгрузки'],
      'Разрежение воздуха на разбавление Сушилка1': sushka1Data.vacuums['Разрежение воздуха на разбавление'],
      'Мощность горелки №1 Сушилка1': sushka1Data.gorelka['Мощность горелки №1'],
      'Время записи на сервер для Сушилка1': sushka1Data.lastUpdated,
    };

    const namedSushka2Data = {
      'Температура в топке Сушилка2': sushka2Data.temperatures['Температура в топке'],
      'Температура в камере смешения Сушилка2': sushka2Data.temperatures['Температура в камере смешения'],
      'Температура уходящих газов Сушилка2': sushka2Data.temperatures['Температура уходящих газов'],
      'Разрежение в топке Сушилка2': sushka2Data.vacuums['Разрежение в топке'],
      'Разрежение в камере выгрузки Сушилка2': sushka2Data.vacuums['Разрежение в камере выгрузки'],
      'Разрежение воздуха на разбавление Сушилка2': sushka2Data.vacuums['Разрежение воздуха на разбавление'],
      'Мощность горелки №2 Сушилка2': sushka2Data.gorelka['Мощность горелки №2'],
      'Время записи на сервер для Сушилка2': sushka2Data.lastUpdated,
    };

    // Сохраняем данные для Сушилки1
    await Sushilka1.create({
      data: namedSushka1Data,
      timestamp: new Date(),
    });

    // Сохраняем данные для Сушилки2
    await Sushilka2.create({
      data: namedSushka2Data,
      timestamp: new Date(),
    });

    // console.log('Данные Сушилок успешно сохранены.');
  } catch (error) {
    console.error('Ошибка при получении данных для Сушилок:', error.message);
  }
}

setInterval(fetchDataSushka, 10000);