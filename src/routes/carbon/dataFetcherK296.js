import axios from 'axios';
import { Mill1, Mill2, Mill10b } from '../../models/MillModel.js';
import { ReactorK296 } from '../../models/ReactorModel.js';

// Функция для получения и отправки данных Мельниц в формате с конкретными названиями
export async function fetchDataMill() {
  try {
    // Запрашиваем данные для Мельниц
    const responseMill1 = await axios.get('http://169.254.0.156:3002/api/mill1-data');
    const responseMill2 = await axios.get('http://169.254.0.156:3002/api/mill2-data');
    const responseMill10b = await axios.get('http://169.254.0.156:3002/api/mill10b-data');

    // Проверяем, что данные получены
    if (!responseMill1.data || !responseMill2.data || !responseMill10b.data ) {
      console.error('Ошибка: данные для одной из Мельниц не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные для Мельниц
    const mill1Data = responseMill1.data;
    const mill2Data = responseMill2.data;
    const mill10bData = responseMill10b.data;

    // Формируем объекты с конкретными названиями полей, как в старом примере
    const namedMill1Data = {
      'Фронтальная вибрация Мельница №1': mill1Data.data['Фронтальное Мельница 1'],
      'Поперечная вибрация Мельница №1': mill1Data.data['Поперечное Мельница 1'],
      'Осевая вибрация Мельница №1': mill1Data.data['Осевое Мельница 1'],
      'Время записи на сервер для Мельницы №1': mill1Data.lastUpdated,
    };

    const namedMill2Data = {
      'Фронтальная вибрация Мельница №2': mill2Data.data['Фронтальное Мельница 2'],
      'Поперечная вибрация Мельница №2': mill2Data.data['Поперечное Мельница 2'],
      'Осевая вибрация Мельница №2': mill2Data.data['Осевое Мельница 2'],
      'Время записи на сервер для Мельницы №2': mill2Data.lastUpdated,
    };

    const namedMill10bData = {
      'Фронтальная вибрация YGM-9517': mill10bData.data['Фронтальное YGM9517'],
      'Поперечная вибрация YGM-9517': mill10bData.data['Поперечное YGM9517'],
      'Осевая вибрация YGM-9517': mill10bData.data['Осевое YGM9517'],
      'Вертикальная вибрация ШБМ3': mill10bData.data['Вертикальное ШБМ3'],
      'Поперечная вибрация ШБМ3': mill10bData.data['Поперечное ШБМ3'],
      'Осевая вибрация ШБМ3': mill10bData.data['Осевое ШБМ3'],
      'Фронтальная вибрация YCVOK-130': mill10bData.data['Фронтальное YCVOK130'],
      'Поперечная вибрация YCVOK-130': mill10bData.data['Поперечное YCVOK130'],
      'Осевая вибрация YCVOK-130': mill10bData.data['Осевое YCVOK130'],
      'Время записи на сервер для Мельниц (к10б)': mill10bData.lastUpdated,
    };

    // Сохраняем данные для Мельницы №1
    await Mill1.create({
      data: namedMill1Data,
      timestamp: new Date(),
    });

    // Сохраняем данные для Мельницы №2
    await Mill2.create({
      data: namedMill2Data,
      timestamp: new Date(),
    });

     // Сохраняем данные для Мельниц (к10б)
     await Mill10b.create({
      data: namedMill10bData,
      timestamp: new Date(),
    });

    // console.log('Данные Мельниц успешно сохранены.');
  } catch (error) {
    console.error('Ошибка при получении данных для Мельниц:', error.message);
  }
}

setInterval(fetchDataMill, 10000);

// Функция для получения и отправки данных Смоляных реакторов в формате с конкретными названиями
export async function fetchDataReactorK296() {
  try {
    // Запрашиваем данные для Смоляных реакторов
    const responseReactorK296 = await axios.get('http://169.254.0.156:3002/api/reactork296-data');

    // Проверяем, что данные получены
    if (!responseReactorK296.data ) {
      console.error('Ошибка: данные для одного из Смоляных реакторов не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные для Смоляных реакторов
    const reactorK296Data = responseReactorK296.data;

    // Формируем объекты с конкретными названиями полей, как в старом примере
    const namedReactorK296Data = {
      'Температура реактора 45/1': reactorK296Data.temperatures['Температура реактора 45/1'],
      'Температура реактора 45/2': reactorK296Data.temperatures['Температура реактора 45/2'],
      'Температура реактора 45/3': reactorK296Data.temperatures['Температура реактора 45/3'],
      'Температура реактора 45/4': reactorK296Data.temperatures['Температура реактора 45/4'],
      'Уровень реактора 45/1': reactorK296Data.levels['Уровень реактора 45/1'],
      'Уровень реактора 45/2': reactorK296Data.levels['Уровень реактора 45/2'],
      'Уровень реактора 45/3': reactorK296Data.levels['Уровень реактора 45/3'],
      'Уровень реактора 45/4': reactorK296Data.levels['Уровень реактора 45/4'],
      'Время записи на сервер для Смоляных реакторов': reactorK296Data.lastUpdated,
    };

    // Сохраняем данные для Смоляных реакторов
    await ReactorK296.create({
      data: namedReactorK296Data,
      timestamp: new Date(),
    });

    // console.log('Данные Смоляных реакторов успешно сохранены.');
  } catch (error) {
    console.error('Ошибка при получении данных для Смоляных реакторов:', error.message);
  }
}

setInterval(fetchDataReactorK296, 10000);