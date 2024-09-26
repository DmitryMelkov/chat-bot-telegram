import axios from "axios";
import * as cheerio from "cheerio";

export async function fetchData() {
  try {
    const response = await axios.get('http://169.254.0.156/kaskad/Web_Clnt.dll/ShowPage?production/carbon/pechiVr/pechiVrTelegram.htm');
    const $ = cheerio.load(response.data);

    // Функция для извлечения данных по селекторам
    const extractData = (selectors) => selectors.map(selector => $(selector).text().trim());

    // Категории данных и их селекторы
    const categories = {
      temperatureVr1: [
        '.bot-vr1-temper-1-skolz', '.bot-vr1-temper-2-skolz', '.bot-vr1-temper-3-skolz',
        '.bot-vr1-temper-topka', '.bot-vr1-temper-verh-kam', '.bot-vr1-temper-niz-kam',
        '.bot-vr1-temper-vhod-pechi', '.bot-vr1-temper-vihod-dozhig', '.bot-vr1-temper-kamer-vygruz',
        '.bot-vr1-temper-kotel', '.bot-vr1-temper-do-skruber', '.bot-vr1-temper-posle-skruber',
        '.bot-vr1-temper-skruber', '.bot-vr1-temper-granul'
      ],
      temperatureVr2: [
        '.bot-vr2-temper-1-skolz', '.bot-vr2-temper-2-skolz', '.bot-vr2-temper-3-skolz',
        '.bot-vr2-temper-topka', '.bot-vr2-temper-verh-kam', '.bot-vr2-temper-niz-kam',
        '.bot-vr2-temper-vhod-pechi', '.bot-vr2-temper-vihod-dozhig', '.bot-vr2-temper-kamer-vygruz',
        '.bot-vr2-temper-kotel', '.bot-vr2-temper-do-skruber', '.bot-vr2-temper-posle-skruber',
        '.bot-vr2-temper-skruber', '.bot-vr2-temper-granul'
      ],
      levelVr1: ['.bot-vr1-uroven-skrubber', '.bot-vr1-uroven-hvo', '.bot-vr1-uroven-kotla'],
      levelVr2: ['.bot-vr2-uroven-skrubber', '.bot-vr2-uroven-hvo', '.bot-vr2-uroven-kotla'],
      pressureVr1: ['.bot-vr1-davl-posle-skruber', '.bot-vr1-davl-kotla'],
      pressureVr2: ['.bot-vr2-davl-posle-skruber', '.bot-vr2-davl-kotla'],
      underPressureVr1: ['.bot-vr1-razr-topka', '.bot-vr1-razr-kotel', '.bot-vr1-razr-niz-kam'],
      underPressureVr2: ['.bot-vr2-razr-topka', '.bot-vr2-razr-kotel', '.bot-vr2-razr-niz-kam'],
      imVr1: ['.bot-vr1-im-kotla'],
      imVr2: ['.bot-vr2-im-kotla'],
      gorelkaVr1: ['.bot-vr1-mosh-gorelki'],
      gorelkaVr2: ['.bot-vr2-mosh-gorelki'],
      timeVr: ['.bot-vr-time']
    };

    // Извлечение данных
    const data = {};
    for (const [key, selectors] of Object.entries(categories)) {
      data[key] = extractData(selectors);
    }

    // Присвоение имен
    const namedData = {
      'Температура 1-СК печь ВР1': data.temperatureVr1[0],
      'Температура 2-СК печь ВР1': data.temperatureVr1[1],
      'Температура 3-СК печь ВР1': data.temperatureVr1[2],
      'Температура в топке печь ВР1': data.temperatureVr1[3],
      'Температура вверху камеры загрузки печь ВР1': data.temperatureVr1[4],
      'Температура внизу камеры загрузки печь ВР1': data.temperatureVr1[5],
      'Температура на входе печи дожига печь ВР1': data.temperatureVr1[6],
      'Температура на выходе печи дожига печь ВР1': data.temperatureVr1[7],
      'Температура камеры выгрузки печь ВР1': data.temperatureVr1[8],
      'Температура дымовых газов котла печь ВР1': data.temperatureVr1[9],
      'Температура газов до скруббера печь ВР1': data.temperatureVr1[10],
      'Температура газов после скруббера печь ВР1': data.temperatureVr1[11],
      'Температура воды в ванне скруббер печь ВР1': data.temperatureVr1[12],
      'Температура гранул после холод-ка печь ВР1': data.temperatureVr1[13],
      'Уровень в ванне скруббера печь ВР1': data.levelVr1[0],
      'Уровень воды в емкости ХВО печь ВР1': data.levelVr1[1],
      'Уровень воды в барабане котла печь ВР1': data.levelVr1[2],
      'Давление газов после скруббера печь ВР1': data.pressureVr1[0],
      'Давление пара в барабане котла печь ВР1': data.pressureVr1[1],
      'Разрежение в топке печи печь ВР1': data.underPressureVr1[0],
      'Разрежение в пространстве котла утилизатора печь ВР1': data.underPressureVr1[1],
      'Разрежение низ загрузочной камеры печь ВР1': data.underPressureVr1[2],
      'Исполнительный механизм котла ВР1': data.imVr1[0],
      'Мощность горелки ВР1':data.gorelkaVr1[0] ,
      'Время записи на сервер для печь ВР1':data.timeVr[0],

      'Температура 1-СК печь ВР2': data.temperatureVr2[0],
      'Температура 2-СК печь ВР2': data.temperatureVr2[1],
      'Температура 3-СК печь ВР2': data.temperatureVr2[2],
      'Температура в топке печь ВР2': data.temperatureVr2[3],
      'Температура вверху камеры загрузки печь ВР2': data.temperatureVr2[4],
      'Температура внизу камеры загрузки печь ВР2': data.temperatureVr2[5],
      'Температура на входе печи дожига печь ВР2': data.temperatureVr2[6],
      'Температура на выходе печи дожига печь ВР2': data.temperatureVr2[7],
      'Температура камеры выгрузки печь ВР2': data.temperatureVr2[8],
      'Температура дымовых газов котла печь ВР2': data.temperatureVr2[9],
      'Температура газов до скруббера печь ВР2': data.temperatureVr2[10],
      'Температура газов после скруббера печь ВР2': data.temperatureVr2[11],
      'Температура воды в ванне скруббер печь ВР2': data.temperatureVr2[12],
      'Температура гранул после холод-ка печь ВР2': data.temperatureVr2[13],
      'Уровень в ванне скруббера печь ВР2': data.levelVr2[0],
      'Уровень воды в емкости ХВО печь ВР2': data.levelVr2[1],
      'Уровень воды в барабане котла печь ВР2': data.levelVr2[2],
      'Давление газов после скруббера печь ВР2': data.pressureVr2[0],
      'Давление пара в барабане котла печь ВР2': data.pressureVr2[1],
      'Разрежение в топке печи печь ВР2': data.underPressureVr2[0],
      'Разрежение в пространстве котла утилизатора печь ВР2': data.underPressureVr2[1],
      'Разрежение низ загрузочной камеры печь ВР2': data.underPressureVr2[2],
      'Исполнительный механизм котла ВР2': data.imVr2[0],
      'Мощность горелки ВР2':data.gorelkaVr2[0],
      'Время записи на сервер для печь ВР2':data.timeVr[0],
    };

    // console.log('Извлеченные данные:', namedData);

    for (const [key, value] of Object.entries(namedData)) {
      await axios.post('http://169.254.7.86:3001/update-values', { [key]: value });
      // await axios.post('http://169.254.0.167:3001/update-values', { [key]: value });

    }
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};

setInterval(fetchData, 30000);