const temperatureData = {
  temperature1: null,
  temperature2: null,
  temperature3: null,
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
    temperature1: 'Температура 1-СК',
    temperature2: 'Температура 2-СК',
    temperature3: 'Температура 3-СК',
  };

  if (temperatureTypes[message.type]) {
    if (message.value !== null) {
      const dataToSend = {};
      dataToSend[temperatureTypes[message.type]] = message.value;
      console.log('Отправка данных на сервер:', dataToSend); // Добавьте логирование
      sendDataToServer(dataToSend);
    }
  }
});
