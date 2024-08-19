// routes/updateValues.js
import { initialData } from '../data/initialData.js';
import { FurnaceVR1, FurnaceVR2 } from '../models/FurnanceModel.js';

export const updateValuesRoute = (app) => {
  app.post('/update-values', async (req, res) => {
    const data = req.body;
    const key = Object.keys(data)[0];
    const value = data[key];

    // console.log(`Получен ключ: ${key}, значение: ${value}`);

    if (!app.locals.data) {
      app.locals.data = initialData;
    }

    // console.log('Полученные данные:', data);
    app.locals.data[key] = value;

    // Определяем, в какую коллекцию записывать данные
    let model;
    if (key.includes('ВР1')) {
      model = FurnaceVR1;
    } else if (key.includes('ВР2')) {
      model = FurnaceVR2;
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
