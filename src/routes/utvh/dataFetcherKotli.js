import axios from 'axios';
import mongoose from 'mongoose';
import { Kotel1, Kotel2, Kotel3 } from '../../models/KotliModel.js';

export async function fetchDataKotels() {
  try {
    const responseKotel1 = await axios.get('http://169.254.6.19:3005/api/kotel1-data');
    const responseKotel2 = await axios.get('http://169.254.6.19:3005/api/kotel2-data');
    const responseKotel3 = await axios.get('http://169.254.6.19:3005/api/kotel3-data');

    if (!responseKotel1.data || !responseKotel2.data || !responseKotel3.data) {
      console.error('Ошибка: данные одного из котлов не получены или пусты');
      return;
    }

    let kotel1Data = responseKotel1.data;
    let kotel2Data = responseKotel2.data;
    let kotel3Data = responseKotel3.data;

    // Проверяем структуру данных
    if (!kotel1Data.parameters || !kotel1Data.info || !kotel1Data.alarms) {
      console.error('Ошибка: данные Kotel1 не соответствуют ожидаемой структуре');
      return;
    }
    if (!kotel2Data.parameters || !kotel2Data.info || !kotel2Data.alarms) {
      console.error('Ошибка: данные Kotel2 не соответствуют ожидаемой структуре');
      return;
    }
    if (!kotel3Data.parameters || !kotel3Data.info || !kotel3Data.alarms) {
      console.error('Ошибка: данные Kotel3 не соответствуют ожидаемой структуре');
      return;
    }

    // Функция для проверки и замены _id
    const checkAndReplaceId = async (data, model, kotelName) => {
      if (data._id) {
        const existingDoc = await model.findById(data._id);
        if (existingDoc) {
          // Если документ с таким _id уже существует, генерируем новый _id
          console.log(`Обнаружен дубликат _id для ${kotelName}. Генерация нового _id...`);
          data._id = new mongoose.Types.ObjectId(); // Генерация нового ObjectId
          console.log(`Новый _id для ${kotelName}: ${data._id}`);
        }
      }
      return data;
    };

    // Проверяем и заменяем _id для каждого котла
    kotel1Data = await checkAndReplaceId(kotel1Data, Kotel1, 'Kotel1');
    kotel2Data = await checkAndReplaceId(kotel2Data, Kotel2, 'Kotel2');
    kotel3Data = await checkAndReplaceId(kotel3Data, Kotel3, 'Kotel3');

    // Вставляем данные
    await Kotel1.create(kotel1Data);
    await Kotel2.create(kotel2Data);
    await Kotel3.create(kotel3Data);
  } catch (error) {
    console.error('Ошибка при получении данных для котлов:', error.response?.data || error.message);
  }
}

setInterval(fetchDataKotels, 10000);
