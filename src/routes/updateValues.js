// routes/updateValues.js
import { initialData } from '../data/initialData.js';

export const updateValuesRoute = (app) => {
  app.post('/update-values', (req, res) => {
    const data = req.body;
    const key = Object.keys(data)[0];
    const value = data[key];

    if (!app.locals.data) {
      app.locals.data = initialData;
    }

    console.log('Полученные данные:', data);
    app.locals.data[key] = value;

    res.send('Данные успешно получены.');
  });
};
