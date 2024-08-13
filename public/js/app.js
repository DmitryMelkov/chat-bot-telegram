const temperatureData = {
  temperatureValue1: null,
  temperatureValue2: null,
  temperatureValue3: null,
};

const sendDataToServer = (data) => {
  fetch('http://169.254.7.86:92/update-values', {
    // Ваш адрес сервера
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((result) => console.log('Результат:', result))
    .catch((error) => console.error('Ошибка:', error));
};

window.addEventListener('message', (event) => {
  if (event.origin !== 'http://techsite4') {
    return;
  }

  const message = event.data;
  const temperatureTypes = {
    temperatureValue1: 'temperatureValue1',
    temperatureValue2: 'temperatureValue2',
    temperatureValue3: 'temperatureValue3',
  };

  if (temperatureTypes[message.type]) {
    if (message.value !== null) {
      // Обновляем объект с температурными значениями
      temperatureData[temperatureTypes[message.type]] = message.value;
      console.log(`Обновлено ${temperatureTypes[message.type]}:`, temperatureData[temperatureTypes[message.type]]);

      // Отправляем обновленные данные на сервер
      sendDataToServer(temperatureData);
    }
  }
});
