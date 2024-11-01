import axios from 'axios';
import * as cheerio from 'cheerio';
import iconv from 'iconv-lite'; // Подключаем библиотеку для преобразования кодировок

export async function fetchData() {
  try {
    const responseNotis = await axios.get(
      'http://169.254.0.164/kaskad/Web_Clnt.dll/ShowPage?production/carbon/notisi/pechiVrNotisTelegram.htm',
      { responseType: 'arraybuffer' } // Указываем тип ответа
    );

    // Добавляем страницу для МПА
    const responseMpa = await axios.get(
      'http://techsite4/kaskad/Web_Clnt.dll/ShowPage?production/carbon/pechiMPA/MPATelegram.htm',
      { responseType: 'arraybuffer' } // Указываем тип ответа
    );

    // Преобразуем данные в нужную кодировку (Windows-1251)
    const decodedDataNotis = iconv.decode(Buffer.from(responseNotis.data), 'windows-1251');
    const decodedDataMpa = iconv.decode(Buffer.from(responseMpa.data), 'windows-1251');

    // Парсинг данных с помощью cheerio
    const $Notis = cheerio.load(decodedDataNotis);
    const $Mpa = cheerio.load(decodedDataMpa);

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

    const categoriesPechiMpa = {
      temperatureMpa2: [
        '.bot-temper-verh-regenerator-left-mpa2',
        '.bot-temper-verh-regenerator-right-mpa2',
        '.bot-temper-verh-bliznii-left-mpa2',
        '.bot-temper-verh-bliznii-right-mpa2',
        '.bot-temper-verh-dalnii-left-mpa2',
        '.bot-temper-verh-dalnii-right-mpa2',
        '.bot-temper-seredina-bliznii-left-mpa2',
        '.bot-temper-seredina-bliznii-right-mpa2',
        '.bot-temper-seredina-dalnii-left-mpa2',
        '.bot-temper-seredina-dalnii-right-mpa2',
        '.bot-temper-niz-bliznii-left-mpa2',
        '.bot-temper-niz-bliznii-right-mpa2',
        '.bot-temper-niz-dalnii-left-mpa2',
        '.bot-temper-niz-dalnii-right-mpa2',
        '.bot-temper-kamera-smeshenia-mpa2',
        '.bot-temper-dymovoi-borov-mpa2',
      ],
      pressureMpa2: [
        '.bot-davl-dymovoi-borov-mpa2',
        '.bot-davl-vozduh-left-mpa2',
        '.bot-davl-vozduh-right-mpa2',
        '.bot-davl-niz-bliznii-left-mpa2',
        '.bot-davl-niz-bliznii-right-mpa2',
        '.bot-davl-seredina-bliznii-left-mpa2',
        '.bot-davl-seredina-bliznii-right-mpa2',
        '.bot-davl-seredina-dalnii-left-mpa2',
        '.bot-davl-seredina-dalnii-right-mpa2',
        '.bot-davl-verh-dalnii-left-mpa2',
        '.bot-davl-verh-dalnii-right-mpa2',
      ],
      temperatureMpa3: [
        '.bot-temper-verh-regenerator-left-mpa3',
        '.bot-temper-verh-regenerator-right-mpa3',
        '.bot-temper-verh-bliznii-left-mpa3',
        '.bot-temper-verh-bliznii-right-mpa3',
        '.bot-temper-verh-dalnii-left-mpa3',
        '.bot-temper-verh-dalnii-right-mpa3',
        '.bot-temper-seredina-bliznii-left-mpa3',
        '.bot-temper-seredina-bliznii-right-mpa3',
        '.bot-temper-seredina-dalnii-left-mpa3',
        '.bot-temper-seredina-dalnii-right-mpa3',
        '.bot-temper-niz-bliznii-left-mpa3',
        '.bot-temper-niz-bliznii-right-mpa3',
        '.bot-temper-niz-dalnii-left-mpa3',
        '.bot-temper-niz-dalnii-right-mpa3',
        '.bot-temper-kamera-smeshenia-mpa3',
        '.bot-temper-dymovoi-borov-mpa3',
      ],
      pressureMpa3: [
        '.bot-davl-dymovoi-borov-mpa3',
        '.bot-davl-vozduh-left-mpa3',
        '.bot-davl-vozduh-right-mpa3',
        '.bot-davl-niz-bliznii-left-mpa3',
        '.bot-davl-niz-bliznii-right-mpa3',
        '.bot-davl-seredina-bliznii-left-mpa3',
        '.bot-davl-seredina-bliznii-right-mpa3',
        '.bot-davl-seredina-dalnii-left-mpa3',
        '.bot-davl-seredina-dalnii-right-mpa3',
        '.bot-davl-verh-dalnii-left-mpa3',
        '.bot-davl-verh-dalnii-right-mpa3',
      ],
      timeMPA: ['.bot-mpa-time'],
    };

    const data = {};

    for (const [key, selectors] of Object.entries(categoriesNotis)) {
      data[key] = extractData(selectors, $Notis);
    }

    for (const [key, selectors] of Object.entries(categoriesPechiMpa)) {
      data[key] = extractData(selectors, $Mpa);
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

      // Печи МПА2
      'Температура Верх регенератора левый МПА2': data.temperatureMpa2[0],
      'Температура Верх регенератора правый МПА2': data.temperatureMpa2[1],
      'Температура Верх ближний левый МПА2': data.temperatureMpa2[2],
      'Температура Верх ближний правый МПА2': data.temperatureMpa2[3],
      'Температура Верх дальний левый МПА2': data.temperatureMpa2[4],
      'Температура Верх дальний правый МПА2': data.temperatureMpa2[5],
      'Температура Середина ближняя левая МПА2': data.temperatureMpa2[6],
      'Температура Середина ближняя правая МПА2': data.temperatureMpa2[7],
      'Температура Середина дальняя левая МПА2': data.temperatureMpa2[8],
      'Температура Середина дальняя правая МПА2': data.temperatureMpa2[9],
      'Температура Низ ближний левый МПА2': data.temperatureMpa2[10],
      'Температура Низ ближний правый МПА2': data.temperatureMpa2[11],
      'Температура Низ дальний левый МПА2': data.temperatureMpa2[12],
      'Температура Низ дальний правый МПА2': data.temperatureMpa2[13],
      'Температура Камера смешения МПА2': data.temperatureMpa2[14],
      'Температура Дымовой боров МПА2': data.temperatureMpa2[15],
      'Давление Дымовой боров МПА2': data.pressureMpa2[0],
      'Давление Воздух левый МПА2': data.pressureMpa2[1],
      'Давление Воздух правый МПА2': data.pressureMpa2[2],
      'Давление Низ ближний левый МПА2': data.pressureMpa2[3],
      'Давление Низ ближний правый МПА2': data.pressureMpa2[4],
      'Давление Середина ближняя левая МПА2': data.pressureMpa2[5],
      'Давление Середина ближняя правая МПА2': data.pressureMpa2[6],
      'Давление Середина дальняя левая МПА2': data.pressureMpa2[7],
      'Давление Середина дальняя правая МПА2': data.pressureMpa2[8],
      'Давление Верх дальний левый МПА2': data.pressureMpa2[9],
      'Давление Верх дальний правый МПА2': data.pressureMpa2[10],
      'Время записи на сервер МПА2': data.timeMPA[0],
      // Печи МПА3
      'Температура Верх регенератора левый МПА3': data.temperatureMpa3[0],
      'Температура Верх регенератора правый МПА3': data.temperatureMpa3[1],
      'Температура Верх ближний левый МПА3': data.temperatureMpa3[2],
      'Температура Верх ближний правый МПА3': data.temperatureMpa3[3],
      'Температура Верх дальний левый МПА3': data.temperatureMpa3[4],
      'Температура Верх дальний правый МПА3': data.temperatureMpa3[5],
      'Температура Середина ближняя левая МПА3': data.temperatureMpa3[6],
      'Температура Середина ближняя правая МПА3': data.temperatureMpa3[7],
      'Температура Середина дальняя левая МПА3': data.temperatureMpa3[8],
      'Температура Середина дальняя правая МПА3': data.temperatureMpa3[9],
      'Температура Низ ближний левый МПА3': data.temperatureMpa3[10],
      'Температура Низ ближний правый МПА3': data.temperatureMpa3[11],
      'Температура Низ дальний левый МПА3': data.temperatureMpa3[12],
      'Температура Низ дальний правый МПА3': data.temperatureMpa3[13],
      'Температура Камера смешения МПА3': data.temperatureMpa3[14],
      'Температура Дымовой боров МПА3': data.temperatureMpa3[15],
      'Давление Дымовой боров МПА3': data.pressureMpa3[0],
      'Давление Воздух левый МПА3': data.pressureMpa3[1],
      'Давление Воздух правый МПА3': data.pressureMpa3[2],
      'Давление Низ ближний левый МПА3': data.pressureMpa3[3],
      'Давление Низ ближний правый МПА3': data.pressureMpa3[4],
      'Давление Середина ближняя левая МПА3': data.pressureMpa3[5],
      'Давление Середина ближняя правая МПА3': data.pressureMpa3[6],
      'Давление Середина дальняя левая МПА3': data.pressureMpa3[7],
      'Давление Середина дальняя правая МПА3': data.pressureMpa3[8],
      'Давление Верх дальний левый МПА3': data.pressureMpa3[9],
      'Давление Верх дальний правый МПА3': data.pressureMpa3[10],
      'Время записи на сервер МПА3': data.timeMPA[0],
    };

    for (const [key, value] of Object.entries(namedData)) {
      try {
        await axios.post('http://169.254.6.19:3001/update-values', { [key]: value }, {
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

setInterval(fetchData, 30000);

// Функция для получения и отправки данных VR1 и VR2 в формате с конкретными названиями
export async function fetchDataVR() {
  try {
    // Запрашиваем данные для VR1 и VR2
    const responseVr1 = await axios.get('http://169.254.0.156:3002/api/vr1-data');
    const responseVr2 = await axios.get('http://169.254.0.156:3002/api/vr2-data');

       // Проверка, что данные для VR1 и VR2 были успешно получены
       if (!responseVr1.data || !responseVr2.data) {
        console.error("Ошибка: данные VR1 или VR2 не получены или пусты");
        return;
      }

    // Обрабатываем JSON-данные для VR1 и VR2
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
      'Давление газов после скруббера печь ВР1': vr1Data.pressures['Газов после скруббера'],
      'Давление пара в барабане котла печь ВР1': vr1Data.pressures['Пара в барабане котла'],
      'Разрежение в топке печи печь ВР1': vr1Data.vacuums['В топке печи'],
      'Разрежение в пространстве котла утилизатора печь ВР1': vr1Data.vacuums['В котле утилизаторе'],
      'Разрежение низ загрузочной камеры печь ВР1': vr1Data.vacuums['Низ загрузочной камеры'],
      'Исполнительный механизм котла печь ВР1': vr1Data.im['ИМ5 котел-утилизатор'],
      'Мощность горелки печь ВР1': vr1Data.gorelka['Текущая мощность горелки'],
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
      'Давление газов после скруббера печь ВР2': vr2Data.pressures['Газов после скруббера'],
      'Давление пара в барабане котла печь ВР2': vr2Data.pressures['Пара в барабане котла'],
      'Разрежение в топке печи печь ВР2': vr2Data.vacuums['В топке печи'],
      'Разрежение в пространстве котла утилизатора печь ВР2': vr2Data.vacuums['В котле утилизаторе'],
      'Разрежение низ загрузочной камеры печь ВР2': vr2Data.vacuums['Низ загрузочной камеры'],
      'Исполнительный механизм котла печь ВР2': vr2Data.im['ИМ5 котел-утилизатор'],
      'Мощность горелки печь ВР2': vr2Data.gorelka['Текущая мощность горелки'],
      'Время записи на сервер для печь ВР2': vr2Data.lastUpdated,
    };

    // Функция для отправки данных на сервер
    const postData = async (data, systemName) => {
      for (const [key, value] of Object.entries(data)) {
        try {
          // console.log(`Отправка данных ${systemName}: ${key} = ${value}`); // Вывод данных в консоль
          await axios.post('http://169.254.6.19:3001/update-values', { [key]: value }, {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (error) {
          console.error(`Ошибка при отправке данных для ключа: ${key}`, error.response ? error.response.data : error.message);
        }
      }
    };

    // Отправляем данные VR1 и VR2
    await postData(namedVr1Data, 'Печь ВР1');
    await postData(namedVr2Data, 'Печь ВР2');
  } catch (error) {
    console.error('Ошибка при получении данных для VR1 и VR2:', error.message);
  }
}

// Устанавливаем интервал обновления данных каждые 30 секунд
setInterval(fetchDataVR, 30000);