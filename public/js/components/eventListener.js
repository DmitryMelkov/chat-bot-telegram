import { types } from '../types/types.js';
import { sendDataToServer } from '../api/api.js';

export const setupEventListener = () => {
  window.addEventListener('message', (event) => {
    if (event.origin !== 'http://techsite4') {
      return;
    }

    const { type, value } = event.data;

    if (value !== null) {
      for (const category in types) {
        if (types[category][type]) {
          const dataToSend = { [types[category][type]]: value };
          console.log('Отправка данных на сервер:', dataToSend);
          sendDataToServer(dataToSend);
          break;
        }
      }
    }
  });
};