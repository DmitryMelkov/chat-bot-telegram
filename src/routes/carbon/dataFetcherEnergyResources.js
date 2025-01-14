import axios from "axios";
import {
  imDD569Model,
  imDD576Model,
  imDD923Model,
  imDD924Model,
  imDD972Model,
  imDD973Model,
  imDE093Model
} from "../../models/EnergyResourcesModel.js";

// Функция для преобразования формата даты
function parseDate(dateString) {
  const [datePart, timePart] = dateString.split(', ');
  const [day, month, year] = datePart.split('.');
  return new Date(`${year}-${month}-${day}T${timePart}`);
}

// Функция для получения данных из API uzliUchetaCarbon
export async function fetchDataUzliUcheta() {
  try {
    // Запрашиваем данные
    const response = await axios.get('http://169.254.0.156:3002/api/uzliUchetaCarbon');

    // Проверяем, что данные получены
    if (!response.data) {
      console.error('Ошибка: данные не получены или пусты');
      return;
    }

    // Обрабатываем JSON-данные
    const uzliData = response.data;

    // В зависимости от типа данных сохраняем их в соответствующую модель
    const modelMap = {
      'DE093': imDE093Model,
      'DD972': imDD972Model,
      'DD973': imDD973Model,
      'DD576': imDD576Model,
      'DD569': imDD569Model,
      'DD923': imDD923Model,
      'DD924': imDD924Model,
    };

    // Перебираем объект uzliData
    for (const [key, item] of Object.entries(uzliData)) {
      const { device, data, lastUpdated } = item; // Извлекаем устройство, данные и время обновления

      const Model = modelMap[device]; // Получаем модель по типу устройства
      if (Model) {
        // Создаем новый документ и сохраняем его
        const newDocument = new Model({
          data: data, // Здесь предполагается, что data - это объект, соответствующий типу Map в вашей модели
          lastUpdated: parseDate(lastUpdated), // Преобразуем строку даты
        });

        await newDocument.save();
        // console.log(`Данные сохранены в модель ${device}`);
      } else {
        console.error(`Неизвестный тип данных: ${device}`);
      }
    }

  } catch (error) {
    console.error('Ошибка при получении данных для uzliUcheta:', error.message);
  }
}

// Устанавливаем интервал обновления данных каждые 10 секунд
setInterval(fetchDataUzliUcheta, 10000);
