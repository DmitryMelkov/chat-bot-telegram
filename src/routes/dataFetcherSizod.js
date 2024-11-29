import axios from 'axios';
import { DotEKO } from '../models/SizodModel.js';

export async function fetchDataSizod() {
  try {
    // Запрашиваем данные для DotEKO
    const responseDotEko = await axios.get('http://169.254.0.165:3002/api/dot-eko');
    const dotEkoData = responseDotEko.data;

    // Формируем объект данных с именованными ключами
    const namedDotEkoData = {
      'Лыжа левая ДОТ-ЭКО': dotEkoData.leftSki,
      'Лыжа правая ДОТ-ЭКО': dotEkoData.rightSki,
      'Брак ДОТ-ЭКО': dotEkoData.defect,
      'Время работы ДОТ-ЭКО': dotEkoData.shiftTime,
      'Сумма двух лыж ДОТ-ЭКО': dotEkoData.totalSki,
      'Статус работы ДОТ-ЭКО': dotEkoData.lineStatusValue,
      'Время записи на сервер ДОТ-ЭКО': dotEkoData.lastUpdated,
      'Лыжа левая рапорт ДОТ-ЭКО': dotEkoData.leftSkiReport,
      'Лыжа правая рапорт ДОТ-ЭКО': dotEkoData.rightSkiReport,
      'Брак рапорт ДОТ-ЭКО': dotEkoData.defectReport,
      'Сумма двух лыж рапорт ДОТ-ЭКО': dotEkoData.totalSkiReport,
      'Время работы рапорт ДОТ-ЭКО': dotEkoData.workTime,
    };

    // Создаём новый документ, в котором все данные записаны в одном поле `data`
    await DotEKO.create({
      data: namedDotEkoData,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Ошибка при получении или сохранении данных для DotEKO:', error.message);
  }
}

// Устанавливаем интервал обновления для DotEKO каждые 10 секунд
setInterval(fetchDataSizod, 10000);
