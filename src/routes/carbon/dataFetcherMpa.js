import axios from "axios";
import { FurnaceMPA2, FurnaceMPA3 } from "../../models/FurnanceMPAModel.js";

// Функция для получения и отправки данных MPA2 и MPA3 в формате с конкретными названиями
export async function fetchDataMPA() {
  try {
    // Запрашиваем данные для MPA2 и MPA3
    const responseMPA2 = await axios.get('http://169.254.0.156:3002/api/mpa2-data');
    const responseMPA3 = await axios.get('http://169.254.0.156:3002/api/mpa3-data');

    // Проверяем, что данные получены
    if (!responseMPA2.data || !responseMPA3.data) {
      console.error('Ошибка: данные MPA2 или MPA3 не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные
    const MPA2Data = responseMPA2.data;
    const MPA3Data = responseMPA3.data;

    // Формируем объекты с конкретными названиями полей, как в старом примере
    const namedMPA2Data = {
      ...MPA2Data.temperatures,
      ...MPA2Data.pressures,
      'Время записи на сервер для печь МПА2': MPA2Data.lastUpdated,
    };

    const namedMPA3Data = {
      ...MPA3Data.temperatures,
      ...MPA3Data.pressures,
      'Время записи на сервер для печь МПА3': MPA3Data.lastUpdated,
    };

    // Сохраняем данные для MPA2
    await FurnaceMPA2.create({
      data: namedMPA2Data,
      timestamp: new Date(),
    });

    // Сохраняем данные для MPA3
    await FurnaceMPA3.create({
      data: namedMPA3Data,
      timestamp: new Date(),
    });

    // console.log('Данные MPA2 и MPA3 успешно сохранены.');
    // console.log(responseMPA2.data)
  } catch (error) {
    console.error('Ошибка при получении данных для MPA2 и MPA3:', error.message);
  }
}


// Устанавливаем интервал обновления данных каждые 10 секунд
setInterval(fetchDataMPA, 10000);