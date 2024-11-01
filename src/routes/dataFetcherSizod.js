import axios from 'axios';

// Функция для получения данных для DotEKO
export async function fetchDataSizod() {
  try {
    // Запрашиваем данные для СИЗОД (DotEKO)
    const responseDotEko = await axios.get('http://169.254.7.86:3002/api/mongo-value');
    const dotEkoData = responseDotEko.data;

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

    // Отправляем данные на сервер
    for (const [key, value] of Object.entries(namedDotEkoData)) {
      try {
        const response = await axios.post('http://169.254.6.19:3001/update-values', JSON.stringify({ [key]: value }), {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error(`Ошибка при отправке данных для ключа: ${key}`, error.response ? error.response.data : error.message);
      }
    }
  } catch (error) {
    console.error('Ошибка при получении данных для DotEKO:', error.message);
  }
}

// Устанавливаем интервал обновления для DotEko каждые 10 секунд
setInterval(fetchDataSizod, 10000);