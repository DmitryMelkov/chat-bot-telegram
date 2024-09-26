// routes/updateValues.js
import { initialData } from '../data/initialData.js';
import { FurnaceVR1, FurnaceVR2 } from '../models/FurnanceModel.js';
import { NotisVR1, NotisVR2 } from '../models/NotisModel.js'; // Подключаем модели нотисов

export const updateValuesRoute = (app) => {
  app.post('/update-values', async (req, res) => {
    const data = req.body;
    const key = Object.keys(data)[0];
    const value = data[key];

    // Инициализация данных в памяти
    if (!app.locals.data) {
      app.locals.data = initialData;
    }

    // Обновляем данные в памяти
    app.locals.data[key] = value;

    // Определяем коллекцию для сохранения данных
    let model;

    // Проверяем ключи для печей и нотисов
    if (key.includes('ВР1') && !key.includes('Нотис')) {
      model = FurnaceVR1;
    } else if (key.includes('ВР2') && !key.includes('Нотис')) {
      model = FurnaceVR2;
    } else if (key.includes('Нотис ВР1')) {
      model = NotisVR1;
    } else if (key.includes('Нотис ВР2')) {
      model = NotisVR2;
    } else {
      return res.status(400).send('Некорректный ключ данных.');
    }

    try {
      // Сохраняем данные в соответствующей коллекции
      await model.create({ key, value });
      res.send('Данные успешно сохранены.');
    } catch (err) {
      console.error('Ошибка при сохранении данных:', err);
      res.status(500).send('Ошибка при сохранении данных.');
    }
  });
};
